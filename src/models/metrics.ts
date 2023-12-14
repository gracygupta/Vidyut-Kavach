import { Schema, model, Document, ObjectId } from "mongoose";

export interface ComponentMetricDocument extends Document {
  componentID: string,
  value: Schema.Types.Decimal128,
  status: "active" | "inactive",
  type: string

}

interface ComponentMetric {
  componentID: ObjectId,
  value: Schema.Types.Decimal128,
  status: "active" | "inactive",
  type: string
}

const componentMetricSchema = new Schema<ComponentMetric>(
  {
    componentID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    value:{
      type: Schema.Types.Decimal128,
      required: true
    },
    status:{
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active"
    },
    type: {
      type: String,
      required: true 
    }
  },
  { timestamps: true }
);

const ComponentMetricInstant = model<ComponentMetric>(
  "component_metric_instant",
  componentMetricSchema
);

const ComponentMetricHourly = model<ComponentMetric>(
  "component_metric_hourly",
  componentMetricSchema
);

const ComponentMetricDaily = model<ComponentMetric>(
  "component_metric_daily",
  componentMetricSchema
);

export { ComponentMetricInstant, ComponentMetricHourly, ComponentMetricDaily };
