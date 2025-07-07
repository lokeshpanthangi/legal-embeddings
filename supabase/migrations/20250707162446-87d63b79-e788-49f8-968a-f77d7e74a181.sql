-- Create storage bucket for legal documents
INSERT INTO storage.buckets (id, name, public) VALUES ('legal-documents', 'legal-documents', true);

-- Create policies for document storage
CREATE POLICY "Allow public access to legal documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'legal-documents');

CREATE POLICY "Allow document uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'legal-documents');

CREATE POLICY "Allow document updates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'legal-documents');

CREATE POLICY "Allow document deletion" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'legal-documents');