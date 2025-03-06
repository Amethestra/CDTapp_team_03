import { connectToDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();
    return NextResponse.json({ message: "✅ Successfully connected to MongoDB Atlas on AWS!" }, { status: 200 });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return NextResponse.json({ error: "❌ Failed to connect to MongoDB" }, { status: 500 });
  }
}
