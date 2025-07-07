import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ResultCardProps {
  result: {
    id: string;
    title: string;
    type: "Income Tax Act" | "GST Act" | "Court Judgment" | "Property Law";
    relevance: number;
    preview: string;
    section: string;
  };
  searchQuery?: string;
}

const getDocumentTypeColor = (type: string) => {
  switch (type) {
    case "Income Tax Act":
      return "bg-income-tax text-white";
    case "GST Act":
      return "bg-gst text-white";
    case "Court Judgment":
      return "bg-court-judgment text-white";
    case "Property Law":
      return "bg-property-law text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const highlightSearchTerms = (text: string, query?: string) => {
  if (!query) return text;
  
  const terms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  let highlightedText = text;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-secondary/30 px-1 rounded">$1</mark>');
  });
  
  return highlightedText;
};

export const ResultCard = ({ result, searchQuery }: ResultCardProps) => {
  const relevancePercentage = Math.round(result.relevance * 100);
  
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {result.title}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-medium text-primary">
              {relevancePercentage}%
            </div>
            <Progress value={relevancePercentage} className="w-16 h-2 mt-1" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getDocumentTypeColor(result.type)}>
            {result.type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {result.section}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div 
          className="text-sm text-muted-foreground mb-4 line-clamp-4 leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: highlightSearchTerms(result.preview, searchQuery) 
          }}
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          View Full Document
        </Button>
      </CardContent>
    </Card>
  );
};