import express from "express";
const metric = express.Router();
import { body } from "express-validator";
import { validateRequest } from "../middlewares/reqValidator";
import {
  create_metric, get_data
} from "../controllers/metricController";

metric.post("/create_metric", [
    body("components", "component array is required").exists(),
], validateRequest, create_metric);

metric.get("/get_metric", get_data);
export default metric;
