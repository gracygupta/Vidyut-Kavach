"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hardwareSchema = new mongoose_1.Schema({
    hardwareID: {
        type: String,
        required: true
    },
    manufacture_date: {
        type: Date,
        required: true
    },
    modelID: {
        type: String,
        ref: 'models',
    },
    installed_version: {
        type: String,
        required: true,
        default: ""
    }
}, { timestamps: true });
const Hardware = (0, mongoose_1.model)('hardware', hardwareSchema);
exports.default = Hardware;
