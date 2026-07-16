import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from './user.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Users', 'read'), getUsers);
router.get('/:id', authorize('Users', 'read'), getUser);
router.post('/', authorize('Users', 'create'), createUser);
router.put('/:id', authorize('Users', 'update'), updateUser);
router.delete('/:id', authorize('Users', 'delete'), deleteUser);

export default router;
