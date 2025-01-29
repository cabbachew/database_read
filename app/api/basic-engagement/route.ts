import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get("uuid");

    if (!uuid) {
      return NextResponse.json(
        { data: null, error: "UUID parameter is required" },
        { status: 400 }
      );
    }

    const result = await prisma.engagements.findFirst({
      where: {
        uuid: uuid,
      },
      select: {
        title: true,
        status: true,
        description: true,
        disciplines: {
          select: {
            name: true,
          },
        },
        topics: {
          select: {
            name: true,
          },
        },
        users_engagements: {
          include: {
            users: {
              select: {
                fullName: true,
                roles: true,
                email: true,
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
          select: {
            start: true,
            description: true,
            session_assets: {
              select: {
                summary: true,
              },
            },
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

    const mentor = result.users_engagements.find((ue) =>
      ue.users.roles?.includes("mentor")
    )?.users;

    const student = result.users_engagements.find((ue) =>
      ue.users.roles?.includes("student")
    )?.users;

    const transformedData = {
      title: result.title,
      status: result.status,
      description: result.description,
      discipline: result.disciplines?.name,
      topic: result.topics?.name,
      mentorName: mentor?.fullName || null,
      mentorEmail: mentor?.email || null,
      studentName: student?.fullName || null,
      sessionCount: result.calendar_events.length,
      sessionDates: result.calendar_events.map((ce) => ce.start),
      sessionNotes: result.calendar_events
        .map((ce) => ce.description)
        .filter(Boolean),
      sessionSummaries: result.calendar_events
        .map((ce) => ce.session_assets?.summary)
        .filter(Boolean),
    };

    return NextResponse.json({
      data: transformedData,
      error: null,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      {
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
