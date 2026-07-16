import express from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from './customer.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Customers', 'read'), getCustomers);
router.get('/:id', authorize('Customers', 'read'), getCustomer);
router.post('/', authorize('Customers', 'create'), createCustomer);
router.put('/:id', authorize('Customers', 'update'), updateCustomer);
router.delete('/:id', authorize('Customers', 'delete'), deleteCustomer);

export default router;
