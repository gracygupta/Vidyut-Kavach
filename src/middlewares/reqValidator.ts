import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { IsEmailOptions } from 'express-validator/src/options';
import User from '../models/user';
import Role from '../models/roles';

// Custom validation function to check if the email already exists
const isEmailUnique = async (email:IsEmailOptions) => {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("user already exists.");
    }
  };

const isEmpIdUnique = async (empID : string) => {
    const existingUser = await User.findOne({ empID: empID });
    if (existingUser) {
      throw new Error("user already exist");
    }
};

const isCorrectRole = async (role : string) => {
    try {
        const existingRole = await Role.findById(role);
        
        if (!existingRole) {
        throw new Error("Role does not exist");
        }
    }catch(err){
        console.log(err);
    }
};

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    } else {
      next();
    }
  };
export {isEmailUnique, isEmpIdUnique, isCorrectRole, validateRequest};