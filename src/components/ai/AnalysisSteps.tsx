import { Check } from "lucide-react";
import { Card } from "@/components/ui";
import { ANALYSIS_STEPS } from "@/features/task-extraction/analysisSteps";

export function AnalysisSteps({ progress }: { progress: number }) {
  return (
    <Card className="space-y-4">
      {ANALYSIS_STEPS.map((step, index) => {
        const isDone = progress > (index + 1) * 22;
        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`grid size-7 place-items-center rounded-full ${
                isDone ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
              }`}
            >
              {isDone ? <Check size={16} /> : <span className="size-2 rounded-full bg-current" />}
            </div>
            <span className="text-[15px] font-medium text-slate-700">{step}</span>
          </div>
        );
      })}
    </Card>
  );
}
