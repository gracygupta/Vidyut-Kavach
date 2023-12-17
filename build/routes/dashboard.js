"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard = express_1.default.Router();
const dashboard_1 = require("../controllers/dashboard");
dashboard.get("/get_utility_status", dashboard_1.get_utility_grid_status);
dashboard.get("/get_grid_status", dashboard_1.get_grid_status);
dashboard.get("/get_weekly_data", dashboard_1.get_weekly_data);
dashboard.get("/active_count", dashboard_1.active_counts);
dashboard.get("/get_dashboard", dashboard_1.get_dashboard);
exports.default = dashboard;
