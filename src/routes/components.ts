import express from "express";
const component = express.Router();
import { body } from "express-validator";
import { validateRequest } from "../middlewares/reqValidator";
import {
  add_component,
  add_nanogrid,
  add_nanogrid_component,
  add_type,
} from "../controllers/componentController";
import {checkToken, check_admin} from "../middlewares/check_role";

component.post(
  "/add_component",
  // checkToken, check_admin,
  [
    body("componentID", "component id is required").exists(),
    body("name", "name is required").exists(),
    body("type", "type is required").exists(),
    body("latitude", "location's latitude is required").exists(),
    body("longitude", "location's longitude is required").exists(),
    body("capacity", "capacity is required").exists(),
  ],
  validateRequest,
  add_component
);

component.post(
  "/add_type",
  // checkToken, check_admin,
  [
    body("name", "type name is required").exists(),
    body("source_type", "source_type is required").exists(),
  ],
  validateRequest,
  add_type
);

component.post(
  "/add_nanogrid",
  // checkToken, check_admin,
  [
    body("nanogridID", "nanogrid id is required").exists(),
    body("name", "name is required").exists(),
    body("components", "array of components is required").exists().isArray(),
  ],
  validateRequest,
  add_nanogrid
);

component.post(
  "/add_nanogrid_component",
  // checkToken, check_admin,
  [
    body("name", "nanogrid name is required").exists(),
    body("components", "array of components is required").exists().isArray(),
  ],
  validateRequest,
  add_nanogrid_component
);

export default component;
