import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, Clock, XCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "success" | "warning" | "danger" | "pending";
  title: string;
  description: string;
  timestamp: string;
  source?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-secondary",
    bg: "bg-secondary/10",
    border: "border-secondary/20",
  },
  danger: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
  },
  pending: {
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      <div className="border-b border-border/50 bg-muted/30 px-4 py-3">
        <h3 className="font-heading text-sm font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border/50">
        {activities.map((activity) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/30"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  config.bg
                )}
              >
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activity.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{activity.timestamp}</span>
                  {activity.source && (
                    <>
                      <span>•</span>
                      <span>{activity.source}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
