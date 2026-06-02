import express from 'express';
import { getTables, createTable, updateTable, deleteTable } from '../controllers/tableController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getTables);
router.post('/', protect, authorize('admin', 'manager'), createTable);
router.put('/:id', protect, updateTable);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteTable);

export default router;
