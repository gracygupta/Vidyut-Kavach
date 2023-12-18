import {Schema, model, Document, ObjectId} from 'mongoose';

export interface AccessLogDocument extends Document{
    empID: string,
    role: string,
    ip: string,
    login: true | false
    timestamp: Date
}

interface AccessLog {
    empID: string,
    role: string,
    ip: string,
    login: true | false,
    timestamp: Date
}

const accessLogSchema = new Schema<AccessLog>({
    empID: {
        type: String,
        ref: 'users',
  },
  role: {
        type: String,
        ref: 'roles',
  },
  ip: {
        type: String,
        required: true
    },
    login: {
        type: Boolean,
        required: true,
        default: false
    },
    timestamp: { 
        type: Date,
        default: new Date
     }
}, { timestamps: true })

const AccessLog = model<AccessLog>('access_logs',accessLogSchema);

export default AccessLog;