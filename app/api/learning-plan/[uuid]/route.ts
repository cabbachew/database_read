import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { PROMPT_TEMPLATES } from "@/lib/prompts/learning-plan";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROMPT_MAPPING = {
  overview: PROMPT_TEMPLATES.overview,
  synthesizedGoal: PROMPT_TEMPLATES.synthesizedGoal,
  sessionStructure: PROMPT_TEMPLATES.sessionStructure,
  roadmap: PROMPT_TEMPLATES.roadmap,
} as const;

type LearningPlanStructure = {
  title: string;
  overview: {
    studentBlurb: string;
    engagementBlurb: string;
    mentorFitBlurb: string;
  };
  requirements: string[];
  synthesizedGoal: {
    highLevelGoal: string;
    subGoals: Array<{
      title: string;
      items: string[];
    }>;
  };
  sessionStructure: {
    firstSessionAgenda: Array<{
      title: string;
      items: string[];
    }>;
    generalSessionAgenda: Array<{
      title: string;
      items: string[];
    }>;
  };
  roadmap: {
    monthlyRoadmap: Array<{
      title: string;
      items: string[];
    }>;
    weeklyRoadmap: Array<{
      title: string;
      items: string[];
    }>;
  };
};

interface StudentProfile {
  name?: string;
  grade?: string;
  school?: string;
}

// Add new type definitions for Claude responses
type ClaudeContext = {
  profileText?: string;
  archetypes?: string;
  consultationNotes?: string;
  offeringType?: string;
  addOns?: string;
  topic?: string;
  goals?: string;
  mentorMessage?: string;
  mentorBio?: string;
  grade?: string;
  successMetrics?: string;
  engagementGoals?: string;
  studentPersonality?: string;
  goalTaxonomy?: string;
  [key: string]: string | undefined;
};

type ClaudeResponse = {
  studentBlurb?: string;
  engagementBlurb?: string;
  mentorFitBlurb?: string;
  highLevelGoal?: string;
  subGoals?: Array<{ title: string; items: string[] }>;
  firstSessionAgenda?: Array<{ title: string; items: string[] }>;
  generalSessionAgenda?: Array<{ title: string; items: string[] }>;
  monthlyRoadmap?: Array<{ title: string; items: string[] }>;
  weeklyRoadmap?: Array<{ title: string; items: string[] }>;
};

async function generateStudentBlurb(
  profileText: string,
  archetypes: string[],
  transcript: string
): Promise<string> {
  try {
    const response = await generateWithClaude("overview", {
      profileText,
      archetypes: archetypes.join(", "),
      consultationNotes: transcript,
    });
    return typeof response === "string"
      ? response
      : response.studentBlurb || "";
  } catch (error) {
    console.error("Failed to generate student blurb:", error);
    return generateFallbackStudentBlurb(profileText, archetypes);
  }
}

function generateEngagementBlurb(
  offeringType: string,
  addOns: string[],
  goals: string[],
  topic: string
): string {
  const core =
    offeringType === "PASSION_PROJECT"
      ? "This engagement will focus on developing a substantive passion project"
      : "This engagement will focus on building academic excellence";

  const addOnDesc = addOns
    .map((addon) => {
      if (addon === "PATHFINDING")
        return "exploring future academic and career pathways";
      if (addon === "EXECUTIVE_FUNCTIONING")
        return "building strong organizational and study skills";
      return "";
    })
    .filter(Boolean)
    .join(" while ");

  return `${core} in ${topic}${
    addOnDesc ? `, while ${addOnDesc}` : ""
  }. The program will be tailored to achieve ${goals[0]}.`;
}

function generateMentorFitBlurb(acceptanceMessage: string): string {
  // Extract key points from acceptance message to highlight mentor's relevant background
  // This could be enhanced with more sophisticated text analysis
  return (
    acceptanceMessage ||
    "The mentor brings relevant experience and expertise to support the student's goals."
  );
}

function generateRequirements(
  offeringType: string,
  addOns: string[],
  availabilityNotes: string
): string[] {
  const requirements = [
    "Session recordings via CC Notetaker for tracking progress and maintaining detailed records",
  ];

  if (offeringType === "PASSION_PROJECT") {
    requirements.push(
      "Project artifacts including drafts, documentation, and final deliverables",
      "Progress tracking towards key milestones"
    );
  }

  if (offeringType === "ACADEMIC_MENTORSHIP") {
    requirements.push(
      "Access to student's LMS or gradebook",
      "Class assignments and textbook materials",
      "Current course syllabi"
    );
  }

  if (addOns.includes("PATHFINDING")) {
    requirements.push(
      "Documentation of exploration activities and reflections"
    );
  }

  if (availabilityNotes) {
    requirements.push(`Availability: ${availabilityNotes}`);
  }

  return requirements;
}

function generateSynthesizedGoal(
  goals: string[],
  engagementGoals: string[],
  offeringType: string,
  addOns: string[]
): LearningPlanStructure["synthesizedGoal"] {
  const highLevelGoal =
    goals[0] ||
    "Develop skills and achieve excellence in the chosen area of focus";

  const subGoals = [];

  if (offeringType === "PASSION_PROJECT") {
    subGoals.push({
      title: "Project Development",
      items: engagementGoals.filter(
        (goal) =>
          goal.toLowerCase().includes("project") ||
          goal.toLowerCase().includes("develop") ||
          goal.toLowerCase().includes("create")
      ),
    });
  }

  if (offeringType === "ACADEMIC_MENTORSHIP") {
    subGoals.push({
      title: "Academic Excellence",
      items: engagementGoals.filter(
        (goal) =>
          goal.toLowerCase().includes("academic") ||
          goal.toLowerCase().includes("grade") ||
          goal.toLowerCase().includes("study")
      ),
    });
  }

  if (addOns.includes("PATHFINDING")) {
    subGoals.push({
      title: "Career Exploration",
      items: engagementGoals.filter(
        (goal) =>
          goal.toLowerCase().includes("career") ||
          goal.toLowerCase().includes("future") ||
          goal.toLowerCase().includes("path")
      ),
    });
  }

  if (addOns.includes("EXECUTIVE_FUNCTIONING")) {
    subGoals.push({
      title: "Skill Building",
      items: engagementGoals.filter(
        (goal) =>
          goal.toLowerCase().includes("skill") ||
          goal.toLowerCase().includes("manage") ||
          goal.toLowerCase().includes("organize")
      ),
    });
  }

  return {
    highLevelGoal,
    subGoals,
  };
}

function generateSessionStructure(
  offeringType: string,
  addOns: string[]
): LearningPlanStructure["sessionStructure"] {
  const isPassionProject = offeringType === "PASSION_PROJECT";

  return {
    firstSessionAgenda: [
      {
        title: "Introduction (15 min)",
        items: [
          "Get to know your mentor",
          "Share your background and interests",
          "Discuss goals and expectations",
        ],
      },
      {
        title: "Core Work (30-40 min)",
        items: [
          isPassionProject
            ? "Explore potential project directions"
            : "Assess current academic standing",
          "Review learning goals and success metrics",
          "Set SMART goals and key milestones",
          "Set up documentation and progress tracking systems",
          addOns.includes("PATHFINDING")
            ? "Begin developing long-term roadmap"
            : "Create initial work plan",
        ],
      },
      {
        title: "Wrap-up (5-10 min)",
        items: [
          "Recap first session",
          "Establish regular meeting schedule",
          "Define next steps and action items",
        ],
      },
    ],
    generalSessionAgenda: [
      {
        title: "Opening (5-10 min)",
        items: [
          "Check-in and progress update",
          "Review previous action items",
          "Set session goals",
        ],
      },
      {
        title: "Core Work (40-50 min)",
        items: [
          isPassionProject
            ? "Project development work"
            : "Academic content and skill building",
          "Skill development and practice",
          addOns.includes("PATHFINDING")
            ? "Career exploration activities"
            : "Progress on core objectives",
          "Review and feedback",
        ],
      },
      {
        title: "Wrap-up (5-10 min)",
        items: ["Summarize progress", "Plan next steps", "Set action items"],
      },
    ],
  };
}

function generateRoadmap(
  offeringType: string,
  addOns: string[],
  engagementGoals: string[]
): LearningPlanStructure["roadmap"] {
  const isPassionProject = offeringType === "PASSION_PROJECT";

  return {
    monthlyRoadmap: [
      {
        title: "Month 1: Foundation Building",
        items: [
          isPassionProject
            ? "Define project scope and objectives"
            : "Establish academic baseline and goals",
          "Create detailed timeline and milestones",
          "Set up necessary systems and tools",
          "Begin initial work and skill building",
        ],
      },
      {
        title: "Month 2: Development",
        items: [
          isPassionProject
            ? "Execute on project plan"
            : "Deepen subject mastery",
          "Track progress against milestones",
          "Address challenges and adjust approach",
          addOns.includes("PATHFINDING")
            ? "Explore relevant opportunities"
            : "Build on early progress",
        ],
      },
      {
        title: "Month 3: Advancement",
        items: [
          isPassionProject
            ? "Refine project deliverables"
            : "Demonstrate mastery of core concepts",
          "Document achievements and learning",
          "Plan next phase of development",
          "Set goals for continued growth",
        ],
      },
    ],
    weeklyRoadmap: Array.from({ length: 6 }, (_, i) => ({
      title: `Sessions ${i * 2 + 1}-${i * 2 + 2}`,
      items: [
        i === 0
          ? "Establish foundation and begin work"
          : i === 1
          ? "Build on initial progress"
          : i === 2
          ? "Deepen engagement and skills"
          : i === 3
          ? "Execute on core objectives"
          : i === 4
          ? "Refine work and address challenges"
          : "Prepare for next phase",
        // Add more specific items based on engagement type and goals
        ...engagementGoals
          .slice(0, 2)
          .map(
            (goal) => `Progress on: ${goal.split(" ").slice(0, 4).join(" ")}...`
          ),
      ],
    })),
  };
}

async function generateWithClaude(
  section: keyof typeof PROMPT_MAPPING,
  context: ClaudeContext
): Promise<string | ClaudeResponse> {
  try {
    // Create a complete context object based on section requirements
    const enrichedContext: ClaudeContext = {
      ...context,
      profileText: context.profileText || "",
      archetypes: context.archetypes || "",
      consultationNotes: context.consultationNotes || "",
      offeringType: context.offeringType || "",
      addOns: context.addOns || "",
      topic: context.topic || "",
      goals: context.goals || "",
      mentorMessage: context.mentorMessage || "",
      mentorBio: context.mentorBio || "",
      grade: context.grade || "",
      successMetrics: context.successMetrics || "",
      engagementGoals: context.engagementGoals || "",
      studentPersonality: context.studentPersonality || "",
      goalTaxonomy: context.goalTaxonomy || "",
    };

    const prompt = PROMPT_MAPPING[section].replace(
      /{(\w+)}/g,
      (_, key: string) => enrichedContext[key as keyof ClaudeContext] || ""
    );

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (message.content[0].type !== "text") {
      throw new Error("Invalid response from Claude");
    }

    // Parse JSON response
    const response = JSON.parse(message.content[0].text);

    return response;
  } catch (error) {
    console.error(`Error generating ${section}:`, error);
    throw error;
  }
}

function generateFallbackStudentBlurb(
  profileText: string,
  archetypes: string[]
): string {
  let profile: StudentProfile = {};
  try {
    profile = profileText ? JSON.parse(profileText) : {};
  } catch (error) {
    console.error("Failed to parse profile text:", error);
  }

  const grade = profile?.grade || "high school";
  const school = profile?.school || "";

  return `${
    profile.name || "The student"
  } is a ${grade} student at ${school} who demonstrates ${
    archetypes.includes("ACADEMIC_ACCELERATOR")
      ? "strong academic performance"
      : "dedication to learning"
  }...`;
}

export async function GET(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const uuid = pathname.split("/").pop();

    if (!uuid) {
      return NextResponse.json(
        {
          data: null,
          error: "UUID parameter is required",
          details: "The learning plan UUID must be provided in the URL path",
        },
        { status: 400 }
      );
    }

    const proposal = await prisma.engagement_proposals
      .findUnique({
        where: { uuid },
        select: {
          offeringType: true,
          goals: true,
          addOnSelections: true,
          engagementGoals: true,
          studentArchetypes: true,
          availabilityNotes: true,
          successMetrics: true,
          topics: {
            select: {
              name: true,
            },
          },
          mentor_proposals: {
            where: {
              selected: true,
            },
            take: 1,
            select: {
              acceptanceMessage: true,
              description: true,
            },
          },
          studentProfileUuids: true,
        },
      })
      .catch((error) => {
        console.error("Database query failed:", error);
        throw new Error("Failed to fetch proposal data");
      });

    if (!proposal) {
      return NextResponse.json(
        {
          data: null,
          error: "Proposal not found",
          details: `No proposal found with UUID: ${uuid}`,
        },
        { status: 404 }
      );
    }

    // Get student profile data
    const studentProfile = proposal.studentProfileUuids?.[0]
      ? await prisma.student_profiles.findUnique({
          where: {
            uuid: proposal.studentProfileUuids[0],
          },
          select: {
            profileText: true,
          },
        })
      : null;

    // Get meeting transcript
    const submission = proposal.studentProfileUuids?.[0]
      ? await prisma.student_profile_submissions.findFirst({
          where: {
            studentProfileUuid: proposal.studentProfileUuids[0],
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            meetingTranscript: true,
          },
        })
      : null;

    // Gather all required context for prompts
    const context = {
      profileText: studentProfile?.profileText || "",
      archetypes: proposal.studentArchetypes?.join(", ") || "",
      consultationNotes: submission?.meetingTranscript || "",
      offeringType: proposal.offeringType || "",
      addOns: proposal.addOnSelections?.join(", ") || "",
      topic: proposal.topics?.name || "",
      goals: proposal.goals || "",
      mentorMessage: proposal.mentor_proposals[0]?.acceptanceMessage || "",
      mentorBio: proposal.mentor_proposals[0]?.description || "",
      grade: safeParseProfileText(studentProfile?.profileText)?.grade || "",
      successMetrics: proposal.successMetrics?.join(", ") || "",
      engagementGoals: proposal.engagementGoals?.join(", ") || "",
      studentPersonality: extractPersonality(studentProfile?.profileText || ""),
      goalTaxonomy: getGoalTaxonomy(proposal.offeringType || ""),
    };

    // Generate each section using individual functions
    const overview = {
      studentBlurb: await generateStudentBlurb(
        context.profileText || "",
        proposal.studentArchetypes || [],
        context.consultationNotes || ""
      ),
      engagementBlurb: generateEngagementBlurb(
        proposal.offeringType || "",
        proposal.addOnSelections || [],
        Array.isArray(proposal.goals) ? proposal.goals : [],
        proposal.topics?.name || ""
      ),
      mentorFitBlurb: generateMentorFitBlurb(
        proposal.mentor_proposals[0]?.acceptanceMessage || ""
      ),
    };

    const synthesizedGoal = generateSynthesizedGoal(
      Array.isArray(proposal.goals) ? proposal.goals : [],
      proposal.engagementGoals || [],
      proposal.offeringType || "",
      proposal.addOnSelections || []
    );

    const sessionStructure = generateSessionStructure(
      proposal.offeringType || "",
      proposal.addOnSelections || []
    );

    const roadmap = generateRoadmap(
      proposal.offeringType || "",
      proposal.addOnSelections || [],
      proposal.engagementGoals || []
    );

    // Construct the complete learning plan
    const learningPlan: LearningPlanStructure = {
      title: "Learning Plan",
      overview,
      requirements: generateRequirements(
        proposal.offeringType || "",
        proposal.addOnSelections || [],
        proposal.availabilityNotes || ""
      ),
      synthesizedGoal,
      sessionStructure,
      roadmap,
    };

    return NextResponse.json({ data: learningPlan, error: null });
  } catch (error) {
    console.error("Failed to generate learning plan:", error);
    return NextResponse.json(
      {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate learning plan",
      },
      { status: 500 }
    );
  }
}

// Helper functions
function extractPersonality(profileText: string): string {
  return (
    safeParseProfileText(profileText)?.personalityTraits ||
    safeParseProfileText(profileText)?.learningStyle ||
    ""
  );
}

function getGoalTaxonomy(offeringType: string): string {
  // Add your goal taxonomy based on offering type
  const taxonomies = {
    PASSION_PROJECT: "Project Development, Skill Building, Portfolio Creation",
    ACADEMIC_MENTORSHIP: "Academic Excellence, Study Skills, Subject Mastery",
    // Add other types as needed
  };
  return taxonomies[offeringType as keyof typeof taxonomies] || "";
}

function safeParseProfileText(profileText: string | null | undefined): {
  grade?: string;
  personalityTraits?: string;
  learningStyle?: string;
} {
  try {
    if (!profileText) return {};
    const parsed = JSON.parse(profileText);
    return typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
