import { Schema, model, Document, ObjectId } from "mongoose";

export interface TypeDocument extends Document {
  name: string;
  source_type: "input" | "output" | "storage";
}

interface Type {
  name: string;
  source_type: "input" | "output" | "storage";
}

const typeSchema = new Schema<Type>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    source_type: {
      type: String,
      required: true,
      enum: ["input", "output", "storage"],
    },
  },
  { timestamps: true }
);

const Type = model<Type>("types", typeSchema);

export default Type;
