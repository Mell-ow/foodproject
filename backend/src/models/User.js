const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // Add the missing comma here! Wait, the code below is valid JSON.
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  profilePhoto: { type: String, default: '' },
  loyaltyPoints: { type: Number, default: 0 },
  savedAddresses: [{
    label: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
  }],
  refreshToken: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);