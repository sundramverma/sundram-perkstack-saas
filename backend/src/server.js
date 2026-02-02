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

/* ================= DATABASE ================= */
connectDB();

/* ================= CORS (FINAL FIX) ================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local frontend
      "https://sundram-perkstack-saas.vercel.app", // vercel frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= ROUTES ================= */

// 🔓 PUBLIC ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/deals", dealRoutes);

// 🔐 USER ROUTES
app.use("/api/claim", claimRoutes);
app.use("/api/user-deals", userDealRoutes);

// 🔐 ADMIN ROUTES
app.use("/api/admin", adminRoutes);

// 🔐 PROTECTED ROUTES (KEEP LAST)
app.use("/api", protectedRoutes);

/* ================= TEST ================= */
app.get("/", (req, res) => {
  res.status(200).send("🚀 PerkStack API running");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
