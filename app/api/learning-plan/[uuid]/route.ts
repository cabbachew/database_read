import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const proposal = await prisma.engagement_proposals.findUnique({
      where: { uuid: params.uuid },
      select: {
        title: true,
        offeringType: true,
        goals: true,
        engagementGoals: true,
        studentArchetypes: true,
        successMetrics: true,
        topics: {
          select: { name: true },
        },
        studentProfileUuids: true,
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { data: null, error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Get student profile
    const studentProfile = proposal.studentProfileUuids?.[0]
      ? await prisma.student_profiles.findUnique({
          where: { uuid: proposal.studentProfileUuids[0] },
          select: { profileText: true },
        })
      : null;

    const transformedData = {
      title: proposal.title || "Learning Plan",
      overview: {
        engagementBlurb: proposal.goals || "",
        studentProfile: studentProfile?.profileText || "",
        archetypes: proposal.studentArchetypes || [],
        offeringType: proposal.offeringType || "",
        topic: proposal.topics?.name || "",
      },
      requirements: proposal.successMetrics || [],
      synthesizedGoal: {
        highLevelGoal: proposal.goals || "",
        subGoals:
          proposal.engagementGoals?.map((goal) => ({
            title: "Goal",
            items: [goal],
          })) || [],
      },
      roadmap: {
        monthlyRoadmap: [
          {
            title: "Month 1: Foundation & Focus",
            items: [
              "Define project scope and goals",
              "Establish workflow and tools",
              "Begin initial work",
              "Create detailed timeline",
            ],
          },
          {
            title: "Month 2: Development",
            items: [
              "Deepen core skills",
              "Expand project scope",
              "Regular progress reviews",
              "Milestone tracking",
            ],
          },
          {
            title: "Month 3: Refinement",
            items: [
              "Polish deliverables",
              "Address challenges",
              "Prepare final work",
              "Plan next steps",
            ],
          },
        ],
        weeklyRoadmap: [
          {
            title: "Sessions 1-2",
            items: [
              "Project setup and planning",
              "Initial skill assessment",
              "Set up documentation",
              "Begin foundational work",
            ],
          },
          {
            title: "Sessions 3-4",
            items: [
              "Core skill development",
              "Project framework",
              "Progress documentation",
              "Review and adjust",
            ],
          },
          {
            title: "Sessions 5-6",
            items: [
              "Advanced concepts",
              "Project expansion",
              "Skill refinement",
              "Milestone check",
            ],
          },
        ],
      },
      sessionStructure: {
        firstSessionAgenda: [
          {
            title: "Introduction & Vision (15 min)",
            items: [
              "Share backgrounds and interests",
              "Discuss goals and expectations",
              "Explore potential directions",
            ],
          },
          {
            title: "Project Planning (30 min)",
            items: [
              "Review topics and goals",
              "Discuss approach",
              "Begin developing plan",
            ],
          },
          {
            title: "Organization Setup (15 min)",
            items: [
              "Establish documentation system",
              "Set up progress tracking",
              "Plan initial steps",
            ],
          },
        ],
        generalSessionAgenda: [
          {
            title: "Progress Review (10 min)",
            items: [
              "Review progress",
              "Address challenges",
              "Set session objectives",
            ],
          },
          {
            title: "Core Work (40 min)",
            items: [
              "Skill development",
              "Project work",
              "Practice and application",
            ],
          },
          {
            title: "Next Steps (10 min)",
            items: [
              "Summarize accomplishments",
              "Set next goals",
              "Plan next session",
            ],
          },
        ],
      },
    };

    return NextResponse.json({ data: transformedData, error: null });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { data: null, error: "Failed to generate learning plan" },
      { status: 500 }
    );
  }
}
