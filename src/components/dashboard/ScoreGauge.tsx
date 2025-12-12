import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreGauge({
  score,
  label,
  sublabel,
  size = "md",
}: ScoreGaugeProps) {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getScoreColor = () => {
    if (normalizedScore < 30) return "stroke-accent";
    if (normalizedScore < 70) return "stroke-secondary";
    return "stroke-destructive";
  };

  const getScoreTextColor = () => {
    if (normalizedScore < 30) return "text-accent";
    if (normalizedScore < 70) return "text-secondary";
    return "text-destructive";
  };

  const sizeClasses = {
    sm: { container: "h-24 w-24", text: "text-xl", label: "text-xs" },
    md: { container: "h-36 w-36", text: "text-3xl", label: "text-sm" },
    lg: { container: "h-48 w-48", text: "text-4xl", label: "text-base" },
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", sizeClasses[size].container)}>
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className={cn("transition-all duration-1000 ease-out", getScoreColor())}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "font-heading font-bold",
              sizeClasses[size].text,
              getScoreTextColor()
            )}
          >
            {normalizedScore}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className={cn("font-medium", sizeClasses[size].label)}>{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
