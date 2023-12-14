import { Schema, model, Document, ObjectId } from "mongoose";

interface Component {
  type: string;
  componentID: string;
}

export interface NanogridDocument extends Document {
  nanogridID: string;
  name: string;
  components: Component[];
}

interface Nanogrid {
  nanogridID: string;
  name: string;
  components: Component[];
}

const nanogridSchema = new Schema<Nanogrid>(
  {
    nanogridID: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      reuired: true,
    },
    components: [
      {
        type: {
          type: String,
          required: true,
        },
        componentID: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Nanogrid = model<Nanogrid>("nanogrids", nanogridSchema);

export default Nanogrid;
