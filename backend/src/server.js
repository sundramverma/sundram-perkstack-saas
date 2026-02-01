const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const dealRoutes = require("./routes/deal.routes");
const claimRoutes = require("./routes/claim.routes");
const userDealRoutes = require("./routes/userDeal.routes");
const adminRoutes = require("./routes/admin.routes");
const protectedRoutes = require("./routes/protected.routes");

require("dotenv").config();

const app = express();

// 🔥 MongoDB CONNECT
connectDB();

// 🔥 CORS (FINAL FIX)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 🔥 JSON middleware
app.use(express.json());

// ================= ROUTES ORDER (VERY IMPORTANT) =================

// 🔓 PUBLIC ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/deals", dealRoutes);

// 🔐 USER ACTION ROUTES
app.use("/api/claim", claimRoutes);
app.use("/api/user-deals", userDealRoutes);

// 🔐 ADMIN ROUTES (BEFORE GENERIC PROTECTED)
app.use("/api/admin", adminRoutes);

// 🔐 GENERIC PROTECTED ROUTES (LAST)
app.use("/api", protectedRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("PerkStack API running");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
