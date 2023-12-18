import {Schema, model, Document, ObjectId} from 'mongoose';

export interface HoneypotAlertDocument extends Document{
    aleart_id: number,
    read: boolean,
    type: string,
    severity: "Critical" | "High" | "Medium" | "Low",
    attacker_ip : string,
    destination_ip: string,
    port: number,
    protocol: string,
    action: "blocked" | "on-surviellance",
    honeypot_id: string,
    honeypot_name: string,
    timestamp: Date
}

interface HoneypotAlert {
    aleart_id: number,
    read: boolean,
    type: string,
    severity: "Critical" | "High" | "Medium" | "Low",
    attacker_ip : string,
    destination_ip: string,
    port: number,
    protocol: string,
    action: "blocked" | "on-surviellance",
    honeypot_id: string,
    honeypot_name: string,
    timestamp: Date
}

const honeypotAlertSchema = new Schema<HoneypotAlert>({
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
    destination_ip: {
        type: String,
    },
    action: {
        type: String,
        enum: ["blocked", "on-surviellance"]
    },
    port:{
        type: Number,
        default: 10000,
    },
    protocol: {
        type: String,
        default: ""
    },
    honeypot_id: {
        type: String
    },
    honeypot_name: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
},{ timestamps: true })

const HoneypotAlert = model<HoneypotAlert>('honeypot_alerts', honeypotAlertSchema);

export default HoneypotAlert;