"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const typeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    source_type: {
        type: String,
        required: true,
        enum: ["input", "output", "storage"],
    },
}, { timestamps: true });
const Type = (0, mongoose_1.model)("types", typeSchema);
exports.default = Type;
