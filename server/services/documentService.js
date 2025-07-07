// Dynamic import for pdf-parse to avoid initialization issues
import mammoth from 'mammoth';
import { createClient } from '@supabase/supabase-js';
import { storeDocument } from './pineconeService.js';
import crypto from 'crypto';

// Initialize Supabase client with error handling
let supabase = null;
try {
  if (process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && 
      process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your_service_role_key_here') {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  } else {
    console.warn('Supabase configuration missing or using placeholder values');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message);
}

// Extract text from different file types
async function extractTextFromFile(file) {
  try {
    const { buffer, mimetype, originalname } = file;
    
    let extractedText = '';
    
    switch (mimetype) {
      case 'application/pdf':
        const pdfParse = (await import('pdf-parse')).default;
        const data = await pdfParse(buffer);
        extractedText = data.text;
        break;
        
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docResult = await mammoth.extractRawText({ buffer });
        extractedText = docResult.value;
        break;
        
      default:
        throw new Error(`Unsupported file type: ${mimetype}`);
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from the document');
    }
    
    console.log(`Extracted ${extractedText.length} characters from ${originalname}`);
    return extractedText;
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

// Upload file to Supabase storage
async function uploadToSupabase(file) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.');
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('legal-documents')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    console.log(`File uploaded to Supabase: ${filePath}`);
    return {
      path: data.path,
      fullPath: data.fullPath,
      fileName: fileName
    };
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }
}

// Store document metadata in Supabase database
async function storeDocumentMetadata(documentId, metadata) {
  try {
    if (!supabase) {
      console.warn('Supabase client not initialized. Skipping metadata storage.');
      return null;
    }

    // First, check if documents table exists, if not create it
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'documents');
    
    if (tablesError || !tables || tables.length === 0) {
      // Create documents table
      const { error: createError } = await supabase.rpc('create_documents_table');
      if (createError) {
        console.log('Documents table might already exist or creation failed:', createError.message);
      }
    }
    
    const { data, error } = await supabase
      .from('documents')
      .insert({
        id: documentId,
        title: metadata.title,
        type: metadata.type,
        file_path: metadata.filePath,
        file_name: metadata.fileName,
        file_size: metadata.fileSize,
        mime_type: metadata.mimeType,
        text_length: metadata.textLength,
        processed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Database insert error:', error);
      // Don't throw error here as the main processing should continue
    } else {
      console.log(`Document metadata stored: ${documentId}`);
    }
    
    return data;
  } catch (error) {
    console.error('Store metadata error:', error);
    // Don't throw error here as the main processing should continue
  }
}

// Analyze document content to determine type and extract metadata
function analyzeDocumentContent(text, fileName) {
  const lowerText = text.toLowerCase();
  const lowerFileName = fileName.toLowerCase();
  
  let documentType = 'Legal Document';
  let title = fileName.replace(/\.[^/.]+$/, ''); // Remove file extension
  
  // Determine document type based on content
  if (lowerText.includes('goods and services tax') || lowerText.includes('gst') || lowerFileName.includes('gst')) {
    documentType = 'GST Act';
  } else if (lowerText.includes('income tax') || lowerText.includes('income-tax') || lowerFileName.includes('income')) {
    documentType = 'Income Tax Act';
  } else if (lowerText.includes('supreme court') || lowerText.includes('high court') || lowerText.includes('judgment') || lowerText.includes('court')) {
    documentType = 'Court Judgment';
  } else if (lowerText.includes('property') || lowerText.includes('real estate') || lowerText.includes('land')) {
    documentType = 'Property Law';
  }
  
  // Extract title from content if possible
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 0) {
    // Use first non-empty line as title if it's not too long
    const firstLine = lines[0].trim();
    if (firstLine.length > 10 && firstLine.length < 200) {
      title = firstLine;
    }
  }
  
  // Extract section information
  let section = 'N/A';
  const sectionMatch = text.match(/(section|rule|article|chapter)\s+\d+[a-z]*/i);
  if (sectionMatch) {
    section = sectionMatch[0];
  }
  
  return {
    type: documentType,
    title: title,
    section: section
  };
}

// Chunk large documents for better processing
function chunkDocument(text, maxChunkSize = 2000, overlap = 200) {
  const chunks = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  let currentSize = 0;
  
  for (const sentence of sentences) {
    const sentenceLength = sentence.length;
    
    if (currentSize + sentenceLength > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      
      // Start new chunk with overlap
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 6)); // Approximate word count for overlap
      currentChunk = overlapWords.join(' ') + ' ' + sentence;
      currentSize = currentChunk.length;
    } else {
      currentChunk += sentence + '. ';
      currentSize += sentenceLength + 2;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text]; // Return original text if chunking fails
}

// Main function to upload and process document
async function uploadAndProcessDocument(file) {
  try {
    console.log(`Processing document: ${file.originalname}`);
    
    // Extract text from file
    const extractedText = await extractTextFromFile(file);
    
    // Upload file to Supabase storage
    const uploadResult = await uploadToSupabase(file);
    
    // Analyze document content
    const analysis = analyzeDocumentContent(extractedText, file.originalname);
    
    // Generate unique document ID
    const documentId = crypto.randomUUID();
    
    // Prepare metadata
    const metadata = {
      title: analysis.title,
      type: analysis.type,
      section: analysis.section,
      fileName: file.originalname,
      filePath: uploadResult.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      textLength: extractedText.length
    };
    
    // Store document metadata in Supabase
    await storeDocumentMetadata(documentId, metadata);
    
    // Chunk document if it's too large
    const chunks = chunkDocument(extractedText);
    console.log(`Document split into ${chunks.length} chunks`);
    
    // Store each chunk in Pinecone
    const storePromises = chunks.map(async (chunk, index) => {
      const chunkId = chunks.length > 1 ? `${documentId}_chunk_${index}` : documentId;
      const chunkMetadata = {
        ...metadata,
        chunkIndex: index,
        totalChunks: chunks.length,
        originalDocumentId: documentId
      };
      
      return storeDocument(chunkId, chunk, chunkMetadata);
    });
    
    await Promise.all(storePromises);
    
    console.log(`Document ${documentId} processed and stored successfully`);
    
    return {
      documentId,
      chunksStored: chunks.length,
      metadata,
      uploadResult
    };
  } catch (error) {
    console.error('Document processing error:', error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
}

export {
  uploadAndProcessDocument,
  extractTextFromFile,
  analyzeDocumentContent,
  chunkDocument
};