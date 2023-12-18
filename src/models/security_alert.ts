import {Schema, model, Document, ObjectId} from 'mongoose';

export interface SecurityAlertDocument extends Document{
    alert_id: number,
    read: boolean,
    type: string,
    severity: "Critical" | "High" | "Medium" | "Low",
    attacker_ip : string,
    action: "blocked" | "on-surviellance",
    description: string,
}

interface SecurityAlert {
    alert_id: number,
    read: boolean,
    type: string,
    severity: "Critical" | "High" | "Medium" | "Low",
    attacker_ip : string,
    action: "blocked" | "on-surviellance",
    description: string,
}

const securityAlertSchema = new Schema<SecurityAlert>({
    alert_id: {
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
    }
},{ timestamps: true })

const SecurityAlert = model<SecurityAlert>('security_alerts', securityAlertSchema);

export default SecurityAlert;