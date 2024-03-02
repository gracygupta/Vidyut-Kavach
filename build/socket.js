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
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const metricController_1 = require("./controllers/metricController");
const server = http_1.default.createServer(app_1.default);
let io;
// Initialize Socket.IO server with CORS options
const socketServerOptions = {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: [
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers",
        ],
    },
};
// Create Socket.IO server
io = new socket_io_1.Server(server, socketServerOptions);
// Event listener for new connections
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
    socket.on("create_metric", (data) => {
        console.log(data);
        //call create metric
        (0, metricController_1.create_metric_socket)(data);
    });
});
// Route for root endpoint
app_1.default.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        message: "Connected to the Server",
    });
}));
// Middleware for handling 404 errors
app_1.default.use((req, res, next) => {
    return res.status(404).json({ message: "404 Not Found" });
});
const PORT = process.env.PORT || 5000;
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = io;
