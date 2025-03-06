import mongoose, { Schema, Document } from "mongoose";

export interface IMedication extends Document {
  userId: string; // Parent user ID (redundant but useful for quick lookups)
  childId: string; // The child's ID this medication is for
  name: string;
  dosage: string;
  frequency: string;
  courseDays: number;
  nextDose: Date;
}

const MedicationSchema = new Schema<IMedication>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true } as any,
    childId: { type: Schema.Types.ObjectId, ref: "Child", required: true } as any, // ✅ Ensure childId is required
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    courseDays: { type: Number, required: true },
    nextDose: { type: Date, required: true },
});

const Medication = mongoose.models.Medication || mongoose.model<IMedication>("Medication", MedicationSchema);
export default Medication;
