import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topics = await prisma.topics.findMany({
      where: {
        archivedAt: null,
      },
      select: {
        uuid: true,
        name: true,
        disciplines: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Transform the data to match the expected TopicOption type
    const transformedTopics = topics.map((topic) => ({
      uuid: topic.uuid,
      name: topic.name,
      discipline: topic.disciplines.name,
      disciplines: {
        name: topic.disciplines.name,
      },
    }));

    return NextResponse.json({
      data: transformedTopics,
      error: null,
    });
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return NextResponse.json(
      { data: null, error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}
