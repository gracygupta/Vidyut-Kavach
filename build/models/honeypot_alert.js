"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const honeypotAlertSchema = new mongoose_1.Schema({
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
    destination_ip: {
        type: String,
    },
    action: {
        type: String,
        enum: ["blocked", "on-surviellance"]
    },
    port: {
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
}, { timestamps: true });
const HoneypotAlert = (0, mongoose_1.model)('honeypot_alerts', honeypotAlertSchema);
exports.default = HoneypotAlert;
