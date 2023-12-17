"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const metric = express_1.default.Router();
const express_validator_1 = require("express-validator");
const reqValidator_1 = require("../middlewares/reqValidator");
const metricController_1 = require("../controllers/metricController");
metric.post("/create_metric", [
    (0, express_validator_1.body)("components", "component array is required").exists(),
], reqValidator_1.validateRequest, metricController_1.create_metric);
metric.get("/get_metric", metricController_1.get_data);
exports.default = metric;
