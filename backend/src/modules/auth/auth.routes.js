import express from 'express';
import { login, register, logout, getMe, refresh, getPublicRoles } from './auth.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/roles', getPublicRoles);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh', refresh);

export default router;
