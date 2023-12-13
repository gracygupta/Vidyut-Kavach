import {Schema, model, Document, ObjectId} from 'mongoose';

export interface HardwareUpdateDocument extends Document{
    modelID: string,
    hardwareID: string,
    latest_version: string,
    installed_version: string,
    status: 'yes' | 'no'
}

interface HardwareUpdate {
    modelID: string,
    hardwareID: string,
    latest_version: string,
    installed_version: string,
    status: 'yes' | 'no'
}

const hardwareUpdateSchema = new Schema<HardwareUpdate>({
    modelID: {
        type: String,
        ref: 'models',
  },
    hardwareID: {
        type: String,
        ref: 'hardware',
  },
    latest_version: {
        type: String,
        required: true
    },
    installed_version: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['yes', 'no']
    }
}, { timestamps: true })

const HardwareUpdate = model<HardwareUpdate>('hardware',hardwareUpdateSchema);

export default HardwareUpdate;