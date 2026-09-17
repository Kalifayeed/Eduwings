/**
 * School-level programme schedules. These editorial timings are shared by the
 * overview, module details and homepage; module descriptions still use ContentSource.
 */
export const programLevels = [
  {
    id: "primary",
    label: "Primary & Junior",
    title: "Primary & Junior Level Modules",
    description:
      "Exposure, curiosity and early awareness — introducing aviation, airports and aircraft before career pressure sets in.",
    modules: [
      {
        slug: "history-of-flight",
        title: "History of Flight",
        durationMinutes: 40,
      },
      {
        slug: "how-airplanes-fly",
        title: "How Aircraft Fly",
        durationMinutes: 40,
      },
      {
        slug: "airport-operations",
        title: "Airport Operations",
        durationMinutes: 50,
      },
      {
        slug: "weather-and-flight",
        title: "Weather and Flight",
        durationMinutes: 40,
      },
      {
        slug: "safety-culture",
        title: "Safety and Human Factors",
        durationMinutes: 40,
      },
      {
        slug: "stem-in-aviation",
        title: "STEM Aviation",
        durationMinutes: 40,
      },
      {
        slug: "career-pathways",
        title: "Career Pathways",
        durationMinutes: 40,
      },
    ],
  },
  {
    id: "secondary",
    label: "Secondary & Senior",
    title: "Secondary & Senior Level Modules",
    description:
      "Explore aviation in greater depth, with time for navigation, STEM applications and informed career choices.",
    modules: [
      {
        slug: "how-airplanes-fly",
        title: "How Aircraft Fly",
        durationMinutes: 70,
      },
      {
        slug: "navigation",
        title: "Navigation",
        durationMinutes: 80,
      },
      {
        slug: "weather-and-flight",
        title: "Weather and Flight",
        durationMinutes: 60,
      },
      {
        slug: "stem-in-aviation",
        title: "STEM in Aviation",
        durationMinutes: 80,
      },
      {
        slug: "career-pathways",
        title: "Career Pathways",
        durationMinutes: 150,
      },
    ],
  },
] as const;

export function formatProgramDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${minutes} minutes`;
  const hourLabel = `${hours} ${hours === 1 ? "hr" : "hrs"}`;
  return remainder ? `${hourLabel} ${remainder} minutes` : hourLabel;
}

export function getModuleSchedules(slug: string) {
  return programLevels.flatMap((level) =>
    level.modules
      .filter((module) => module.slug === slug)
      .map((module) => ({ ...module, level: level.label })),
  );
}
