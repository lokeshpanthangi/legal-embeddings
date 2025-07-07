import { useState } from "react";
import { Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export const SearchHeader = ({ onSearch, onFileUpload, isLoading = false }: SearchHeaderProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const sampleQueries = [
    "GST on digital services",
    "Income tax on property sale",
    "Corporate liability in joint ventures",
    "Tax implications of cryptocurrency trading"
  ];

  return (
    <div className="w-full bg-gradient-to-b from-background to-muted py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: 'var(--font-legal)' }}>
            Legal Document Search
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare 4 advanced similarity algorithms to find the most relevant legal documents for your research
          </p>
        </div>

        {/* Search Interface */}
        <Card className="p-8 shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Main Search Bar */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search legal documents... (e.g., property tax implications)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 text-lg border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>
              <Button 
                variant="search" 
                size="xl"
                onClick={handleSearch}
                disabled={!query.trim() || isLoading}
              >
                {isLoading ? "Searching..." : "Search Documents"}
              </Button>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-2">
                Or upload a document for comparison
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild>
                  <span>Upload PDF/Word Document</span>
                </Button>
              </label>
            </div>

            {/* Sample Queries */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Try these sample queries:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(sample)}
                    className="text-xs hover:bg-primary hover:text-primary-foreground"
                  >
                    {sample}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};