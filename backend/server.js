require("dotenv").config();
require("./cron/reminderCron");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
connectDB();

const app = express();
const server = http.createServer(app);

// Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://healthcare-ashy-nu.vercel.app",
];

// Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    if (userId) {
      socket.join(userId.toString());
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket Disconnected:", socket.id);
  });
});

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Postman ya server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// No Cache
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "SwasthSetu Backend",
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 SwasthSetu Backend Running on Port ${PORT}`);
});