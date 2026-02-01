const User = require("../models/User");
const Admin = require("../models/Admin");

const adminMiddleware = async (req, res, next) => {
  try {
    // 🔥 JWT se role already aa raha hai
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // 🔥 OPTIONAL: Admin existence verify
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    next();
  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR 👉", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;
