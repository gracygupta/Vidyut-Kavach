"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conn_1 = __importDefault(require("./db/conn"));
const body_parser_1 = require("body-parser");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./routes/router"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
(0, conn_1.default)();
//rate limiter
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 2500, // limit each IP to 4 requests per windowMs
});
//app.use(limiter);
//Cors Policy
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.get("/", (req, res) => {
    return res.status(200).json({ message: "connected to server" });
});
app.use("/", router_1.default);
// console.log(`${new Date(new Date().setDate(new Date().getDate() - 30))}`);
exports.default = app;
