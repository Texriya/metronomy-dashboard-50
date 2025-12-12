import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HeatmapViewer } from "./HeatmapViewer";
import { MetadataTable } from "./MetadataTable";
import { ScoreGauge } from "./ScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Share2, AlertTriangle, CheckCircle } from "lucide-react";
import sampleImage from "@/assets/sample-analysis.jpg";
import sampleHeatmap from "@/assets/sample-heatmap.png";

interface AnalysisDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const sampleMetadata = [
  { field: "Camera Model", value: "iPhone 14 Pro", status: "normal" as const, icon: "camera" as const },
  { field: "Date Taken", value: "2024-01-15 14:32:18", status: "warning" as const, icon: "date" as const, tooltip: "Date modified after original capture" },
  { field: "GPS Location", value: "40.7128° N, 74.0060° W", status: "normal" as const, icon: "location" as const },
  { field: "Software", value: "Adobe Photoshop 2024", status: "anomaly" as const, icon: "settings" as const, tooltip: "Image was processed with editing software" },
  { field: "Image Size", value: "4032 × 3024", status: "normal" as const },
  { field: "Color Space", value: "sRGB", status: "normal" as const },
  { field: "Compression", value: "JPEG (quality: 85)", status: "warning" as const, tooltip: "Multiple compression detected" },
];

export function AnalysisDetailModal({ open, onOpenChange }: AnalysisDetailModalProps) {
  const fakeScore = 73;
  const tamperScore = 65;
  const reliabilityScore = 82;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="font-heading text-xl">Analysis Report</DialogTitle>
              <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                <AlertTriangle className="mr-1 h-3 w-3" />
                High Risk
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-6 rounded-xl border border-border/50 bg-muted/20 p-6">
            <ScoreGauge score={fakeScore} label="Fake Probability" sublabel="AI Detection Score" />
            <ScoreGauge score={tamperScore} label="Tamper Score" sublabel="Metadata Analysis" />
            <ScoreGauge score={reliabilityScore} label="Reliability" sublabel="Model Confidence" />
          </div>

          {/* Heatmap */}
          <HeatmapViewer
            originalImage={sampleImage}
            heatmapImage={sampleHeatmap}
          />

          {/* Summary */}
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
              <div>
                <h4 className="font-heading font-semibold text-destructive">Analysis Summary</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  This image shows strong indicators of manipulation. The AI model detected inconsistencies
                  in facial features and lighting patterns. Additionally, metadata analysis reveals the
                  image was processed with editing software after the original capture date.
                </p>
              </div>
            </div>
          </div>

          {/* Metadata Table */}
          <MetadataTable data={sampleMetadata} />

          {/* Detection Details */}
          <div className="rounded-xl border border-border/50 bg-card">
            <div className="border-b border-border/50 bg-muted/30 px-4 py-3">
              <h3 className="font-heading text-sm font-semibold">Detection Details</h3>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">AI Model Findings</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Facial feature inconsistencies detected
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-secondary" />
                    Unnatural lighting patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Background appears authentic
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Metadata Findings</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Editing software detected
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-secondary" />
                    Date modified after capture
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-secondary" />
                    Multiple compression cycles
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
