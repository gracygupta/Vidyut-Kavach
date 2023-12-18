import {Schema, model, Document, ObjectId} from 'mongoose';

export interface IDSDocument extends Document{
    idsID: string,
    status: "active" | "inactive" 
}

interface IDS {
    idsID: string,
    status: "active" | "inactive" 
}

const IDSSchema = new Schema<IDS>({
    idsID: {
        type: String,
  },
  status:{
    type: String,
    enum: ["active", "inactive"]
  }
     
}, { timestamps: true })

const IDS = model<IDS>('ids_status',IDSSchema);

export default IDS;