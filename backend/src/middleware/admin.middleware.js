const adminMiddleware = (req, res, next) => {
  try {
    // 🔐 Role-based access control
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    next();
  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR 👉", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = adminMiddleware;
