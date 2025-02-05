import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define specific types for the metrics and goals
type StructuredGoal = {
  title: string;
  description: string;
  status?: "pending" | "in_progress" | "completed";
};

type SuccessMetric =
  | string
  | {
      metric: string;
      target?: string | number;
      currentValue?: string | number;
      notes?: string;
    };

// Define the complex return type structure
type TransformedEngagementData = {
  // Basic engagement info
  engagementTitle: string;
  engagementCreatedAt: Date;
  engagementDescription: string;
  offering: string;
  status: string;
  discipline: string | null;
  topic: string | null;

  // Proposal related fields
  addOns: string[] | null;
  structuredGoals: StructuredGoal[] | null;
  pitchDescription: string | null;
  proposalOffering: string | null;
  studentArchetypes: string[] | null;
  pitchSuccessMetrics: SuccessMetric[] | null;

  // Student profile information
  studentGender: string | null;
  studentGrade: string | null;
  studentProfileText: string | null;
  successMetrics: SuccessMetric[] | null;

  // Session information
  firstSessionDate: Date | null;
  sessionCount: number;
  sessionDates: string[];
  sessionNotes: string[];
  sessionSummaries: string[];

  // User information
  studentName: string | null;
  mentorName: string | null;
  mentorEmail: string | null;

  // Mentor proposal information
  acceptMessage: string | null;
  proposalDescription: string | null;

  // Report information
  publishedDates: string[];
  personalNotes: string[];
  demonstratedStrengths: string[];
  opportunitiesForGrowth: string[];
  recommendations: string[];
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params;

    const result = await prisma.engagements.findFirst({
      where: {
        uuid: uuid,
      },
      include: {
        disciplines: true,
        topics: true,
        engagement_proposals: {
          include: {
            mentor_proposals: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
        users_engagements: {
          include: {
            users: {
              include: {
                student_profiles: true,
              },
            },
          },
        },
        calendar_events: {
          where: {
            status: "completed",
          },
          orderBy: {
            start: "asc",
          },
          include: {
            session_assets: true,
          },
        },
        engagement_reports: {
          where: {
            publishedAt: {
              not: null,
            },
          },
          orderBy: {
            publishedAt: "asc",
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        { data: null, error: "Engagement not found" },
        { status: 404 }
      );
    }

    // Get student and mentor users
    const studentUser = result.users_engagements.find((ue) =>
      ue.users.roles.includes("student")
    )?.users;
    const mentorUser = result.users_engagements.find((ue) =>
      ue.users.roles.includes("mentor")
    )?.users;

    // Get completed calendar events
    const completedEvents = result.calendar_events.filter(
      (event) => event.status === "completed"
    );

    // Transform the data
    const transformedData: TransformedEngagementData = {
      engagementTitle: result.title,
      engagementCreatedAt: result.createdAt,
      engagementDescription: result.description,
      offering: result.contractType,
      status: result.status,
      discipline: result.disciplines?.name ?? null,
      topic: result.topics?.name ?? null,

      // Proposal data
      addOns: Array.isArray(result.engagement_proposals)
        ? result.engagement_proposals[0]?.addOnSelections ?? null
        : null,
      structuredGoals: Array.isArray(result.engagement_proposals)
        ? result.engagement_proposals[0]?.engagementGoals ?? null
        : null,
      pitchDescription: Array.isArray(result.engagement_proposals)
        ? result.engagement_proposals[0]?.goals ?? null
        : null,
      proposalOffering: Array.isArray(result.engagement_proposals)
        ? result.engagement_proposals[0]?.offeringType ?? null
        : null,
      studentArchetypes: Array.isArray(result.engagement_proposals)
        ? result.engagement_proposals[0]?.studentArchetypes ?? null
        : null,
      pitchSuccessMetrics: Array.isArray(result.engagement_proposals)
        ? result.engagement_proposals[0]?.successMetrics ?? null
        : null,

      // Student profile data
      studentGender: studentUser?.student_profiles?.gender ?? null,
      studentGrade: studentUser?.student_profiles?.grade ?? null,
      studentProfileText: studentUser?.student_profiles?.profileText ?? null,
      successMetrics: studentUser?.student_profiles?.successMetrics ?? null,

      // Session information
      firstSessionDate: completedEvents[0]?.start ?? null,
      sessionCount: completedEvents.length,
      sessionDates: completedEvents.map((event) => event.start.toISOString()),
      sessionNotes: completedEvents
        .map((event) => event.description ?? "")
        .filter(Boolean),
      sessionSummaries: completedEvents
        .flatMap((event) =>
          Array.isArray(event.session_assets)
            ? event.session_assets.map((asset) => asset.summary ?? "")
            : []
        )
        .filter(Boolean),

      // User information
      studentName: studentUser?.fullName ?? null,
      mentorName: mentorUser?.fullName ?? null,
      mentorEmail: mentorUser?.email ?? null,

      // Mentor proposal information
      acceptMessage: Array.isArray(result.engagement_proposals)
        ? (Array.isArray(result.engagement_proposals[0]?.mentor_proposals)
            ? result.engagement_proposals[0]?.mentor_proposals[0]
                ?.acceptanceMessage
            : null) ?? null
        : null,
      proposalDescription: Array.isArray(result.engagement_proposals)
        ? (Array.isArray(result.engagement_proposals[0]?.mentor_proposals)
            ? result.engagement_proposals[0]?.mentor_proposals[0]?.description
            : null) ?? null
        : null,

      // Report information
      publishedDates: result.engagement_reports
        .map((report) => report.publishedAt?.toISOString() ?? "")
        .filter(Boolean),
      personalNotes: result.engagement_reports
        .map((report) => report.personalNote ?? "")
        .filter(Boolean),
      demonstratedStrengths: result.engagement_reports
        .map((report) => report.demonstratedStrengths ?? "")
        .filter(Boolean),
      opportunitiesForGrowth: result.engagement_reports
        .map((report) => report.opportunityForGrowth ?? "")
        .filter(Boolean),
      recommendations: result.engagement_reports
        .map((report) => report.recommendation ?? "")
        .filter(Boolean),
    };

    return NextResponse.json({ data: transformedData, error: null });
  } catch (error) {
    console.error("Error fetching engagement:", error);
    return NextResponse.json(
      { data: null, error: "Failed to fetch engagement" },
      { status: 500 }
    );
  }
}
