import { connectToDB } from "@/lib/mongodb";
import Child from "@/models/Child";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const children = await Child.find({ userId });

    return NextResponse.json(children, { status: 200 });
  } catch (error) {
    console.error("Error fetching user's children:", error);
    return NextResponse.json({ error: "Failed to fetch children" }, { status: 500 });
  }
}
