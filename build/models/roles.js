"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    privileges: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'privileges',
        },
    ]
}, { timestamps: true });
const Role = (0, mongoose_1.model)('role', roleSchema);
exports.default = Role;
