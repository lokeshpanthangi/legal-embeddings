import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResultCard } from "./ResultCard";

interface AlgorithmResults {
  cosine: any[];
  euclidean: any[];
  mmr: any[];
  hybrid: any[];
}

interface ResultsGridProps {
  results: AlgorithmResults;
  searchQuery: string;
  isLoading?: boolean;
}

const algorithmInfo = {
  cosine: {
    title: "Cosine Similarity",
    description: "Standard semantic matching based on document vectors",
    color: "border-l-income-tax"
  },
  euclidean: {
    title: "Euclidean Distance", 
    description: "Geometric distance matching in vector space",
    color: "border-l-gst"
  },
  mmr: {
    title: "MMR (Diverse Results)",
    description: "Reduced redundancy with maximum relevance",
    color: "border-l-court-judgment"
  },
  hybrid: {
    title: "Hybrid Similarity",
    description: "Combined semantic + legal entity matching",
    color: "border-l-property-law"
  }
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded w-20"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ResultsGrid = ({ results, searchQuery, isLoading = false }: ResultsGridProps) => {
  const algorithms = Object.keys(algorithmInfo) as (keyof typeof algorithmInfo)[];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {algorithms.map((algorithm) => {
          const info = algorithmInfo[algorithm];
          const algorithmResults = results[algorithm] || [];
          
          return (
            <div key={algorithm} className="space-y-4">
              {/* Algorithm Header */}
              <Card className={`border-l-4 ${info.color} shadow-md`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-primary">
                    {info.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                  {!isLoading && algorithmResults.length > 0 && (
                    <Badge variant="outline" className="w-fit">
                      {algorithmResults.length} results
                    </Badge>
                  )}
                </CardHeader>
              </Card>

              {/* Results */}
              <div className="space-y-4">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : algorithmResults.length > 0 ? (
                  algorithmResults.slice(0, 5).map((result, index) => (
                    <ResultCard 
                      key={`${algorithm}-${result.id}-${index}`}
                      result={result}
                      searchQuery={searchQuery}
                    />
                  ))
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No results found
                    </p>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};