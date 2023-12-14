import { Schema, model, Document, ObjectId } from "mongoose";

interface Property {
  type: typeof Map;
  of: typeof Schema.Types.Mixed;
  default: Record<string, any>;
}

export interface ComponentDocument extends Document {
  componentID: string;
  name: string;
  type: ObjectId;
  latitude: Schema.Types.Decimal128;
  longitude: Schema.Types.Decimal128;
  capacity: number;
  properties: Property;
}

interface Component {
  componentID: string;
  name: string;
  type: ObjectId;
  latitude: Schema.Types.Decimal128;
  longitude: Schema.Types.Decimal128;
  capacity: number;
  properties: Property;
}

const componentSchema = new Schema<Component>(
  {
    componentID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      reuired: true,
    },
    type: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    latitude: {
      type: Schema.Types.Decimal128,
    },
    longitude: {
      type: Schema.Types.Decimal128,
    },
    properties: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const Component = model<Component>("components", componentSchema);

export default Component;
