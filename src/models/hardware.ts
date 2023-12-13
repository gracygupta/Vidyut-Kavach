import {Schema, model, Document, ObjectId} from 'mongoose';

export interface HardwareDocument extends Document{
    hardwareID: string,
    manufacture_date: Date,
    modelID: string,
    installed_version: string
}

interface Hardware {
    hardwareID: string,
    manufacture_date: Date,
    modelID: string,
    installed_version: string
}

const hardwareSchema = new Schema<Hardware>({
    hardwareID: {
        type: String,
        required: true
    },
    manufacture_date: {
        type: Date,
        required:true
    },
    modelID: {
          type: String,
          ref: 'models',
    },
    installed_version: {
        type: String,
        required: true,
        default: ""
    }

}, { timestamps: true })

const Hardware = model<Hardware>('hardware',hardwareSchema);

export default Hardware;