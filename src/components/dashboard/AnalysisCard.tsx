import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AnalysisCardProps {
  id: string;
  imageUrl: string;
  source: string;
  timestamp: string;
  fakeScore: number;
  tamperScore: number;
  status: "analyzing" | "completed" | "failed";
  onViewDetails?: () => void;
}

export function AnalysisCard({
  imageUrl,
  source,
  timestamp,
  fakeScore,
  tamperScore,
  status,
  onViewDetails,
}: AnalysisCardProps) {
  const isAuthentic = fakeScore < 30;
  const isSuspicious = fakeScore >= 30 && fakeScore < 70;
  const isFake = fakeScore >= 70;

  const getScoreColor = (score: number) => {
    if (score < 30) return "text-accent";
    if (score < 70) return "text-secondary";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score < 30) return "bg-accent/10";
    if (score < 70) return "bg-secondary/10";
    return "bg-destructive/10";
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-lg">
      {/* Image preview */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt="Analyzed content"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Status overlay */}
        {status === "analyzing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="h-6 w-6 animate-spin text-primary" />
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Analyzing...
              </span>
            </div>
          </div>
        )}

        {/* Authenticity badge */}
        {status === "completed" && (
          <div className="absolute left-3 top-3">
            <Badge
              variant="outline"
              className={cn(
                "border-0 backdrop-blur-md",
                isAuthentic && "bg-accent/90 text-accent-foreground",
                isSuspicious && "bg-secondary/90 text-secondary-foreground",
                isFake && "bg-destructive/90 text-destructive-foreground"
              )}
            >
              {isAuthentic && (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" /> Authentic
                </>
              )}
              {isSuspicious && (
                <>
                  <AlertTriangle className="mr-1 h-3 w-3" /> Suspicious
                </>
              )}
              {isFake && (
                <>
                  <AlertTriangle className="mr-1 h-3 w-3" /> Likely Fake
                </>
              )}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {source}
          </span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>

        {status === "completed" && (
          <>
            {/* Scores */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div
                className={cn(
                  "rounded-lg p-3 text-center",
                  getScoreBg(fakeScore)
                )}
              >
                <p className="text-xs text-muted-foreground">Fake Probability</p>
                <p className={cn("font-heading text-xl font-bold", getScoreColor(fakeScore))}>
                  {fakeScore}%
                </p>
              </div>
              <div
                className={cn(
                  "rounded-lg p-3 text-center",
                  getScoreBg(tamperScore)
                )}
              >
                <p className="text-xs text-muted-foreground">Tamper Score</p>
                <p className={cn("font-heading text-xl font-bold", getScoreColor(tamperScore))}>
                  {tamperScore}%
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onViewDetails}
            >
              View Details
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
