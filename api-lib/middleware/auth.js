const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Server not configured: JWT_SECRET missing.' });
  }

  try {
    const parts = token.split(' ');
    const jwtToken = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : token;
    const decoded = jwt.verify(jwtToken, secret);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
