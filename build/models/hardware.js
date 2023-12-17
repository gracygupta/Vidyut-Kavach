"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hardwareSchema = new mongoose_1.Schema({
    hardwareID: {
        type: String,
        unique: true
    },
    componentID: {
        type: String,
        ref: "components",
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Battery", "Solar Panel", "Wind Turbine", "Diesel Generator", "Inverter"],
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    manufacture_date: {
        type: Date,
        required: true,
    },
    modelID: {
        type: String,
        ref: "models",
    },
    installation_date: {
        type: Date,
        required: true,
    },
    installed_version: {
        type: String,
        required: true,
        default: "",
    },
    properties: {
        type: Map, // Using Map to store key-value pairs
        of: mongoose_1.Schema.Types.Mixed, // Mixed type to allow any data type
        default: {},
    },
}, { timestamps: true });
const Hardware = (0, mongoose_1.model)("hardwares", hardwareSchema);
exports.default = Hardware;
