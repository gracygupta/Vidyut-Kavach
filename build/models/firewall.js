"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const firewallSchema = new mongoose_1.Schema({
    firewallID: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"]
    }
}, { timestamps: true });
const Firewall = (0, mongoose_1.model)('firewall', firewallSchema);
