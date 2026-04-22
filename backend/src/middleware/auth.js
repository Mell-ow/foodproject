const { TOKEN_NAME, verifyToken } = require("../utils/token");
const User = require("../models/User");

async function requireAuth(req, res, next) {
  const bearer = req.headers.authorization || "";
  const bearerToken = bearer.startsWith("Bearer ") ? bearer.slice(7) : null;
  const token = req.cookies[TOKEN_NAME] || bearerToken;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      lastLoginAt: user.lastLoginAt
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  requireAuth
};