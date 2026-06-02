import express from 'express';
import { getCustomers, createCustomer, updateCustomer } from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCustomers);
router.post('/', protect, createCustomer);
router.put('/:id', protect, updateCustomer);

export default router;
