import http from "http";
import app from "./app";
import { Server as SocketServer } from "socket.io";
import { create_metric_socket } from "./controllers/metricController";

const server = http.createServer(app);
let io: SocketServer;

// Type definition for CORS options
interface CorsOptions {
  origin: string;
  methods: string[];
  allowedHeaders: string[];
}

// Type definition for SocketServerOptions
interface SocketServerOptions {
  cors: CorsOptions;
}

// Initialize Socket.IO server with CORS options
const socketServerOptions: SocketServerOptions = {
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
io = new SocketServer(server, socketServerOptions);

// Event listener for new connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("create_metric", (data) => {
    console.log(data);
    //call create metric
    create_metric_socket(data);
  });
});

// Route for root endpoint
app.get("/", async (req, res) => {
  res.json({
    message: "Connected to the Server",
  });
});

// Middleware for handling 404 errors
app.use((req, res, next) => {
  return res.status(404).json({ message: "404 Not Found" });
});

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default io;
