"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const componentSchema = new mongoose_1.Schema({
    componentID: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        reuired: true,
    },
    type: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    capacity: {
        type: Number,
    },
    properties: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
}, { timestamps: true });
const Component = (0, mongoose_1.model)("components", componentSchema);
exports.default = Component;
