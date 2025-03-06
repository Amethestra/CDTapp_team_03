import mongoose, { Schema, Document } from "mongoose";

export interface ISleep extends Document {
    userId: string;
    childId: string;
    date: string;
    sleepHours: number;
    quality: "good" | "medium" | "bad";
}

const SleepSchema = new Schema<ISleep>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true } as any,
    childId: { type: Schema.Types.ObjectId, ref: "Child", required: true } as any,
    date: { type: String, required: true }, // Storing as a string in "YYYY-MM-DD" format
    sleepHours: { type: Number, required: true },
    quality: { type: String, enum: ["good", "medium", "bad"], required: true },
});

const Sleep = mongoose.models.Sleep || mongoose.model<ISleep>("Sleep", SleepSchema);
export default Sleep;