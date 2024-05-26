const jwt = require('jsonwebtoken');

exports.authenticateAdmin = (req, res, next) => {
const authHeader = req.header('Authorization');
if (authHeader && authHeader.startsWith('Bearer ')) {
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized as admin' });
  }

  } else {
    res.status(401).json({ message: 'Not authorized as admin or Authorization header missing' });
}


};

exports.authenticateUser = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
  // const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.tokenPayload;
    console.log(decoded)
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
}};
