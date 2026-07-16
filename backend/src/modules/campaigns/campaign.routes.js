import express from 'express';
import { getCampaigns, getCampaign, createCampaign, updateCampaign, deleteCampaign } from './campaign.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Campaigns', 'read'), getCampaigns);
router.get('/:id', authorize('Campaigns', 'read'), getCampaign);
router.post('/', authorize('Campaigns', 'create'), createCampaign);
router.put('/:id', authorize('Campaigns', 'update'), updateCampaign);
router.delete('/:id', authorize('Campaigns', 'delete'), deleteCampaign);

export default router;
