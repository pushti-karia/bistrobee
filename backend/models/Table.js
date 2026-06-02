import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'reserved', 'billing'],
    default: 'available' 
  },
  position: {
    x: Number,
    y: Number
  },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  qrCode: String
}, { timestamps: true });

export default mongoose.model('Table', tableSchema);
