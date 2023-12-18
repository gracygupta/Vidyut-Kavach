import {Schema, model, Document, ObjectId} from 'mongoose';

export interface SecurityAlertDocument extends Document{
    aleart_id: number,
    read: boolean,
    type: string,
    severity: "Critical" | "High" | "Medium" | "Low",
    attacker_ip : string,
    action: "blocked" | "on-surviellance",
    description: string,
    timestamp: Date
}

interface SecurityAlert {
    aleart_id: number,
    read: boolean,
    type: string,
    severity: "Critical" | "High" | "Medium" | "Low",
    attacker_ip : string,
    action: "blocked" | "on-surviellance",
    description: string,
    timestamp: Date
}

const securityAlertSchema = new Schema<SecurityAlert>({
    aleart_id: {
        type: Number,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["Critical", "High", "Medium", "Low"]
    },
    attacker_ip: {
        type: String,
    },
    action: {
        type: String,
        enum: ["blocked", "on-surviellance"]
    },
    description: {
        type: String,
        default: ""
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
},{ timestamps: true })

const SecurityAlert = model<SecurityAlert>('security_alerts', securityAlertSchema);

export default SecurityAlert;