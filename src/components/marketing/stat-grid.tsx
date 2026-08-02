import { cn } from "@/lib/utils";
import { Icon } from "@/components/icon";
import type { Statistic } from "@/lib/content/editorial";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CountUp } from "@/components/marketing/count-up";

interface StatGridProps {
  stats: Statistic[];
  className?: string;
  tone?: "card" | "plain";
}

function StatGrid({ stats, className, tone = "card" }: StatGridProps) {
  return (
    <RevealGroup as="ul" className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat) => {
        return (
          <RevealItem
            as="li"
            key={stat.label}
            className={cn(
              "rounded-2xl p-6",
              tone === "card" && "border bg-card shadow-[var(--shadow-soft)]",
            )}
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon name={stat.icon} className="size-5" aria-hidden />
            </span>

            <p className="mt-5 font-display text-4xl leading-none font-bold tracking-tight">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>

            <p className="mt-2.5 text-sm font-semibold text-foreground">{stat.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stat.detail}</p>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

export { StatGrid };
