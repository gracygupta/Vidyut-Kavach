import express from "express";
const admin = express.Router();
import { body } from "express-validator";
import {
  isEmailUnique,
  isEmpIdUnique,
  isCorrectRole,
  validateRequest,
} from "../middlewares/reqValidator";
import { signUp, verifyCredentials } from "../controllers/user_auth";
import { add_privilege, get_privileges, get_roles, add_role } from "../controllers/miscellaneous";

// @route   POST /get_privileges
// @desc    get all privileges
// @access  Public
admin.get("/get_privileges", get_privileges);

// @route   POST /add_privilege
// @desc    add privileges for roles
// @access  Admin
admin.post(
  "/add_privilege",
  [
    body("name", "name is required").exists().isString()
  ],
  validateRequest,
  add_privilege
);

// @route   POST /add_role
// @desc    add user role and privileges
// @access  Admin
admin.post("/add_role", [
    body("name", "name of role is required").exists(),
    body("privileges", "select privileges").exists().isArray()
 ],
 validateRequest,
 add_role
 );

// @route   POST /get_role
// @desc    get all roles
// @access  Public
admin.get("/get_roles", get_roles);


// @route   POST /signup
// @desc    Register user
// @access  Admin
admin.post(
  "/signup",
  [
    body("empID", "Employee ID missing.")
      .exists()
      .isString()
      .custom(isEmpIdUnique),
    body("username", "Name should be at least 5 characters.")
      .exists()
      .isString()
      .isLength({ min: 5 }),
    body("email", "Email is required.")
      .exists()
      .isEmail()
      .custom(isEmailUnique),
    body("role", "Role is not specified.")
      .exists()
      .isString(),
    body("password", "Password should be at least 2 characters.")
      .exists()
      .isLength({ min: 6 }),
  ],
  validateRequest,
  signUp
);

export default admin;
