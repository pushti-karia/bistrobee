import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  address: String,
  loyaltyPoints: { type: Number, default: 0 },
  membershipTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastVisit: Date,
  dateOfBirth: Date,
  notes: String
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
