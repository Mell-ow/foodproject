const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io); // Make it accessible in routes via req.app.get("io")

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (_req, res) => {
  res.json({ message: "Zan Cafe API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/reserve", reservationRoutes);
app.use("/api/payment", paymentRoutes);

// Socket Event Handlers
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-order", (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Socket ${socket.id} joined order tracking room: order-${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
}

startServer();