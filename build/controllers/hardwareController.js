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
exports.get_hardware_details = exports.mark_updates = exports.get_updates = exports.get_models = exports.update_model = exports.add_model = exports.get_hardwares = exports.add_hardware = void 0;
const hardware_1 = __importDefault(require("../models/hardware"));
const hardware_updates_1 = __importDefault(require("../models/hardware_updates"));
const models_1 = __importDefault(require("../models/models"));
const components_1 = __importDefault(require("../models/components"));
const add_hardware = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hardwareID, componentID, name, type, manufacturer, manufacture_date, modelID, installation_date, installed_version, properties, } = req.body;
        // Check if the hardwareID already exists
        const existingHardware = yield hardware_1.default.findOne({ hardwareID });
        if (existingHardware) {
            return res.status(400).json({
                success: false,
                message: "hardware already exists",
            });
        }
        // Check if the modelID exists
        const existingModel = yield models_1.default.findOne({ modelID });
        if (!existingModel) {
            return res.status(400).json({
                success: false,
                message: "model does not exist",
            });
        }
        // Check if the componentID exists
        const existingComponent = yield components_1.default.findOne({ componentID });
        if (!existingComponent) {
            return res.status(400).json({
                success: false,
                message: "Component does not exist",
            });
        }
        // Create the hardware
        const newHardware = yield hardware_1.default.create({
            hardwareID,
            componentID,
            name,
            type,
            manufacturer,
            manufacture_date,
            modelID,
            installation_date,
            installed_version,
            properties,
        });
        return res.status(200).json({
            success: true,
            message: "hardware added successfully",
            data: newHardware,
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
exports.add_hardware = add_hardware;
const get_hardwares = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield hardware_1.default.find();
        if (data.length != 0) {
            res.status(200).json({
                success: true,
                data: data,
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: "no updates",
                data: []
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.get_hardwares = get_hardwares;
const add_model = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { modelID, model_name, company_name, latest_version } = req.body;
        yield models_1.default.find({ modelID: modelID }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (data.length != 0)
                return res.status(400).json({
                    success: false,
                    message: "model already exist",
                });
            else {
                yield models_1.default.create({
                    modelID,
                    company_name,
                    model_name,
                    latest_version,
                })
                    .then((data) => {
                    return res.status(200).json({
                        success: true,
                        message: "model created successfully",
                        data: data !== null && data !== void 0 ? data : {},
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
        }));
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.add_model = add_model;
const update_model = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { company_name, model_name, latest_version } = req.body;
        console.log(req.body);
        const existingModel = yield models_1.default.findOne({ $or: [{ model_name: model_name }, { company_name: company_name }] });
        console.log(existingModel);
        if (!existingModel) {
            return res.status(400).json({
                success: false,
                message: "Model not found",
            });
        }
        existingModel.latest_version = latest_version;
        yield existingModel.save();
        console.log(existingModel.modelID);
        const hardwares = yield hardware_1.default.find({
            modelID: existingModel.modelID,
            installed_version: { $ne: latest_version },
        });
        console.log(hardwares);
        for (let i = 0; i < hardwares.length; i++) {
            yield hardware_updates_1.default.create({
                modelID: existingModel.modelID,
                hardwareID: hardwares[i].hardwareID,
                latest_version: latest_version,
                installed_version: hardwares[i].installed_version,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Model updated successfully",
            data: existingModel !== null && existingModel !== void 0 ? existingModel : {},
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
exports.update_model = update_model;
const get_models = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.default.find();
        if (data.length != 0) {
            res.status(200).json({
                success: true,
                data: data,
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: "no updates",
                data: []
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.get_models = get_models;
const get_updates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completedUpdates = yield hardware_updates_1.default.aggregate([
            {
                $match: {
                    status: "yes"
                }
            },
            {
                $lookup: {
                    from: "hardwares",
                    localField: "hardwareID",
                    foreignField: "hardwareID",
                    as: "hardwareDetails"
                }
            },
            {
                $unwind: "$hardwareDetails"
            },
            {
                $sort: {
                    "hardwareDetails.installed_version": -1
                }
            },
            {
                $group: {
                    _id: "$hardwareID",
                    hardwareName: { $first: "$hardwareDetails.name" },
                    updatedAt: { $first: "$hardwareDetails.installation_date" },
                    installed_version: { $first: "$hardwareDetails.installed_version" }
                }
            },
            {
                $project: {
                    _id: 0,
                    hardwareName: 1,
                    updatedAt: 1,
                    installed_version: 1
                }
            }
        ]);
        console.log(completedUpdates);
        const pendingUpdates = yield hardware_updates_1.default.aggregate([
            {
                $match: {
                    status: "no"
                }
            },
            {
                $lookup: {
                    from: "hardwares",
                    localField: "hardwareID",
                    foreignField: "hardwareID",
                    as: "hardwareDetails"
                }
            },
            {
                $unwind: "$hardwareDetails"
            },
            {
                $project: {
                    _id: 0,
                    hardwareID: "$hardwareDetails.hardwareID",
                    releaseDate: "$createdAt",
                    hardwareName: "$hardwareDetails.name",
                    installed_version: "$hardwareDetails.installed_version",
                    latest_version: 1
                }
            }
        ]);
        console.log(pendingUpdates);
        return res.status(200).json({
            succes: true,
            completedUpdates,
            pendingUpdates
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
exports.get_updates = get_updates;
const mark_updates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hardwareID } = req.body;
        const existingHardware = yield hardware_1.default.findOne({ hardwareID: hardwareID });
        if (!existingHardware) {
            return res.status(400).json({
                success: false,
                message: "hardware does not exist",
            });
        }
        // Update the hardware
        const markedHardware = yield hardware_updates_1.default.findOneAndUpdate({ hardwareID: hardwareID }, { status: "yes" });
        const cur = new Date();
        console.log(cur);
        const updatedHardware = yield hardware_1.default.findOneAndUpdate({ hardwareID: hardwareID }, {
            $set: {
                installed_version: markedHardware === null || markedHardware === void 0 ? void 0 : markedHardware.latest_version,
                installation_date: cur
            }
        }, { new: true });
        res.status(200).json({
            success: true,
            message: "Hardware update marked done",
            data: updatedHardware !== null && updatedHardware !== void 0 ? updatedHardware : {},
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.mark_updates = mark_updates;
const get_hardware_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counts = yield hardware_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalHardware: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "hardware_updates",
                    localField: "_id",
                    foreignField: "hardwareId",
                    as: "updates"
                }
            },
            {
                $unwind: "$updates"
            },
            {
                $match: {
                    "updates.status": "no"
                }
            },
            {
                $group: {
                    _id: null,
                    pendingUpdate: { $sum: 1 },
                    totalHardware: { $first: "$totalHardware" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalHardware: 1,
                    pendingUpdate: 1,
                    patchedDevices: { $subtract: ["$totalHardware", "$pendingUpdate"] }
                }
            }
        ]);
        console.log(counts);
        const hardwareData = yield hardware_1.default.aggregate([
            {
                $lookup: {
                    from: "hardware_updates",
                    localField: "hardwareID",
                    foreignField: "hardwareID",
                    as: "updates"
                }
            },
            {
                $unwind: "$updates" // Unwind the updates array
            },
            {
                $group: {
                    _id: "$type",
                    hardwareIds: { $push: "$hardwareID" }, // Collect hardware IDs in each group
                    totalHardware: { $sum: 1 }, // Count the total hardware in each category type
                    hardwareToUpdate: {
                        $sum: {
                            $cond: [
                                { $eq: ["$updates.status", "no"] }, // Check if status is "no"
                                1, // If status is "no", count as 1
                                0 // If not, count as 0
                            ]
                        }
                    } // Count hardware to be updated with status "no"
                }
            },
            {
                $project: {
                    _id: 1, // Include _id (type)
                    hardwareIds: 1, // Include hardwareIds
                    totalHardware: 1, // Include totalHardware
                    hardwareToUpdate: 1, // Include hardwareToUpdate
                    patchedDevices: { $subtract: ["$totalHardware", "$hardwareToUpdate"] } // Calculate patched devices
                }
            }
        ]);
        console.log(hardwareData);
        return res.status(200).json({
            success: true,
            counts,
            hardwareData
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
exports.get_hardware_details = get_hardware_details;
