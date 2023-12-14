import { Schema, model, Document, ObjectId } from "mongoose";

interface Property {
  type: typeof Map;
  of: typeof Schema.Types.Mixed;
  default: Record<string, any>;
}

export interface HardwareDocument extends Document {
  hardwareID: string;
  componentID: string;
  name: string;
  type: string;
  manufacturer: string;
  installation_date: Date;
  manufacture_date: Date;
  modelID: string;
  installed_version: string;
  properties: Property;
}

interface Hardware {
  hardwareID: string;
  componentID: string;
  name: string;
  type: string;
  manufacturer: string;
  installation_date: Date;
  manufacture_date: Date;
  modelID: string;
  installed_version: string;
  properties: Property;
}

const hardwareSchema = new Schema<Hardware>(
  {
    hardwareID: {
      type: String,
      unique: true
    },
    componentID: {
      type: String,
      ref: "components",
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Battery", "Solar Panel", "Wind Turbine","Diesel Generator", "Inverter"],
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    manufacture_date: {
      type: Date,
      required: true,
    },
    modelID: {
        type: String,
        ref: "models",
      },
    installation_date: {
      type: Date,
      required: true,
    },
    
    installed_version: {
      type: String,
      required: true,
      default: "",
    },
    properties: {
      type: Map, // Using Map to store key-value pairs
      of: Schema.Types.Mixed, // Mixed type to allow any data type
      default: {},
    },
  },
  { timestamps: true }
);

const Hardware = model<Hardware>("hardwares", hardwareSchema);

export default Hardware;
