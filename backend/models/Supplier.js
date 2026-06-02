import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: String,
  address: String,
  itemsSupplied: [String],
  rating: { type: Number, min: 1, max: 5, default: 3 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);
