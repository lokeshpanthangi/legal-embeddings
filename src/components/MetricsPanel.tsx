import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MetricsData {
  precision: { [key: string]: number };
  recall: { [key: string]: number };
  diversity: { [key: string]: number };
  response_time: { [key: string]: string };
}

interface MetricsPanelProps {
  metrics: MetricsData;
  isVisible?: boolean;
}

export const MetricsPanel = ({ metrics, isVisible = true }: MetricsPanelProps) => {
  if (!isVisible) return null;

  const algorithms = ['cosine', 'euclidean', 'mmr', 'hybrid'];
  
  // Find best performing algorithm
  const bestAlgorithm = algorithms.reduce((best, current) => {
    const currentScore = (metrics.precision[current] || 0) + (metrics.recall[current] || 0);
    const bestScore = (metrics.precision[best] || 0) + (metrics.recall[best] || 0);
    return currentScore > bestScore ? current : best;
  }, algorithms[0]);

  const formatAlgorithmName = (algorithm: string) => {
    switch (algorithm) {
      case 'cosine': return 'Cosine Similarity';
      case 'euclidean': return 'Euclidean Distance';
      case 'mmr': return 'MMR (Diverse)';
      case 'hybrid': return 'Hybrid Similarity';
      default: return algorithm;
    }
  };

  const getAlgorithmColor = (algorithm: string) => {
    switch (algorithm) {
      case 'cosine': return 'text-income-tax';
      case 'euclidean': return 'text-gst';
      case 'mmr': return 'text-court-judgment';
      case 'hybrid': return 'text-property-law';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <Card className="shadow-lg border-2 border-primary/10 bg-card/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            Performance Metrics Dashboard
            <Badge variant="secondary" className="ml-auto">
              Best: {formatAlgorithmName(bestAlgorithm)}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Precision Scores */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Precision Score
              </h4>
              {algorithms.map((algorithm) => {
                const score = metrics.precision[algorithm] || 0;
                const percentage = Math.round(score * 100);
                return (
                  <div key={algorithm} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getAlgorithmColor(algorithm)}`}>
                        {formatAlgorithmName(algorithm)}
                      </span>
                      <span className="text-sm font-semibold">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>

            {/* Recall Scores */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Recall Score
              </h4>
              {algorithms.map((algorithm) => {
                const score = metrics.recall[algorithm] || 0;
                const percentage = Math.round(score * 100);
                return (
                  <div key={algorithm} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getAlgorithmColor(algorithm)}`}>
                        {formatAlgorithmName(algorithm)}
                      </span>
                      <span className="text-sm font-semibold">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>

            {/* Diversity Scores */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Diversity Score
              </h4>
              {algorithms.map((algorithm) => {
                const score = metrics.diversity[algorithm] || (algorithm === 'mmr' ? 0.95 : 0.6);
                const percentage = Math.round(score * 100);
                return (
                  <div key={algorithm} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getAlgorithmColor(algorithm)}`}>
                        {formatAlgorithmName(algorithm)}
                      </span>
                      <span className="text-sm font-semibold">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>

            {/* Response Times */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Response Time
              </h4>
              {algorithms.map((algorithm) => {
                const time = metrics.response_time[algorithm] || '0ms';
                return (
                  <div key={algorithm} className="flex justify-between items-center py-2">
                    <span className={`text-sm font-medium ${getAlgorithmColor(algorithm)}`}>
                      {formatAlgorithmName(algorithm)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {time}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};