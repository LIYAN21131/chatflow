"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnalysisSteps } from "@/components/ai/AnalysisSteps";
import { ProgressCard } from "@/components/ai/ProgressCard";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ROUTES } from "@/constants/config";
import { useAnalysisProgress } from "@/hooks/useAnalysisProgress";
import { useHydrateTaskStore } from "@/hooks/useHydrateTaskStore";
import { useTaskStore } from "@/store/useTaskStore";

export function AnalyzeView() {
  const router = useRouter();
  const progress = useAnalysisProgress();
  const runExtraction = useTaskStore((state) => state.runExtraction);
  const routerRef = useRef(router);
  const runExtractionRef = useRef(runExtraction);

  useHydrateTaskStore();

  useEffect(() => {
    routerRef.current = router;
    runExtractionRef.current = runExtraction;
  }, [router, runExtraction]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const success = await runExtractionRef.current();
        routerRef.current.push(success ? ROUTES.result : ROUTES.failed);
      } catch (error) {
        console.error("Task extraction failed", error);
        routerRef.current.push(ROUTES.failed);
      }
    }, 1700);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AppShell activeTab="识别" hideTab>
      <PageHeader title="智能识别中" onBack={() => router.push(ROUTES.home)} />
      <div className="space-y-5">
        <ProgressCard progress={progress} />
        <AnalysisSteps progress={progress} />
      </div>
    </AppShell>
  );
}
