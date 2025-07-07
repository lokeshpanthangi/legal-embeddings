import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

let pinecone;
let openai;
let index;

// Initialize Pinecone and OpenAI clients
async function initializePinecone() {
  try {
    // Initialize Pinecone with error handling
    if (process.env.PINECONE_API_KEY && process.env.PINECONE_API_KEY !== 'your_pinecone_api_key_here') {
      pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });
    } else {
      console.warn('Pinecone API key missing or using placeholder value');
      throw new Error('Pinecone API key not configured');
    }

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.warn('OpenAI API key missing or using placeholder value');
      throw new Error('OpenAI API key not configured');
    }

    // Get or create index
    const indexName = process.env.PINECONE_INDEX_NAME || 'legal-embeddings';
    
    try {
      index = pinecone.index(indexName);
      console.log(`Connected to existing Pinecone index: ${indexName}`);
    } catch (error) {
      console.log(`Creating new Pinecone index: ${indexName}`);
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536, // OpenAI embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      
      // Wait for index to be ready
      await new Promise(resolve => setTimeout(resolve, 10000));
      index = pinecone.index(indexName);
    }

    return { pinecone, openai, index };
  } catch (error) {
    console.error('Failed to initialize Pinecone:', error);
    throw error;
  }
}

// Generate embeddings using OpenAI
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Store document in Pinecone with metadata
async function storeDocument(documentId, text, metadata) {
  try {
    const embedding = await generateEmbedding(text);
    
    const vector = {
      id: documentId,
      values: embedding,
      metadata: {
        ...metadata,
        text: text.substring(0, 1000), // Store first 1000 chars for preview
        timestamp: new Date().toISOString()
      }
    };

    await index.upsert([vector]);
    console.log(`Document ${documentId} stored in Pinecone`);
    return documentId;
  } catch (error) {
    console.error('Error storing document:', error);
    throw error;
  }
}

// Cosine Similarity Search
async function cosineSearch(queryText, topK = 5) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      includeValues: false
    });

    return searchResponse.matches.map(match => ({
      id: match.id,
      title: match.metadata.title || 'Untitled Document',
      type: match.metadata.type || 'Legal Document',
      relevance: match.score,
      preview: match.metadata.text || 'No preview available',
      section: match.metadata.section || 'N/A'
    }));
  } catch (error) {
    console.error('Cosine search error:', error);
    throw error;
  }
}

// Euclidean Distance Search
async function euclideanSearch(queryText, topK = 5) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    
    // Get more results for euclidean calculation
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: topK * 3,
      includeMetadata: true,
      includeValues: true
    });

    // Calculate euclidean distances
    const resultsWithEuclidean = searchResponse.matches.map(match => {
      const euclideanDistance = calculateEuclideanDistance(queryEmbedding, match.values);
      return {
        ...match,
        euclideanDistance,
        // Convert distance to similarity score (lower distance = higher similarity)
        euclideanSimilarity: 1 / (1 + euclideanDistance)
      };
    });

    // Sort by euclidean similarity and take top K
    const sortedResults = resultsWithEuclidean
      .sort((a, b) => b.euclideanSimilarity - a.euclideanSimilarity)
      .slice(0, topK);

    return sortedResults.map(match => ({
      id: match.id,
      title: match.metadata.title || 'Untitled Document',
      type: match.metadata.type || 'Legal Document',
      relevance: match.euclideanSimilarity,
      preview: match.metadata.text || 'No preview available',
      section: match.metadata.section || 'N/A'
    }));
  } catch (error) {
    console.error('Euclidean search error:', error);
    throw error;
  }
}

// MMR (Maximum Marginal Relevance) Search
async function mmrSearch(queryText, topK = 5, lambda = 0.7) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    
    // Get more candidates for MMR selection
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: topK * 4,
      includeMetadata: true,
      includeValues: true
    });

    if (searchResponse.matches.length === 0) {
      return [];
    }

    const candidates = searchResponse.matches;
    const selected = [];
    const remaining = [...candidates];

    // Select first document (highest similarity)
    selected.push(remaining.shift());

    // MMR selection for remaining documents
    while (selected.length < topK && remaining.length > 0) {
      let bestScore = -Infinity;
      let bestIndex = -1;

      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        
        // Relevance score (cosine similarity with query)
        const relevance = candidate.score;
        
        // Diversity score (minimum similarity with already selected documents)
        let maxSimilarity = 0;
        for (const selectedDoc of selected) {
          const similarity = calculateCosineSimilarity(candidate.values, selectedDoc.values);
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }
        
        // MMR score: λ * relevance - (1-λ) * maxSimilarity
        const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarity;
        
        if (mmrScore > bestScore) {
          bestScore = mmrScore;
          bestIndex = i;
        }
      }

      if (bestIndex >= 0) {
        selected.push(remaining.splice(bestIndex, 1)[0]);
      } else {
        break;
      }
    }

    return selected.map(match => ({
      id: match.id,
      title: match.metadata.title || 'Untitled Document',
      type: match.metadata.type || 'Legal Document',
      relevance: match.score,
      preview: match.metadata.text || 'No preview available',
      section: match.metadata.section || 'N/A'
    }));
  } catch (error) {
    console.error('MMR search error:', error);
    throw error;
  }
}

// Hybrid Similarity Search (0.6×Cosine + 0.4×Legal_Entity_Match)
async function hybridSearch(queryText, topK = 5) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);
    
    // Extract legal entities from query
    const queryEntities = extractLegalEntities(queryText);
    
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: topK * 2,
      includeMetadata: true,
      includeValues: false
    });

    // Calculate hybrid scores
    const resultsWithHybridScore = searchResponse.matches.map(match => {
      const cosineScore = match.score;
      
      // Calculate legal entity match score
      const docEntities = extractLegalEntities(match.metadata.text || '');
      const entityMatchScore = calculateEntityMatchScore(queryEntities, docEntities);
      
      // Hybrid score: 0.6 * cosine + 0.4 * entity_match
      const hybridScore = 0.6 * cosineScore + 0.4 * entityMatchScore;
      
      return {
        ...match,
        hybridScore,
        entityMatchScore
      };
    });

    // Sort by hybrid score and take top K
    const sortedResults = resultsWithHybridScore
      .sort((a, b) => b.hybridScore - a.hybridScore)
      .slice(0, topK);

    return sortedResults.map(match => ({
      id: match.id,
      title: match.metadata.title || 'Untitled Document',
      type: match.metadata.type || 'Legal Document',
      relevance: match.hybridScore,
      preview: match.metadata.text || 'No preview available',
      section: match.metadata.section || 'N/A'
    }));
  } catch (error) {
    console.error('Hybrid search error:', error);
    throw error;
  }
}

// Helper function to calculate euclidean distance
function calculateEuclideanDistance(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    sum += Math.pow(vec1[i] - vec2[i], 2);
  }
  return Math.sqrt(sum);
}

// Helper function to calculate cosine similarity
function calculateCosineSimilarity(vec1, vec2) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Helper function to extract legal entities
function extractLegalEntities(text) {
  const legalTerms = [
    'section', 'act', 'rule', 'regulation', 'amendment', 'clause', 'subsection',
    'gst', 'income tax', 'property law', 'court', 'judgment', 'supreme court',
    'high court', 'tribunal', 'commissioner', 'assessment', 'appeal', 'penalty',
    'exemption', 'deduction', 'liability', 'compliance', 'notification'
  ];
  
  const entities = [];
  const lowerText = text.toLowerCase();
  
  legalTerms.forEach(term => {
    if (lowerText.includes(term)) {
      entities.push(term);
    }
  });
  
  // Extract section numbers (e.g., "Section 80C", "Rule 114")
  const sectionRegex = /(section|rule|article)\s+\d+[a-z]*/gi;
  const sectionMatches = text.match(sectionRegex) || [];
  entities.push(...sectionMatches.map(match => match.toLowerCase()));
  
  return [...new Set(entities)]; // Remove duplicates
}

// Helper function to calculate entity match score
function calculateEntityMatchScore(queryEntities, docEntities) {
  if (queryEntities.length === 0) return 0;
  
  const matches = queryEntities.filter(entity => 
    docEntities.some(docEntity => 
      docEntity.includes(entity) || entity.includes(docEntity)
    )
  );
  
  return matches.length / queryEntities.length;
}

export {
  initializePinecone,
  generateEmbedding,
  storeDocument,
  cosineSearch,
  euclideanSearch,
  mmrSearch,
  hybridSearch
};