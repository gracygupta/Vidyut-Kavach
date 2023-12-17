import express from "express";
const dashboard = express.Router();
import { body } from "express-validator";
import { validateRequest } from "../middlewares/reqValidator";
import { get_utility_grid_status, get_grid_status, get_weekly_data, active_counts, get_dashboard } from "../controllers/dashboard";

dashboard.get("/get_utility_status", get_utility_grid_status);
dashboard.get("/get_grid_status", get_grid_status);
dashboard.get("/get_weekly_data", get_weekly_data);
dashboard.get("/active_count", active_counts);
dashboard.get("/get_dashboard", get_dashboard);

export default dashboard;