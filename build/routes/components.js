"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const component = express_1.default.Router();
const express_validator_1 = require("express-validator");
const reqValidator_1 = require("../middlewares/reqValidator");
const componentController_1 = require("../controllers/componentController");
const check_role_1 = require("../middlewares/check_role");
component.post("/add_component", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("componentID", "component id is required").exists(),
    (0, express_validator_1.body)("name", "name is required").exists(),
    (0, express_validator_1.body)("type", "type is required").exists(),
    (0, express_validator_1.body)("latitude", "location's latitude is required").exists(),
    (0, express_validator_1.body)("longitude", "location's longitude is required").exists(),
    (0, express_validator_1.body)("capacity", "capacity is required").exists(),
], reqValidator_1.validateRequest, componentController_1.add_component);
component.post("/add_type", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("name", "type name is required").exists(),
    (0, express_validator_1.body)("source_type", "source_type is required").exists(),
], reqValidator_1.validateRequest, componentController_1.add_type);
component.post("/add_nanogrid", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("nanogridID", "nanogrid id is required").exists(),
    (0, express_validator_1.body)("name", "name is required").exists(),
    (0, express_validator_1.body)("components", "array of components is required").exists().isArray(),
], reqValidator_1.validateRequest, componentController_1.add_nanogrid);
component.post("/add_nanogrid_component", check_role_1.checkToken, check_role_1.check_admin, [
    (0, express_validator_1.body)("name", "nanogrid name is required").exists(),
    (0, express_validator_1.body)("components", "array of components is required").exists().isArray(),
], reqValidator_1.validateRequest, componentController_1.add_nanogrid_component);
exports.default = component;
