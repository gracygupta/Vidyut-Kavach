"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const alert = express_1.default.Router();
const express_validator_1 = require("express-validator");
const alertControllers_1 = require("../controllers/alertControllers");
const reqValidator_1 = require("../middlewares/reqValidator");
alert.post("/add_security_alert", [
    (0, express_validator_1.body)("alert_id", "alert id is required").exists(),
    (0, express_validator_1.body)("type", "security type is required").exists(),
    (0, express_validator_1.body)("severity", "severity is required").exists(),
    (0, express_validator_1.body)("attacker_ip", "attacker_ip is required").exists(),
    (0, express_validator_1.body)("action", "action is required").exists(),
    (0, express_validator_1.body)("description", "description is required").exists()
], reqValidator_1.validateRequest, alertControllers_1.add_security_alert);
alert.post("/add_honeypot_alert", [
    (0, express_validator_1.body)("type", "security type is required").exists(),
    (0, express_validator_1.body)("severity", "severity is required").exists(),
    (0, express_validator_1.body)("attacker_ip", "attacker_ip is required").exists(),
    (0, express_validator_1.body)("destination_ip", "destination_ip is required").exists(),
    (0, express_validator_1.body)("port", "port is required").exists().isNumeric(),
    (0, express_validator_1.body)("protocol", "protocol is required").exists(),
    (0, express_validator_1.body)("action", "action is required").exists(),
    (0, express_validator_1.body)("honeypot_id", "honeypot_id is required").exists(),
    (0, express_validator_1.body)("honeypot_name", "honeypot_name is required").exists()
], reqValidator_1.validateRequest, alertControllers_1.add_honeypot_alert);
alert.get("/latest_24_hours", alertControllers_1.latest_24_hours);
alert.get("/get_security_logs/:logs", alertControllers_1.get_security_logs);
alert.get("/get_honeypot_logs/:logs", alertControllers_1.get_honeypot_logs);
alert.get("/get_security_logs", alertControllers_1.get_all_security_logs);
alert.get("/get_honeypot_logs", alertControllers_1.get_all_honeypot_logs);
alert.get("/get_access_logs", alertControllers_1.get_access_logs);
exports.default = alert;
