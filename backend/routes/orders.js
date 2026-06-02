import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, updateOrderItemStatus } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:orderId/items/:itemId', protect, updateOrderItemStatus);

export default router;
