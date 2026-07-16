import express from 'express';
import { getTeams, getTeam, createTeam, updateTeam, deleteTeam } from './team.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Teams', 'read'), getTeams);
router.get('/:id', authorize('Teams', 'read'), getTeam);
router.post('/', authorize('Teams', 'create'), createTeam);
router.put('/:id', authorize('Teams', 'update'), updateTeam);
router.delete('/:id', authorize('Teams', 'delete'), deleteTeam);

export default router;
