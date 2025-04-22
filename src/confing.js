const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://haardbosamiya4:hard%402006@hard.azbxbco.mongodb.net/')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Schemas and Models
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, default: " " },
  userType: { type: String, default: "user" }
});

const stockSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  category: { type: String },
  quantityType: { type: String },
  image: { type: Buffer },
  productId: { type: String, unique: true }
});

const orderSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  Address: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

const OTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

// Models
const adminCollection = mongoose.model('Admin', adminSchema);
const stockCollection = mongoose.model('Stock', stockSchema);
const orderCollection = mongoose.model('Order', orderSchema);
const OTPCollection = mongoose.model('OTP', OTPSchema);

module.exports = {
  adminCollection,
  stockCollection,
  orderCollection,
  OTPCollection
};