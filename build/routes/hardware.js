"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hardware = express_1.default.Router();
const express_validator_1 = require("express-validator");
const reqValidator_1 = require("../middlewares/reqValidator");
const hardwareController_1 = require("../controllers/hardwareController");
const check_role_1 = require("../middlewares/check_role");
hardware.post("/add_hardware", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("hardwareID", "hardware id is required").exists(),
    (0, express_validator_1.body)("componentID", "component id is required").exists(),
    (0, express_validator_1.body)("name", "name is required").exists(),
    (0, express_validator_1.body)("type", "name is required").exists(),
    (0, express_validator_1.body)("manufacturer", "manufacturer is required").exists(),
    (0, express_validator_1.body)("manufacture_date", "manufacture_date is required").exists(),
    (0, express_validator_1.body)("modelID", "model id is required").exists(),
    (0, express_validator_1.body)("installation_date", "installation_date is required").exists(),
    (0, express_validator_1.body)("installed_version", "installed_version is required").exists(),
], reqValidator_1.validateRequest, hardwareController_1.add_hardware);
hardware.get("/get_all_hardwares", hardwareController_1.get_hardwares);
hardware.post("/add_model", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("modelID", "model id is required").exists().isString(),
    (0, express_validator_1.body)("company_name", "company name is required").exists().isString(),
    (0, express_validator_1.body)("model_name", "model name is required").exists().isString(),
    (0, express_validator_1.body)("latest_version", "latest version is required").exists().isString(),
], reqValidator_1.validateRequest, hardwareController_1.add_model);
hardware.post("/update_model", check_role_1.checkToken, check_role_1.check_maintenance_technical, [
    (0, express_validator_1.body)("company_name", "company name is required").exists().isString(),
    (0, express_validator_1.body)("model_name", "model name is required").exists().isString(),
    (0, express_validator_1.body)("latest_version", "latest version is required").exists().isString(),
], reqValidator_1.validateRequest, hardwareController_1.update_model);
hardware.get("/get_all_models", hardwareController_1.get_models);
hardware.get("/get_updates", hardwareController_1.get_updates);
hardware.post("/mark_updates", check_role_1.checkToken, check_role_1.check_maintenance_technical, [(0, express_validator_1.body)("hardwareID", "hardware id is required").exists()], reqValidator_1.validateRequest, hardwareController_1.mark_updates);
hardware.get("/get_hardware_details", hardwareController_1.get_hardware_details);
exports.default = hardware;
