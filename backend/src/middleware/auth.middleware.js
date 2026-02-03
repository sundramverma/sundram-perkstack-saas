const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔐 verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account;

    // 🔥 ROLE BASED FETCH (THIS WAS MISSING)
    if (decoded.role === "admin") {
      account = await Admin.findById(decoded.id).select("_id role");
    } else {
      account = await User.findById(decoded.id).select(
        "_id role isVerified"
      );
    }

    if (!account) {
      return res.status(401).json({ message: "Account not found" });
    }

    // 🔥 attach unified req.user
    req.user = {
      id: account._id,
      role: account.role,
      isVerified: account.isVerified ?? true,
    };

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR 👉", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
