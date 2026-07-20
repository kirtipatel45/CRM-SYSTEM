import express from 'express';
import { getRoles, getRole, createRole, updateRole, deleteRole } from './role.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Require authentication for role endpoints (RBAC restrictions removed)
router.use(protect);

router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;
