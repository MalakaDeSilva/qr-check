import { NextRequest, NextResponse } from "next/server";
import { getRequestById, markReleased, markConfirmed } from "@/lib/requests";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await getRequestById(id);
    if (!doc) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch request" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const action = body?.action;

    if (action === "release") {
      const doc = await markReleased(id);
      if (!doc) {
        return NextResponse.json(
          { error: "Request not found or already released" },
          { status: 404 }
        );
      }
      return NextResponse.json(doc);
    }

    if (action === "confirm") {
      const doc = await markConfirmed(id);
      if (!doc) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }
      return NextResponse.json(doc);
    }

    return NextResponse.json(
      { error: "Invalid action. Use action: 'release' or 'confirm'" },
      { status: 400 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
