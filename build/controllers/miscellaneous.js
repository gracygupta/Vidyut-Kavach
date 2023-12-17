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
exports.add_role = exports.get_privileges = exports.get_roles = exports.add_privilege = void 0;
const privileges_1 = __importDefault(require("../models/privileges"));
const roles_1 = __importDefault(require("../models/roles"));
const add_privilege = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const description = req.body.description || "";
        yield privileges_1.default.create({
            name: name,
            description: description,
        })
            .then((data) => {
            return res.status(200).json({
                success: true,
                message: "privilege created successfully",
            });
        })
            .catch((err) => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "some error occured",
            });
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.add_privilege = add_privilege;
const add_role = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.name;
        const description = req.body.description || "";
        const privileges = req.body.privileges;
        yield roles_1.default.create({
            name: name,
            description: description,
            privileges: privileges,
        })
            .then((data) => {
            return res.status(200).json({
                success: true,
                message: "role created successfully",
            });
        })
            .catch((err) => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "some error occured",
            });
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.add_role = add_role;
const get_roles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield roles_1.default.find();
        return res.status(200).json({
            success: true,
            data: data,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.get_roles = get_roles;
const get_privileges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield privileges_1.default.find();
        return res.status(200).json({
            success: true,
            data: data,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.get_privileges = get_privileges;
