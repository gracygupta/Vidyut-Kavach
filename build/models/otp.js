"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    otp: {
        type: Number,
        required: true
    },
    empID: {
        type: String,
        required: true
    },
    otpExpiresAt: {
        type: Date
    }
}, { timestamps: true });
const Otp = (0, mongoose_1.model)('otp', otpSchema);
exports.default = Otp;
