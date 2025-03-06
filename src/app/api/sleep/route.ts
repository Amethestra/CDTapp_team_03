import { connectToDB } from "@/lib/mongodb";
import Sleep from "@/models/Sleep";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET request: Fetch sleep records for a specific child
export async function GET(req: NextRequest) {
  await connectToDB();

  const url = new URL(req.url);
  const childId = url.searchParams.get("childId");

  if (!childId) {
    return NextResponse.json({ error: "Child ID is required" }, { status: 400 });
  }

  try {
    const sleepRecords = await Sleep.find({ childId }).sort({ date: -1 });
    return NextResponse.json(sleepRecords, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sleep data" }, { status: 500 });
  }
}

// ✅ POST request: Add new sleep entry
export async function POST(req: NextRequest) {
  await connectToDB();
  const { userId, childId, date, sleepHours, quality } = await req.json();

  if (!userId || !childId || !date || !sleepHours || !quality) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const newSleepEntry = new Sleep({ userId, childId, date, sleepHours, quality });
    await newSleepEntry.save();

    return NextResponse.json({ message: "Sleep data added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add sleep data" }, { status: 500 });
  }
}
