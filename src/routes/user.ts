import express from "express";
const user = express.Router();
import { body } from "express-validator";
import { validateRequest } from "../middlewares/reqValidator";
import { verifyCredentials, verifyOtp } from "../controllers/user_auth";
import { sendOTP } from "../controllers/emailController";

// @route   POST /signin
// @desc    login user and return jwt
// @access  Public
user.post(
  "/signin",
  [
    body("empID", "employee ID required").exists().isString(),
    body("password", "password is required").exists().isString(),
  ],
  validateRequest,
  verifyCredentials,
  sendOTP
);

// @route   POST /verify_otp
// @desc    verify otp
// @access  Public
user.post("/verify_otp", [
    body("empID","employee ID is required").exists(),
    body("otp","otp required").exists().isNumeric()
], verifyOtp);

export default user;