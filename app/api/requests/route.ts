import { NextRequest, NextResponse } from "next/server";
import { createRequest, listRequests } from "@/lib/requests";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const registrationNumber = body?.registrationNumber?.trim();
    if (!registrationNumber) {
      return NextResponse.json(
        { error: "Registration number is required" },
        { status: 400 }
      );
    }
    const doc = await createRequest({
      registrationNumber,
      message: body?.message,
      notifyEmail: body?.notifyEmail,
    });
    return NextResponse.json(doc);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "open" | "released" | "confirmed" | null;
    const search = searchParams.get("search") ?? undefined;
    const limit = searchParams.get("limit");
    const list = await listRequests({
      status: status ?? undefined,
      search,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to list requests" },
      { status: 500 }
    );
  }
}
