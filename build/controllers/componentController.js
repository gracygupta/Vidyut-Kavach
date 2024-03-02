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
exports.getActiveComponents = exports.add_nanogrid_component = exports.add_nanogrid = exports.add_type = exports.add_component = void 0;
const components_1 = __importDefault(require("../models/components"));
const nanogrids_1 = __importDefault(require("../models/nanogrids"));
const types_1 = __importDefault(require("../models/types"));
const add_component = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { componentID, name, type, latitude, longitude, capacity, properties } = req.body;
        componentID = componentID.toUpperCase();
        const existingComponent = yield components_1.default.findOne({
            $or: [{ componentID: componentID }, { name: name }],
        });
        if (existingComponent) {
            return res.status(400).json({
                success: false,
                message: "component already exists",
            });
        }
        type = type.toLowerCase();
        const typeid = yield types_1.default.findOne({ name: type });
        const data = yield components_1.default.create({
            componentID: componentID,
            name: name,
            type: typeid === null || typeid === void 0 ? void 0 : typeid._id,
            latitude: latitude,
            longitude: longitude,
            capacity: capacity,
            properties: properties,
        });
        res.status(200).json({
            success: true,
            message: "component added successfully",
            data: data !== null && data !== void 0 ? data : {},
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.add_component = add_component;
const add_type = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, source_type } = req.body;
        const data = yield types_1.default.create({
            name: name.toLowerCase(),
            source_type: source_type,
        });
        return res.status(200).json({
            success: true,
            message: "type added successfully",
            data: data,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.add_type = add_type;
const add_nanogrid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nanogridID, name, components } = req.body;
        const existingNanogrid = yield nanogrids_1.default.findOne({
            $or: [{ nanogridID: nanogridID }, { name: name }],
        });
        if (existingNanogrid) {
            return res.status(400).json({
                success: false,
                message: "nanogrid already exists",
            });
        }
        const data = yield nanogrids_1.default.create({
            nanogridID: nanogridID,
            name: name,
            components: components,
        });
        return res.status(200).json({
            success: true,
            message: "nanogrid added successfully",
            data: data,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.add_nanogrid = add_nanogrid;
const add_nanogrid_component = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, components } = req.body;
        const existingNanogrid = yield nanogrids_1.default.findOne({ name: name });
        if (!existingNanogrid) {
            return res.status(404).json({
                success: false,
                message: "Nanogrid not found",
            });
        }
        const updatedComponents = [...components, ...existingNanogrid.components];
        existingNanogrid.components = updatedComponents;
        const updatedNanogrid = yield existingNanogrid.save();
        return res.status(200).json({
            success: true,
            message: "Component added successfully",
            data: updatedNanogrid,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.add_nanogrid_component = add_nanogrid_component;
const getActiveComponents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const pipeline = [
            {
                $lookup: {
                    from: "types",
                    localField: "type",
                    foreignField: "_id",
                    as: "typeInfo",
                },
            },
            {
                $unwind: "$typeInfo",
            },
            {
                $match: {
                    "typeInfo.source_type": type,
                },
            },
            {
                $project: {
                    componentID: 1,
                    name: 1,
                    latitude: 1,
                    longitude: 1,
                    capacity: 1,
                    properties: 1,
                    type: "$typeInfo.name",
                },
            },
        ];
        const result = yield components_1.default.aggregate(pipeline);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) { }
});
exports.getActiveComponents = getActiveComponents;
