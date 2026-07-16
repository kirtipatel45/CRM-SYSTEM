import User from './user.model.js';
import Role from '../roles/role.model.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(400).json({ success: false, message: 'Role does not exist' });
    }

    const user = await User.create({ name, email, password, role });
    
    // Remove password from response
    user.password = undefined;

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Cannot update password via this route
    if (req.body.password) {
      delete req.body.password;
    }

    if (req.body.role) {
      const roleExists = await Role.findById(req.body.role);
      if (!roleExists) {
        return res.status(400).json({ success: false, message: 'Role does not exist' });
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('role');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    // Prevent deleting oneself
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
