import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import { IsEmailOptions } from 'express-validator/src/options';
import User from '../models/user';
import Role from '../models/roles';

// Custom validation function to check if the email already exists
const isEmailUnique = async (email:IsEmailOptions) => {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("User with this email address already exists.");
    }
  };

const isEmpIdUnique = async (empId : string) => {
    const existingUser = await User.findOne({ empID: empId });
    if (existingUser) {
      throw new Error("User with this employee id already exists.");
    }
};
const isCorrectRole = async (role : string) => {
    const objectId = new mongoose.Types.ObjectId(role);
    const existingUser = await Role.findById({ objectId });
    if (!existingUser) {
      throw new Error("This user role does not exist.");
    }
};
export {isEmailUnique, isEmpIdUnique, isCorrectRole};