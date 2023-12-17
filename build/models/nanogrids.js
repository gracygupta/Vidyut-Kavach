"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nanogridSchema = new mongoose_1.Schema({
    nanogridID: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        reuired: true,
        unique: true
    },
    components: {
        type: [{ type: String }],
        default: [],
    },
}, { timestamps: true });
const Nanogrid = (0, mongoose_1.model)("nanogrids", nanogridSchema);
exports.default = Nanogrid;
