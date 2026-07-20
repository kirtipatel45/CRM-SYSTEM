import Role from './role.model.js';
import User from '../users/user.model.js';

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private
export const getRoles = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const roles = await Role.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single role by ID
// @route   GET /api/roles/:id
// @access  Private
export const getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new role
// @route   POST /api/roles
// @access  Private
export const createRole = async (req, res, next) => {
  try {
    const { name, permissions, description, isSystem } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }

    const existingRole = await Role.findOne({ name: name.trim() });
    if (existingRole) {
      return res.status(400).json({ success: false, message: 'A role with this name already exists' });
    }

    const role = await Role.create({
      name: name.trim(),
      description,
      permissions: permissions || [],
      isSystem: isSystem || false
    });

    res.status(201).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private
export const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    if (role.isSystem && req.body.isSystem === false) {
      return res.status(400).json({ success: false, message: 'Cannot modify system status of system roles' });
    }

    if (req.body.name && req.body.name.trim() !== role.name) {
      const nameExists = await Role.findOne({ name: req.body.name.trim() });
      if (nameExists) {
        return res.status(400).json({ success: false, message: 'A role with this name already exists' });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.body.name ? { name: req.body.name.trim() } : {})
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedRole });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private
export const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    if (role.isSystem) {
      return res.status(400).json({ success: false, message: 'Cannot delete system roles' });
    }

    const userCount = await User.countDocuments({ role: req.params.id });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role '${role.name}' because it is assigned to ${userCount} user(s)`
      });
    }

    await role.deleteOne();
    res.status(200).json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    next(error);
  }
};
