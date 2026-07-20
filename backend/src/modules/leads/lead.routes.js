import express from 'express';
import { getLeads, getLead, createLead, updateLead, deleteLead, addLeadNote } from './lead.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

// Sub-routes for notes
router.post('/:id/notes', addLeadNote);

export default router;
