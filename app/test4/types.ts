export type LearningPlanOverview = {
  studentBlurb: string;
  engagementBlurb: string;
  mentorFitBlurb: string;
};

export type SynthesizedGoal = {
  highLevelGoal: string;
  subGoals: {
    title: string;
    items: string[];
  }[];
};

export type SessionAgenda = {
  title: string;
  items: string[];
}[];

export type SessionStructure = {
  firstSessionAgenda: SessionAgenda;
  generalSessionAgenda: SessionAgenda;
};

export type RoadmapPhase = {
  title: string;
  items: string[];
};

export type Roadmap = {
  monthlyRoadmap: RoadmapPhase[];
  weeklyRoadmap: RoadmapPhase[];
};

export type LearningPlan = {
  title: string;
  overview: LearningPlanOverview;
  requirements: string[];
  synthesizedGoal: SynthesizedGoal;
  sessionStructure: SessionStructure;
  roadmap: Roadmap;
};
