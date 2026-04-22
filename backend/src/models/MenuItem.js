const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Starters, Main Course, etc.
  price: { type: Number, required: true },
  image: { type: String }, // Cloudinary URL
  isVeg: { type: Boolean, default: true },
  spiceLevel: { type: Number, default: 1, min: 1, max: 3 }, // 1: Mild, 2: Medium, 3: Spicy
  isAvailable: { type: Boolean, default: true },
  isBestSeller: { type: Boolean, default: false },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 }
  }],
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
