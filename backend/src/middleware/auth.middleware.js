import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and populate role
    const user = await User.findById(decoded.id).populate('role');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'User account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

export const authorize = (resource, action) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // Super Admin has all access (assuming name is Super Admin)
    if (req.user.role.name === 'Super Admin') {
      return next();
    }

    const permissions = req.user.role.permissions;
    const hasPermission = permissions.some(
      (perm) => perm.resource === resource && perm.actions.includes(action)
    );

    if (!hasPermission) {
      return res.status(403).json({ success: false, message: `Forbidden: You don't have permission to ${action} ${resource}` });
    }

    next();
  };
};
