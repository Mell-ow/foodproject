const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  itemRatings: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
  }],
  comment: { type: String, maxlength: 300 }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
