"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import {router} from "./router/routes";
const conn_1 = __importDefault(require("./db/conn"));
const body_parser_1 = require("body-parser");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
(0, conn_1.default)();
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.get("/", (req, res) => {
    return res.json({ "message": "connected to server" });
});
// app.use("/",router);
app.listen(PORT, () => {
    console.log(`Server is up at port ${PORT}`);
});
