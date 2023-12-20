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
exports.get_all_access_logs = exports.get_access_logs = exports.get_all_honeypot_logs = exports.get_all_security_logs = exports.get_honeypot_logs = exports.get_security_logs = exports.latest_24_hours = exports.add_honeypot_alert = exports.add_security_alert = void 0;
const security_alert_1 = __importDefault(require("../models/security_alert"));
const honeypot_alert_1 = __importDefault(require("../models/honeypot_alert"));
const moment_1 = __importDefault(require("moment"));
const access_logs_1 = __importDefault(require("../models/access_logs"));
const add_security_alert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { alert_id, type, severity, attacker_ip, action, description, timestamp, } = req.body;
        yield security_alert_1.default.create({
            alert_id: alert_id,
            type: type,
            severity: severity,
            attacker_ip: attacker_ip,
            action: action,
            description: description,
        })
            .then((data) => {
            if (data) {
                return res.status(200).json({
                    success: true,
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                });
            }
        })
            .catch((err) => {
            console.log(err);
            return res.status(400).json({
                success: false,
            });
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
exports.add_security_alert = add_security_alert;
const add_honeypot_alert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { alert_id, type, severity, attacker_ip, destination_ip, port, protocol, action, honeypot_id, honeypot_name, timestamp, } = req.body;
        yield honeypot_alert_1.default.create({
            alert_id: alert_id,
            type: type,
            severity: severity,
            attacker_ip: attacker_ip,
            destination_ip: destination_ip,
            port: port,
            protocol: protocol,
            action: action,
            honeypot_id: honeypot_id,
            honeypot_name: honeypot_name,
        })
            .then((data) => {
            if (data) {
                return res.status(200).json({
                    success: true,
                });
            }
            else {
                return res.status(400).json({
                    success: false,
                });
            }
        })
            .catch((err) => {
            console.log(err);
            return res.status(400).json({
                success: false,
            });
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
exports.add_honeypot_alert = add_honeypot_alert;
const latest_24_hours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const totalSecurityAlerts = yield security_alert_1.default.countDocuments({
            createdAt: { $gte: yesterday },
        });
        const totalHoneypotAlerts = yield honeypot_alert_1.default.countDocuments({
            createdAt: { $gte: yesterday },
        });
        const twentyFourHoursAgo = (0, moment_1.default)().subtract(24, "hours").toDate();
        const securityAction = yield security_alert_1.default.aggregate([
            {
                $match: {
                    action: { $in: ["blocked", "on-surviellance"] },
                    createdAt: { $gte: twentyFourHoursAgo },
                },
            },
            {
                $group: {
                    _id: "$action",
                    count: { $sum: 1 },
                },
            },
        ]);
        const honeypotAction = yield honeypot_alert_1.default.aggregate([
            {
                $match: {
                    action: { $in: ["blocked", "on-surviellance"] },
                    createdAt: { $gte: twentyFourHoursAgo },
                },
            },
            {
                $group: {
                    _id: "$action",
                    count: { $sum: 1 },
                },
            },
        ]);
        let blockedUserCount = 0;
        let surveillanceUserCount = 0;
        // Iterate through the user array and count the users based on their status
        for (const user of securityAction) {
            console.log(user);
            if (user._id == "blocked") {
                blockedUserCount += user.count;
            }
            else if (user._id == "on-surviellance") {
                surveillanceUserCount += user.count;
            }
        }
        for (const user of honeypotAction) {
            if (user._id == "blocked") {
                blockedUserCount += user.count;
            }
            else if (user._id == "on-surviellance") {
                surveillanceUserCount += user.count;
            }
        }
        return res.status(200).json({
            success: true,
            totalSecurityAlerts,
            totalHoneypotAlerts,
            blockedUserCount,
            surveillanceUserCount,
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
exports.latest_24_hours = latest_24_hours;
const get_security_logs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dateRange;
        if (req.params.logs === 'day') {
            dateRange = new Date(new Date().setDate(new Date().getDate() - 1));
        }
        else if (req.params.logs === 'week') {
            dateRange = new Date(new Date().setDate(new Date().getDate() - 7));
        }
        else if (req.params.logs === 'month') {
            dateRange = new Date(new Date().setDate(new Date().getDate() - 30));
        }
        const pipeline = [
            {
                $match: {
                    createdAt: { $gte: dateRange }
                }
            },
            {
                $group: {
                    _id: {
                        type: "$type",
                        severity: "$severity",
                        timeframe: {
                            $cond: {
                                if: { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 1))] },
                                then: "Last 24 Hours",
                                else: {
                                    $cond: {
                                        if: { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 7))] },
                                        then: "Last 7 Days",
                                        else: "Last 30 Days"
                                    }
                                }
                            }
                        }
                    },
                    totalAlerts: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAlerts: 1,
                    type: "$_id.type",
                    severity: "$_id.severity",
                    timeframe: "$_id.timeframe"
                }
            }
        ];
        const logs = yield security_alert_1.default.aggregate(pipeline);
        return res.status(200).json({
            success: true,
            logs
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
exports.get_security_logs = get_security_logs;
const get_honeypot_logs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let dateRange;
        if (req.params.logs === 'day') {
            dateRange = new Date(new Date().setDate(new Date().getDate() - 1));
        }
        else if (req.params.logs === 'week') {
            dateRange = new Date(new Date().setDate(new Date().getDate() - 7));
        }
        else if (req.params.logs === 'month') {
            dateRange = new Date(new Date().setDate(new Date().getDate() - 30));
        }
        const pipeline = [
            {
                $match: {
                    createdAt: { $gte: dateRange }
                }
            },
            {
                $group: {
                    _id: {
                        type: "$type",
                        severity: "$severity",
                        timeframe: {
                            $cond: {
                                if: { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 1))] },
                                then: "Last 24 Hours",
                                else: {
                                    $cond: {
                                        if: { $gte: ["$createdAt", new Date(new Date().setDate(new Date().getDate() - 7))] },
                                        then: "Last 7 Days",
                                        else: "Last 30 Days"
                                    }
                                }
                            }
                        }
                    },
                    totalAlerts: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAlerts: 1,
                    type: "$_id.type",
                    severity: "$_id.severity",
                    timeframe: "$_id.timeframe"
                }
            }
        ];
        const logs = yield honeypot_alert_1.default.aggregate(pipeline);
        return res.status(200).json({
            success: true,
            logs
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
exports.get_honeypot_logs = get_honeypot_logs;
const get_all_security_logs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield security_alert_1.default.find({}).sort({ createdAt: -1 }).then((data) => {
            return res.status(200).json({
                success: true,
                data,
            });
        })
            .catch((err) => {
            console.log(err);
            return res.status(400).json({
                success: true,
                message: "some error occured",
            });
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
exports.get_all_security_logs = get_all_security_logs;
const get_all_honeypot_logs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield honeypot_alert_1.default.find({}).sort({ createdAt: -1 }).then((data) => {
            return res.status(200).json({
                success: true,
                data,
            });
        })
            .catch((err) => {
            console.log(err);
            return res.status(400).json({
                success: true,
                message: "some error occured",
            });
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
exports.get_all_honeypot_logs = get_all_honeypot_logs;
const get_access_logs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTime = new Date();
        const time = (0, moment_1.default)(currentTime).subtract(24, "hours").toDate();
        const logs = yield access_logs_1.default.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: time,
                        $lte: currentTime,
                    },
                },
            },
            {
                $sort: {
                    timestamp: -1,
                },
            },
        ]);
        return res.status(200).json({
            success: true,
            logs,
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
exports.get_access_logs = get_access_logs;
const get_all_access_logs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield access_logs_1.default.find({}).sort({ timestamp: -1 });
        return res.status(200).json({
            success: true,
            logs,
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
exports.get_all_access_logs = get_all_access_logs;
