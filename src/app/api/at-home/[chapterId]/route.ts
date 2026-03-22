import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const { chapterId } = await params;

  const res = await fetch(
    `https://api.mangadex.org/at-home/server/${chapterId}`,
    { headers: { "Content-Type": "application/json" } }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch at-home server" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
