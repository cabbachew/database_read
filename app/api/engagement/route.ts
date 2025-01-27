import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Update type definition to match all fields
type EngagementResult = {
  data: {
    title: string;
    createdAt: Date;
    engagementDescription: string | null;
    status: string;
    discipline: string | null;
    topic: string | null;
    addOns: string[] | null;
    structuredGoals: string[] | null;
    pitchDescription: string | null;
    offering: string | null;
    studentArchetypes: string[] | null;
    pitchSuccessMetrics: string[] | null;
    mentorName: string | null;
    mentorEmail: string | null;
    studentName: string | null;
    acceptMessage: string | null;
    mentorProposalDescription: string | null;
    studentGender: string | null;
    grade: string | null;
    studentProfileText: string | null;
    successMetrics: string[] | null;
    firstSessionDate: Date | null;
    sessionCount: number;
    sessionDates: string | null;
    sessionNotes: string | null;
    sessionSummaries: string | null;
    publishedDates: string | null;
    personalNotes: string | null;
    demonstratedStrengths: string | null;
    opportunitiesForGrowth: string | null;
    recommendations: string | null;
  };
  error: string | null;
};

/**
 * Example GET handler that receives an array of UUIDs
 * (maybe from query parameters or environment, etc.),
 * then queries only those engagements via a CTE
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const uuidsParam = searchParams.get("uuids");

    if (!uuidsParam) {
      return NextResponse.json(
        { data: null, error: "UUID parameter is required" },
        { status: 400 }
      );
    }

    const results = await prisma.engagements.findFirst({
      where: {
        uuid: uuidsParam,
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

    if (!results) {
      return NextResponse.json(
        { data: null, error: "Engagement not found" },
        { status: 404 }
      );
    }

    const mentor = results.users_engagements.find((ue) =>
      ue.users.roles?.includes("mentor")
    )?.users;

    const student = results.users_engagements.find((ue) =>
      ue.users.roles?.includes("student")
    )?.users;

    const transformedData = {
      title: results.title,
      createdAt: results.createdAt,
      engagementDescription: results.description,
      status: results.status,
      discipline: results.disciplines?.name,
      topic: results.topics?.name,
      addOns: results.engagement_proposals?.addOnSelections,
      structuredGoals: results.engagement_proposals?.engagementGoals,
      pitchDescription: results.engagement_proposals?.goals,
      offering: results.engagement_proposals?.offeringType,
      studentArchetypes: results.engagement_proposals?.studentArchetypes,
      pitchSuccessMetrics: results.engagement_proposals?.successMetrics,
      mentorName: mentor?.fullName,
      mentorEmail: mentor?.email,
      studentName: student?.fullName,
      acceptMessage:
        results.engagement_proposals?.mentor_proposals[0]?.acceptanceMessage,
      mentorProposalDescription:
        results.engagement_proposals?.mentor_proposals[0]?.description,
      studentGender: student?.student_profiles[0]?.gender,
      grade: student?.student_profiles[0]?.grade,
      studentProfileText: student?.student_profiles[0]?.profileText,
      successMetrics: student?.student_profiles[0]?.successMetrics,
      firstSessionDate: results.calendar_events[0]?.start,
      sessionCount: results.calendar_events.length,
      sessionDates:
        results.calendar_events.length > 0
          ? results.calendar_events
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map((ce) => ce.start.toISOString())
              .join(", ")
          : null,
      sessionNotes:
        results.calendar_events.length > 0
          ? results.calendar_events
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map((ce) => ce.description)
              .filter(Boolean)
              .join(" | ")
          : null,
      sessionSummaries:
        results.calendar_events.length > 0
          ? results.calendar_events
              .sort((a, b) => a.start.getTime() - b.start.getTime())
              .map((ce) => {
                const assets = Array.isArray(ce.session_assets)
                  ? ce.session_assets
                  : ce.session_assets
                  ? [ce.session_assets]
                  : [];
                return assets
                  .map((sa) => sa.summary)
                  .filter(Boolean)
                  .join(" | ");
              })
              .filter(Boolean)
              .join(" | ")
          : null,
      publishedDates:
        results.engagement_reports.length > 0
          ? [
              ...new Set(
                results.engagement_reports
                  .map((er) => er.publishedAt?.toISOString())
                  .filter(Boolean)
              ),
            ].join(", ")
          : null,
      personalNotes:
        results.engagement_reports.length > 0
          ? results.engagement_reports
              .sort(
                (a, b) => a.publishedAt!.getTime() - b.publishedAt!.getTime()
              )
              .map((er) =>
                er.personalNote && er.publishedAt
                  ? `${er.personalNote} (${er.publishedAt.toISOString()})`
                  : null
              )
              .filter(Boolean)
              .join(" | ")
          : null,
      demonstratedStrengths:
        results.engagement_reports.length > 0
          ? results.engagement_reports
              .sort(
                (a, b) => a.publishedAt!.getTime() - b.publishedAt!.getTime()
              )
              .map((er) =>
                er.demonstratedStrengths && er.publishedAt
                  ? `${
                      er.demonstratedStrengths
                    } (${er.publishedAt.toISOString()})`
                  : null
              )
              .filter(Boolean)
              .join(" | ")
          : null,
      opportunitiesForGrowth:
        results.engagement_reports.length > 0
          ? results.engagement_reports
              .sort(
                (a, b) => a.publishedAt!.getTime() - b.publishedAt!.getTime()
              )
              .map((er) =>
                er.opportunityForGrowth && er.publishedAt
                  ? `${
                      er.opportunityForGrowth
                    } (${er.publishedAt.toISOString()})`
                  : null
              )
              .filter(Boolean)
              .join(" | ")
          : null,
      recommendations:
        results.engagement_reports.length > 0
          ? results.engagement_reports
              .sort(
                (a, b) => a.publishedAt!.getTime() - b.publishedAt!.getTime()
              )
              .map((er) =>
                er.recommendation && er.publishedAt
                  ? `${er.recommendation} (${er.publishedAt.toISOString()})`
                  : null
              )
              .filter(Boolean)
              .join(" | ")
          : null,
    };

    return NextResponse.json({
      data: transformedData,
      error: null,
    });
  } catch (err) {
    console.error("Database Error:", err);
    return NextResponse.json(
      {
        data: null,
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
