"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const securityAlertSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const SecurityAlert = (0, mongoose_1.model)('security_alerts', securityAlertSchema);
exports.default = SecurityAlert;
