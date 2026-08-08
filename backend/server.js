require('dotenv').config();
require("./cron/reminderCron");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const connectDB = require("./config/db");
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io initialization with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// App instance me io store karein taaki controllers me req.app.get("io") se access ho sake
app.set("io", io);

// Room joins ke liye connection handler
io.on("connection", (socket) => {
  // User apne specific ID waale room me join karega
  socket.on("joinUserRoom", (userId) => {
    if (userId) {
      socket.join(userId.toString());
    }
  });

  socket.on("disconnect", () => {});
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "swasthsetu-backend" })
);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

console.log(process.env.MONGO_URI);

const PORT = Number(process.env.PORT || 5002);

const startServer = (portToTry, attempts = 0) => {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = portToTry + 1;
      if (attempts < 10) {
        console.warn(`Port ${portToTry} is busy. Retrying on ${nextPort}...`);
        startServer(nextPort, attempts + 1);
        return;
      }

      console.error(`No free port found after trying ${portToTry}.`);
      process.exit(1);
    } else {
      console.error("Server error:", error);
      process.exit(1);
    }
  });

  server.listen(portToTry, () => {
    console.log(`SwasthSetu backend with WebSockets running on port ${portToTry}`);
  });
};

startServer(PORT);