import express from 'express';
import { getDeals, getDeal, createDeal, updateDeal, deleteDeal } from './deal.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Deals', 'read'), getDeals);
router.get('/:id', authorize('Deals', 'read'), getDeal);
router.post('/', authorize('Deals', 'create'), createDeal);
router.put('/:id', authorize('Deals', 'update'), updateDeal);
router.delete('/:id', authorize('Deals', 'delete'), deleteDeal);

export default router;
