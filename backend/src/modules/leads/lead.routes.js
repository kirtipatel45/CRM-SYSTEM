import express from 'express';
import { getLeads, getLead, createLead, updateLead, deleteLead, addLeadNote } from './lead.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Leads', 'read'), getLeads);
router.get('/:id', authorize('Leads', 'read'), getLead);
router.post('/', authorize('Leads', 'create'), createLead);
router.put('/:id', authorize('Leads', 'update'), updateLead);
router.delete('/:id', authorize('Leads', 'delete'), deleteLead);

// Sub-routes for notes
router.post('/:id/notes', authorize('Leads', 'update'), addLeadNote);

export default router;
