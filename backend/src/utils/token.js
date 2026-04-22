const jwt = require("jsonwebtoken");

const TOKEN_NAME = "zanCafeToken";
const JWT_SECRET = process.env.JWT_SECRET || "zan-cafe-dev-secret";

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function setAuthCookie(res, token) {
  res.cookie(TOKEN_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function clearAuthCookie(res) {
  res.clearCookie(TOKEN_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });
}

module.exports = {
  TOKEN_NAME,
  signToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie
};