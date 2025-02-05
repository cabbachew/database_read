import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type UserEngagement = {
  users: {
    student_profiles: {
      firstName: string;
    } | null;
    firstName?: string;
  };
};

type TransformedEngagementData = {
  title: string;
  status: string;
  topic: string | null;
  studentName: string | null;
  mentorName: string | null;
};

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const { uuid } = params;

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

    const transformedData: TransformedEngagementData = {
      title: result.title,
      status: result.status,
      topic: result.topics?.name || null,
      studentName:
        (result.users_engagements as UserEngagement[])[0]?.users
          ?.student_profiles?.firstName ?? null,
      mentorName:
        (result.users_engagements as UserEngagement[])[1]?.users?.firstName ??
        null,
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
