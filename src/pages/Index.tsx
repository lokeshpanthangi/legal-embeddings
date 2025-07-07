import { useState } from "react";
import { SearchHeader } from "@/components/SearchHeader";
import { ResultsGrid } from "@/components/ResultsGrid";
import { MetricsPanel } from "@/components/MetricsPanel";
import { sampleSearchResults, sampleMetrics } from "@/data/sampleData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(sampleSearchResults);
  const [metrics, setMetrics] = useState(sampleMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(sampleSearchResults);
      setMetrics(sampleMetrics);
      setIsLoading(false);
    }, 2000);
  };

  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name);
    // Handle file upload logic here
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
          <MetricsPanel metrics={metrics} isVisible={!isLoading} />
          
          {/* Search Results Grid */}
          <ResultsGrid 
            results={searchResults}
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
