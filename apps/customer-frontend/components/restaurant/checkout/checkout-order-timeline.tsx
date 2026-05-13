import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface Stage {
  id: string;
  label: string;
  description: string;
}

interface CheckoutOrderTimelineProps {
  stages: Stage[];
  stageIndex: number;
}

export function CheckoutOrderTimeline({ stages, stageIndex }: CheckoutOrderTimelineProps) {
  return (
    <div className="rounded-[24px] border border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
      <div className="space-y-0">
        {stages.map((stage, index) => {
          const isDone = index <= stageIndex;
          const isCurrent = index === stageIndex;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border",
                    isDone
                      ? "border-[rgb(var(--brand))] bg-[rgb(var(--brand))] text-white"
                      : "border-[rgb(var(--border))] bg-white text-transparent",
                  )}
                >
                  <Check className="h-3 w-3" />
                </span>
                {!isLast && (
                  <span className={cn("mt-1 h-9 w-px", index < stageIndex ? "bg-[rgb(var(--brand))]" : "bg-[rgb(var(--border)/0.9)]")} />
                )}
              </div>

              <div className={cn("pb-4", isLast && "pb-0")}>
                <p className={cn("text-sm font-semibold", isCurrent || isDone ? "text-[rgb(var(--ink))]" : "text-[rgb(var(--muted))]")}>
                  {stage.label}
                </p>
                <p className="mt-0.5 text-[12px] leading-5 text-[rgb(var(--muted))]">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
