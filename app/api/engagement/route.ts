import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toJsonWithBigInt } from "@/lib/bigIntToString";

type EngagementResponse = {
  data: {
    likes: number;
    comments: number;
    shares: number;
  };
  error?: string;
};

type RequestData = {
  url: string;
};

type ErrorResponse = {
  error: string;
  data: null;
};

type EngagementResult = {
  likes: number;
  comments: number;
  shares: number;
};

type ApiResponse = {
  data: EngagementResult | null;
  error: string | null;
};

export async function GET(request: Request) {
  try {
    // Extract search params
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get("uuid"); // e.g. /api/engagement?uuid=ABC123

    if (!uuid) {
      return NextResponse.json(
        { error: "No engagement UUID provided" },
        { status: 400 }
      );
    }

    // --- Your raw SQL here, parameterized by the single UUID: ---
    const data = await prisma.$queryRaw`
      WITH RECURSIVE engagement_uuid AS (
        SELECT ${uuid}::uuid as uuid
      ),
      mentors AS (
        SELECT uuid, "fullName", email
        FROM users
        WHERE 'mentor' = ANY(roles)
      ),
      students AS (
        SELECT uuid, "fullName"
        FROM users
        WHERE 'student' = ANY(roles)
      ),
      first_sessions AS (
        SELECT
          ce."engagementUuid",
          MIN(ce.start) as first_session_date
        FROM calendar_events ce
        WHERE ce.status = 'completed'
        GROUP BY ce."engagementUuid"
      )
      SELECT
        e.title,
        e."createdAt",
        e.description,
        e.status,
        d.name AS "discipline",
        t.name AS "topic",
        ep."addOnSelections" AS "addOns",
        ep."engagementGoals" AS "structuredGoals",
        ep.goals AS "pitchDescription",
        ep."offeringType" AS offering,
        ep."studentArchetypes" AS "studentArchetypes",
        ep."successMetrics" AS "pitchSuccessMetrics",
        m."fullName" AS "mentorName",
        m.email AS "mentorEmail",
        s."fullName" AS "studentName",
        mp."acceptanceMessage" AS "acceptMessage",
        mp."description",
        sp.gender AS "studentGender",
        sp.grade,
        sp."profileText" AS "studentProfileText",
        sp."successMetrics" AS "successMetrics",
        fs.first_session_date AS "firstSessionDate",
        COUNT(DISTINCT ce.uuid) as "sessionCount",
        STRING_AGG(ce.start::text,', ' ORDER BY ce.start) as "sessionDates",
        STRING_AGG(ce.description::text, ' | ' ORDER BY ce.start) as "sessionNotes",
        STRING_AGG(sa.summary::text,' | ' ORDER BY ce.start) as "sessionSummaries",
        STRING_AGG(DISTINCT er."publishedAt"::text, ', ') as "publishedDates",
        STRING_AGG(er."personalNote", ' | ' ORDER BY er."publishedAt") as "personalNotes",
        STRING_AGG(er."demonstratedStrengths", ' | ' ORDER BY er."publishedAt") as "demonstratedStrengths",
        STRING_AGG(er."opportunityForGrowth", ' | ' ORDER BY er."publishedAt") as "opportunitiesForGrowth",
        STRING_AGG(er.recommendation, ' | ' ORDER BY er."publishedAt") as "recommendations"
      FROM engagements e
      JOIN engagement_uuid uu ON e.uuid::text = uu.uuid::text
      LEFT JOIN disciplines d ON e."disciplineUuid" = d.uuid
      LEFT JOIN topics t ON e."topicUuid" = t.uuid
      LEFT JOIN engagement_proposals ep ON e."engagementProposalUuid" = ep.uuid
      LEFT JOIN mentor_proposals mp ON mp."engagementProposalUuid" = ep.uuid
      JOIN users_engagements ue_m ON e.uuid = ue_m."engagementUuid"
      JOIN mentors m ON m.uuid = ue_m."userUuid"
      JOIN users_engagements ue_s ON e.uuid = ue_s."engagementUuid"
      JOIN students s ON s.uuid = ue_s."userUuid"
      JOIN student_profiles sp ON sp."userUuid" = s.uuid
      LEFT JOIN first_sessions fs ON e.uuid = fs."engagementUuid"
      LEFT JOIN calendar_events ce ON e.uuid = ce."engagementUuid"
        AND ce.status = 'completed'
      LEFT JOIN session_assets sa ON ce.uuid = sa."calendarEventUuid"
      LEFT JOIN engagement_reports er ON e.uuid = er."engagementUuid"
        AND er."publishedAt" IS NOT NULL
      GROUP BY
        e.title,
        e."createdAt",
        e.description,
        e.status,
        d.name,
        t.name,
        ep."addOnSelections",
        ep."engagementGoals",
        ep.goals,
        ep."offeringType",
        ep."studentArchetypes",
        ep."successMetrics",
        m."fullName",
        m.email,
        s."fullName",
        mp."acceptanceMessage",
        mp."description",
        sp.gender,
        sp.grade,
        sp."profileText",
        sp."successMetrics",
        fs.first_session_date
    `;

    // If it returns an array, we might only need the first row, or all. Adjust as needed:
    const result = Array.isArray(data) && data.length ? data[0] : null;

    if (!result) {
      return NextResponse.json(
        { error: "No engagement found" },
        { status: 404 }
      );
    }

    // Convert BigInts etc:
    const jsonString = toJsonWithBigInt(result);
    const parsed = JSON.parse(jsonString);

    // Return the engagement data
    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { url } = (await request.json()) as RequestData;
    const data = await fetchEngagementData(url);
    const response: ApiResponse = { data, error: null };
    return Response.json(response);
  } catch (error: unknown) {
    const response: ApiResponse = {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
    return Response.json(response);
  }
}

async function fetchEngagementData(url: string): Promise<EngagementResult> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch engagement data");
  }
  return { likes: 0, comments: 0, shares: 0 };
}
