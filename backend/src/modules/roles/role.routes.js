import express from 'express';
import { getRoles, getRole, createRole, updateRole, deleteRole } from './role.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Settings', 'read'), getRoles);
router.get('/:id', authorize('Settings', 'read'), getRole);
router.post('/', authorize('Settings', 'create'), createRole);
router.put('/:id', authorize('Settings', 'update'), updateRole);
router.delete('/:id', authorize('Settings', 'delete'), deleteRole);

export default router;
