-- Create documents table for storing document metadata
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Legal Document',
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  text_length INTEGER,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_file_name ON documents(file_name);

-- Create RLS policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to documents
CREATE POLICY "Allow public read access to documents" 
ON documents 
FOR SELECT 
USING (true);

-- Allow public insert access to documents
CREATE POLICY "Allow public insert access to documents" 
ON documents 
FOR INSERT 
WITH CHECK (true);

-- Allow public update access to documents
CREATE POLICY "Allow public update access to documents" 
ON documents 
FOR UPDATE 
USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function for creating documents table (for backward compatibility)
CREATE OR REPLACE FUNCTION create_documents_table()
RETURNS void AS $$
BEGIN
    -- This function is called from the backend to ensure table exists
    -- The table creation is already handled above
    RETURN;
END;
$$ LANGUAGE plpgsql;