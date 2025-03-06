import { connectToDB } from "@/lib/mongodb";
import Child from "@/models/Child";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    
    const { userId, childName, birthDate, gender } = await req.json();

    // ✅ Ensure all fields are provided
    if (!userId || !childName || !birthDate || !gender) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // ✅ Ensure birthDate is a valid date
    if (isNaN(Date.parse(birthDate))) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // ✅ Create and save new child
    const newChild = new Child({
      userId,
      childName,
      birthDate: new Date(birthDate),
      gender,
    });

    await newChild.save();

    return NextResponse.json({ message: "Child added successfully", child: newChild }, { status: 201 });
  } catch (error) {
    console.error("Error adding child:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
