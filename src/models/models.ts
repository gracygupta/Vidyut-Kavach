import { Schema, model, Document, ObjectId } from "mongoose";

export interface ModelDocument extends Document {
  modelID: string;
  company_name: string;
  model_name: string;
  latest_version: string;
}

interface Model {
  modelID: string;
  company_name: string;
  model_name: string;
  latest_version: string;
}

const modelSchema = new Schema<Model>(
  {
    modelID: {
      type: String,
      required: true,
      unique: true
    },
    company_name: {
      type: String,
      required: true,
    },
    model_name: {
      type: String,
    },
    latest_version: {
      type: String,
    },
  },
  { timestamps: true }
);

const Model = model<Model>("models", modelSchema);

export default Model;
