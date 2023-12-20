"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IDSSchema = new mongoose_1.Schema({
    idsID: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"]
    }
}, { timestamps: true });
const IDS = (0, mongoose_1.model)('ids_status', IDSSchema);
exports.default = IDS;
