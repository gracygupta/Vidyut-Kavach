"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hardwareUpdateSchema = new mongoose_1.Schema({
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
        enum: ['yes', 'no'],
        default: 'no'
    }
}, { timestamps: true });
const HardwareUpdate = (0, mongoose_1.model)('hardware_updates', hardwareUpdateSchema);
exports.default = HardwareUpdate;
