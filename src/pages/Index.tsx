import { useState } from "react";
import { SearchHeader } from "@/components/SearchHeader";
import { ResultsGrid } from "@/components/ResultsGrid";
import { MetricsPanel } from "@/components/MetricsPanel";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    setHasSearched(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results);
        setMetrics(data.metrics);
        
        toast({
          title: "Search completed",
          description: `Found results using 4 similarity algorithms`,
        });
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : 'An error occurred during search',
        variant: "destructive",
      });
      
      // Reset state on error
      setSearchResults(null);
      setMetrics(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Document uploaded successfully",
          description: `${file.name} has been processed and indexed with all 4 similarity algorithms`,
        });
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'An error occurred during upload',
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header with Legal Branding */}
      <header className="bg-primary/5 border-b border-primary/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-legal)' }}>
                  LegalSearch Pro
                </h1>
                <p className="text-xs text-muted-foreground">Advanced Legal Document Analysis</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Comparing 4 Similarity Algorithms</p>
              <p className="text-xs text-muted-foreground">Indian Legal Database</p>
            </div>
          </div>
        </div>
      </header>

      {/* Search Interface */}
      <SearchHeader 
        onSearch={handleSearch}
        onFileUpload={handleFileUpload}
        isLoading={isLoading}
      />

      {/* Results Section */}
      {hasSearched && (
        <>
          {/* Performance Metrics */}
          {metrics && <MetricsPanel metrics={metrics} isVisible={!isLoading} />}
          
          {/* Search Results Grid */}
          <ResultsGrid 
            results={searchResults || { cosine: [], euclidean: [], mmr: [], hybrid: [] }}
            searchQuery={searchQuery}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Footer */}
      <footer className="bg-primary/5 border-t border-primary/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-primary mb-3">About LegalSearch Pro</h3>
              <p className="text-sm text-muted-foreground">
                Advanced legal document search platform for Indian legal professionals, 
                powered by 4 different similarity algorithms for comprehensive research.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-3">Supported Documents</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Income Tax Act & Rules</li>
                <li>• GST Act & Regulations</li>
                <li>• Supreme Court & High Court Judgments</li>
                <li>• Property & Commercial Laws</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-3">Algorithm Types</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cosine Similarity</li>
                <li>• Euclidean Distance</li>
                <li>• MMR (Maximum Marginal Relevance)</li>
                <li>• Hybrid Semantic Matching</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/10 mt-8 pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 LegalSearch Pro. For educational and research purposes. 
              Always consult qualified legal professionals for legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
