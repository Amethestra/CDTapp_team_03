import mongoose, { Schema, Document } from "mongoose";

export interface IChild extends Document {
  userId: string; // The parent user ID
  childName: string;
  birthDate: Date;
  gender: string;
}

const ChildSchema = new Schema<IChild>({
  userId: { type: String, required: true }, // Links child to the user
  childName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
});

const Child = mongoose.models.Child || mongoose.model<IChild>("Child", ChildSchema);
export default Child;
