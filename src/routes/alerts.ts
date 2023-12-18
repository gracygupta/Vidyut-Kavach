import express from "express";
const alert = express.Router();
import { body } from "express-validator";
import {
  add_honeypot_alert,
  add_security_alert,
  latest_24_hours,
  get_security_logs,
  get_honeypot_logs,
  get_all_honeypot_logs,
  get_all_security_logs
} from "../controllers/alertControllers";
import { validateRequest } from "../middlewares/reqValidator";

alert.post(
  "/add_security_alert",
  [
    body("type", "security type is required").exists(),
    body("severity", "severity is required").exists(),
    body("attacker_ip", "attacker_ip is required").exists(),
    body("action", "action is required").exists(),
    body("description", "description is required").exists(),
    body("timestamp", "timestamp is required").exists(),
  ],
  validateRequest,
  add_security_alert
);

alert.post(
  "/add_honeypot_alert",
  [
    body("type", "security type is required").exists(),
    body("severity", "severity is required").exists(),
    body("attacker_ip", "attacker_ip is required").exists(),
    body("destination_ip", "destination_ip is required").exists(),
    body("port", "port is required").exists().isNumeric(),
    body("protocol", "protocol is required").exists(),
    body("action", "action is required").exists(),
    body("honeypot_id", "honeypot_id is required").exists(),
    body("honeypot_name", "honeypot_name is required").exists(),
    body("timestamp", "timestamp is required").exists(),
  ],
  validateRequest,
  add_honeypot_alert
);

alert.get("/latest_24_hours", latest_24_hours);
alert.get("/get_security_logs/:log", get_security_logs);
alert.get("/get_honeypot_logs/:log", get_honeypot_logs);
alert.get("//get_security_logs", get_all_security_logs);
alert.get("/get_honeypot_logs", get_all_honeypot_logs);

export default alert;
