import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Protect routes using access token
 */
export const protect = async (req, res, next) => {
  const token = req.cookies?.token;
 // console.log('token',token)

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, please login',
      success: false,
      error: true,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
        error: true,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED', // 👈 frontend uses this to call refresh
        success: false,
        error: true,
      });
    }

    return res.status(401).json({
      message: err.message || 'Invalid token',
      success: false,
      error: true,
    });
  }
};

/**
 * Role-based check
 */
export const isAdminOrStaff = (req, res, next) => {
  if (req.user && ['admin', 'staff'].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({
    message: 'You are not authorized',
    success: false,
    error: true,
  });
};
