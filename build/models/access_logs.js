"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const accessLogSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const AccessLog = (0, mongoose_1.model)('access_logs', accessLogSchema);
exports.default = AccessLog;
