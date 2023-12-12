import express from 'express';
const router = express.Router();
import { body } from 'express-validator';
import {isEmailUnique, isEmpIdUnique, isCorrectRole} from '../middlewares/reqValidator';

// @route   POST /signup
// @desc    Register user and return jwt and user object
// @access  Public
router.post(
    "/signup",
    [
      body("empId", "Employee ID missing.").exists().isString().custom(isEmpIdUnique),
      body("username", "Name should be at least 5 characters.")
        .exists()
        .isString()
        .isLength({ min: 5 }),
      body("email", "Email is required.")
        .exists()
        .isEmail()
        .custom(isEmailUnique),
      body("role", "Role is not specified.").exists().isString().custom(isCorrectRole),  
      body("password", "Password should be at least 2 characters.")
        .exists()
        .isLength({ min: 6 }),
    ],
    // utilController.validateSignup,
    // authController.signUp
  );
  
  // @route   POST /signin
  // @desc    Login user and return jwt and user object
  // @access  Public
  router.post("/signin",
  [
      body("email", "Email is required.")
        .exists()
        .isEmail(),
        // .custom(utilController.isUserExist),
      body("password", "Password is required.")
        .exists()
    ],
    // utilController.validateSignin,
    // authController.signin
    );
  