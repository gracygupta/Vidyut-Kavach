"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentMetricDaily = exports.ComponentMetricHourly = exports.ComponentMetricInstant = void 0;
const mongoose_1 = require("mongoose");
const componentMetricInstantSchema = new mongoose_1.Schema({
    componentID: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        required: true,
        default: "active"
    },
    type: {
        type: String,
        enum: ["input", "output", "storage"],
        required: true
    },
    time: {
        type: Date,
    }
}, { timestamps: true });
const componentMetricSchema = new mongoose_1.Schema({
    componentID: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        required: true,
        default: "active"
    },
    type: {
        type: String,
        enum: ["input", "output", "storage"],
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    }
}, { timestamps: true });
const ComponentMetricInstant = (0, mongoose_1.model)("component_metric_instant", componentMetricInstantSchema);
exports.ComponentMetricInstant = ComponentMetricInstant;
const ComponentMetricHourly = (0, mongoose_1.model)("component_metric_hourly", componentMetricSchema);
exports.ComponentMetricHourly = ComponentMetricHourly;
const ComponentMetricDaily = (0, mongoose_1.model)("component_metric_daily", componentMetricSchema);
exports.ComponentMetricDaily = ComponentMetricDaily;
