"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const privilegeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });
const Privilege = (0, mongoose_1.model)('privileges', privilegeSchema);
exports.default = Privilege;
