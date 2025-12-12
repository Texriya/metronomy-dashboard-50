import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface HeatmapViewerProps {
  originalImage: string;
  heatmapImage: string;
  title?: string;
}

export function HeatmapViewer({
  originalImage,
  heatmapImage,
  title = "Tamper Detection Heatmap",
}: HeatmapViewerProps) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [opacity, setOpacity] = useState([70]);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setOpacity([70]);
    setShowHeatmap(true);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-3">
        <h3 className="font-heading text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            {showHeatmap ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image container */}
      <div className="relative aspect-video overflow-hidden bg-background/50">
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Original image */}
          <img
            src={originalImage}
            alt="Original"
            className="h-full w-full object-contain"
          />

          {/* Heatmap overlay */}
          <img
            src={heatmapImage}
            alt="Heatmap"
            className={cn(
              "absolute inset-0 h-full w-full object-contain transition-opacity duration-300",
              !showHeatmap && "opacity-0"
            )}
            style={{ opacity: showHeatmap ? opacity[0] / 100 : 0 }}
          />
        </div>

        {/* Zoom indicator */}
        <div className="absolute bottom-3 left-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Controls */}
      {showHeatmap && (
        <div className="flex items-center gap-4 border-t border-border/50 bg-muted/30 px-4 py-3">
          <span className="text-xs text-muted-foreground">Overlay Opacity</span>
          <Slider
            value={opacity}
            onValueChange={setOpacity}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="w-10 text-right text-xs font-medium">
            {opacity[0]}%
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 border-t border-border/50 bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-xs text-muted-foreground">Authentic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-secondary" />
          <span className="text-xs text-muted-foreground">Suspicious</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Tampered</span>
        </div>
      </div>
    </div>
  );
}
