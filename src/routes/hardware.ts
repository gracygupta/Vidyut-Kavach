import express from "express";
const hardware = express.Router();
import { body } from "express-validator";
import { validateRequest } from "../middlewares/reqValidator";
import {
  add_hardware,
  add_model,
  get_hardwares,
  get_models,
  update_model,
  get_updates,
  mark_updates,
  get_hardware_details
} from "../controllers/hardwareController";

hardware.post(
  "/add_hardware",
  [
    body("hardwareID", "hardware id is required").exists(),
    body("componentID", "component id is required").exists(),
    body("name", "name is required").exists(),
    body("type", "name is required").exists(),
    body("manufacturer", "manufacturer is required").exists(),
    body("manufacture_date", "manufacture_date is required").exists(),
    body("modelID", "model id is required").exists(),
    body("installation_date", "installation_date is required").exists(),
    body("installed_version", "installed_version is required").exists(),
  ],
  validateRequest,
  add_hardware
);

hardware.get("/get_all_hardwares", get_hardwares);

hardware.post(
  "/add_model",
  [
    body("modelID", "model id is required").exists().isString(),
    body("company_name", "company name is required").exists().isString(),
    body("model_name", "model name is required").exists().isString(),
    body("latest_version", "latest version is required").exists().isString(),
  ],
  validateRequest,
  add_model
);

hardware.post(
  "/update_model",
  [
    body("company_name", "company name is required").exists().isString(),
    body("model_name", "model name is required").exists().isString(),
    body("latest_version", "latest version is required").exists().isString(),
  ],
  validateRequest,
  update_model
);

hardware.get("/get_all_models", get_models);

hardware.get("/get_updates", get_updates);

hardware.post(
  "/mark_updates",
  [body("hardwareID", "hardware id is required").exists()],
  validateRequest,
  mark_updates
);

hardware.get("/get_hardware_details", get_hardware_details)
export default hardware;
