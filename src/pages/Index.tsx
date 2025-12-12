import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AnalysisCard } from "@/components/dashboard/AnalysisCard";
import { HeatmapViewer } from "@/components/dashboard/HeatmapViewer";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AnalysisDetailModal } from "@/components/dashboard/AnalysisDetailModal";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  AlertTriangle,
  Activity,
  Image,
  Plus,
  ArrowRight,
} from "lucide-react";
import sampleImage from "@/assets/sample-analysis.jpg";
import sampleHeatmap from "@/assets/sample-heatmap.png";

// Mock data
const recentAnalyses = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    source: "Instagram",
    timestamp: "2 min ago",
    fakeScore: 87,
    tamperScore: 72,
    status: "completed" as const,
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    source: "Twitter",
    timestamp: "15 min ago",
    fakeScore: 23,
    tamperScore: 12,
    status: "completed" as const,
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    source: "Facebook",
    timestamp: "Just now",
    fakeScore: 0,
    tamperScore: 0,
    status: "analyzing" as const,
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    source: "Instagram",
    timestamp: "1 hour ago",
    fakeScore: 45,
    tamperScore: 38,
    status: "completed" as const,
  },
];

const recentActivities = [
  {
    id: "1",
    type: "danger" as const,
    title: "High-risk image detected",
    description: "Analysis completed with 87% fake probability",
    timestamp: "2 minutes ago",
    source: "Instagram",
  },
  {
    id: "2",
    type: "success" as const,
    title: "Image verified as authentic",
    description: "Low fake probability score of 12%",
    timestamp: "15 minutes ago",
    source: "Twitter",
  },
  {
    id: "3",
    type: "pending" as const,
    title: "Analysis in progress",
    description: "Processing image from Facebook",
    timestamp: "Just now",
    source: "Facebook",
  },
  {
    id: "4",
    type: "warning" as const,
    title: "Suspicious metadata detected",
    description: "Image shows signs of editing software",
    timestamp: "1 hour ago",
    source: "Instagram",
  },
];

const Index = () => {
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />

      {/* Main content */}
      <div className="ml-64 flex flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 p-6">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Monitor and analyze image authenticity in real-time
              </p>
            </div>
            <Button className="bg-gradient-primary shadow-glow transition-all duration-300 hover:shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Analyses"
              value="1,284"
              subtitle="This month"
              icon={Image}
              trend={{ value: 12, isPositive: true }}
              variant="primary"
            />
            <StatsCard
              title="Authentic Images"
              value="892"
              subtitle="69.5% of total"
              icon={ShieldCheck}
              trend={{ value: 8, isPositive: true }}
              variant="success"
            />
            <StatsCard
              title="Detected Fakes"
              value="287"
              subtitle="22.4% of total"
              icon={AlertTriangle}
              trend={{ value: 3, isPositive: false }}
              variant="danger"
            />
            <StatsCard
              title="Avg. Response Time"
              value="1.2s"
              subtitle="Per analysis"
              icon={Activity}
              variant="default"
            />
          </div>

          {/* Main content grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left column - Heatmap & Scores */}
            <div className="space-y-6 lg:col-span-2">
              {/* Featured Analysis */}
              <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-4 py-3">
                  <h3 className="font-heading text-sm font-semibold">
                    Latest Analysis
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDetailModalOpen(true)}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Heatmap preview */}
                    <HeatmapViewer
                      originalImage={sampleImage}
                      heatmapImage={sampleHeatmap}
                      title="Tamper Detection"
                    />

                    {/* Scores */}
                    <div className="flex flex-col justify-center space-y-6">
                      <div className="flex items-center justify-center gap-8">
                        <ScoreGauge
                          score={73}
                          label="Fake Probability"
                          size="md"
                        />
                        <ScoreGauge
                          score={65}
                          label="Tamper Score"
                          size="md"
                        />
                      </div>
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                          <div>
                            <p className="text-sm font-medium text-destructive">
                              High Risk Detected
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              This image shows strong indicators of
                              manipulation. Review the heatmap for details.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Analyses Grid */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold">
                    Recent Analyses
                  </h3>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {recentAnalyses.map((analysis) => (
                    <AnalysisCard
                      key={analysis.id}
                      {...analysis}
                      onViewDetails={() => setDetailModalOpen(true)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Activity */}
            <div className="space-y-6">
              <RecentActivity activities={recentActivities} />

              {/* Quick stats */}
              <div className="overflow-hidden rounded-xl border border-border/50 bg-card p-4">
                <h3 className="mb-4 font-heading text-sm font-semibold">
                  Model Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-500"
                        style={{ width: "94.2%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Precision</span>
                      <span className="font-medium">91.8%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-accent transition-all duration-500"
                        style={{ width: "91.8%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Recall</span>
                      <span className="font-medium">89.5%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-secondary transition-all duration-500"
                        style={{ width: "89.5%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Extension CTA */}
              <div className="overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                <h3 className="font-heading text-sm font-semibold">
                  Chrome Extension
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Right-click any image on Instagram, Twitter, or Facebook to
                  analyze it instantly.
                </p>
                <Button size="sm" className="mt-4 w-full bg-gradient-primary">
                  Install Extension
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <AnalysisDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </div>
  );
};

export default Index;
