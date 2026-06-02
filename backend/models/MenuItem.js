import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  image: String,
  variants: [variantSchema],
  preparationTime: { type: Number, default: 15 },
  isAvailable: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: true },
  ingredients: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantity: Number,
    unit: String
  }],
  popularity: { type: Number, default: 0 },
  calories: Number,
  spiceLevel: { type: String, enum: ['mild', 'medium', 'hot', 'extra-hot'] }
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
