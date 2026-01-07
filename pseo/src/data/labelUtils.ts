const stageLabels: Record<string, string> = {
  seed: "Seed",
  "series-a": "Series A",
};

const industryLabels: Record<string, string> = {
  aerospace: "Aerospace",
  hardware: "Hardware",
  robotics: "Robotics",
  chemistry: "Chemistry",
  finance: "Finance",
  blockchain: "Blockchain",
  ai: "AI",
};

export function labelForStage(stage: string) {
  return stageLabels[stage] ?? stage;
}

export function labelForIndustry(industry: string) {
  return industryLabels[industry] ?? industry;
}
