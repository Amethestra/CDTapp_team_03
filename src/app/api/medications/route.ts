import { connectToDB } from "@/lib/mongodb";
import Medication from "@/models/Medication";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const childId = searchParams.get("childId");

        if (!childId) {
            return NextResponse.json({ error: "childId is required"}, { status: 400 });
        }

        const medications = await Medication.find({ childId });
        return NextResponse.json(medications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch medications"}, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connectToDB();
    const body = await req.json();

    console.log("Recieved Medication Data:", body);

    const {userId, childId, name, dosage, frequency, courseDays, nextDose} = body;

    if (!userId || !name || !dosage || !frequency || !courseDays) {
        return NextResponse.json({ error: "All fields are required"}, { status: 400});
    }
    try {
        const newMedication = new Medication({ userId, childId, name, dosage, frequency, courseDays, nextDose});
        await newMedication.save();
        return NextResponse.json({ message: "Medication added successfully"}, {status: 201});
    } catch (error) {
        console.error("Error adding medication:", error);
        return NextResponse.json({ error: "Failed to add Medication."}, { status: 500});
    }
}