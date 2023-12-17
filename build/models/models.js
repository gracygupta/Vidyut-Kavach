"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const modelSchema = new mongoose_1.Schema({
    modelID: {
        type: String,
        required: true,
        unique: true
    },
    company_name: {
        type: String,
        required: true,
    },
    model_name: {
        type: String,
    },
    latest_version: {
        type: String,
    },
}, { timestamps: true });
const Model = (0, mongoose_1.model)("models", modelSchema);
exports.default = Model;
