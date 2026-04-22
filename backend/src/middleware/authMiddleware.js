const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Check cookie or Authorization header
  let token = req.cookies?.access_token;
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zan-cafe-super-secret');
    req.user = decoded; // { id, role }
    req.userId = decoded.id; // Map id to userId for consistency
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        status: 'fail', 
        message: 'Token expired', 
        errorCode: 'TOKEN_EXPIRED' 
      });
    }
    return res.status(401).json({ status: 'fail', message: 'Invalid token.' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

module.exports = { verifyToken, protect: verifyToken, isAdmin };
