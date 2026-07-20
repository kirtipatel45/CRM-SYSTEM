import express from 'express';
import { getAuditLogs } from './audit.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply protection to all routes in this module
router.use(protect);

// Only admins should have the 'Settings' 'manage' or 'Users' 'manage' permission
// But for utmost security, we can explicitly require 'Users' 'manage' since the Admin role has it
router.get('/', authorize('Users', 'manage'), getAuditLogs);

export default router;
