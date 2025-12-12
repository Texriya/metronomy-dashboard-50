import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Camera,
  Calendar,
  MapPin,
  Settings,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetadataItem {
  field: string;
  value: string;
  status: "normal" | "warning" | "anomaly";
  tooltip?: string;
  icon?: "camera" | "date" | "location" | "settings";
}

interface MetadataTableProps {
  data: MetadataItem[];
  title?: string;
}

const iconMap = {
  camera: Camera,
  date: Calendar,
  location: MapPin,
  settings: Settings,
};

export function MetadataTable({
  data,
  title = "EXIF Metadata Analysis",
}: MetadataTableProps) {
  const getStatusIcon = (status: MetadataItem["status"]) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-secondary" />;
      case "anomaly":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: MetadataItem["status"]) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
            Normal
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="border-secondary/30 bg-secondary/10 text-secondary">
            Warning
          </Badge>
        );
      case "anomaly":
        return (
          <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
            Anomaly
          </Badge>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      <div className="border-b border-border/50 bg-muted/30 px-4 py-3">
        <h3 className="font-heading text-sm font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">Field</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const IconComponent = item.icon ? iconMap[item.icon] : null;
              return (
                <TableRow
                  key={index}
                  className={cn(
                    "transition-colors",
                    item.status === "anomaly" && "bg-destructive/5",
                    item.status === "warning" && "bg-secondary/5"
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                      )}
                      {item.field}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {item.value}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell>
                    {item.tooltip && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">{item.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
