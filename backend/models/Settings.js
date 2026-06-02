import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'BistroBee' },
  restaurantAddress: String,
  restaurantPhone: String,
  restaurantEmail: String,
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  taxRate: { type: Number, default: 5 },
  taxName: { type: String, default: 'GST' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  receiptFooter: String,
  lowStockThreshold: { type: Number, default: 10 }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
