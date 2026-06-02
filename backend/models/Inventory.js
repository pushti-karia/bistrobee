import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: String,
  currentStock: { type: Number, required: true },
  unit: { type: String, required: true },
  minStockLevel: { type: Number, default: 10 },
  costPerUnit: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  lastRestocked: Date,
  expiryDate: Date
}, { timestamps: true });

inventorySchema.virtual('isLowStock').get(function() {
  return this.currentStock <= this.minStockLevel;
});

export default mongoose.model('Inventory', inventorySchema);
