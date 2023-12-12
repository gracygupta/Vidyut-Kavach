"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCorrectRole = exports.isEmpIdUnique = exports.isEmailUnique = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const roles_1 = __importDefault(require("../models/roles"));
// Custom validation function to check if the email already exists
const isEmailUnique = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_1.default.findOne({ email: email });
    if (existingUser) {
        throw new Error("User with this email address already exists.");
    }
});
exports.isEmailUnique = isEmailUnique;
const isEmpIdUnique = (empId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_1.default.findOne({ empID: empId });
    if (existingUser) {
        throw new Error("User with this employee id already exists.");
    }
});
exports.isEmpIdUnique = isEmpIdUnique;
const isCorrectRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
    const objectId = new mongoose_1.default.Types.ObjectId(role);
    const existingUser = yield roles_1.default.findById({ objectId });
    if (!existingUser) {
        throw new Error("This user role does not exist.");
    }
});
exports.isCorrectRole = isCorrectRole;
