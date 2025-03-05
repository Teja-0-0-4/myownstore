const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  size: { type: [String], default: ['S', 'M', 'L'] },
  description: String,
  image: { type: String } // Cloudinary URL
});

module.exports = mongoose.model('Product', productSchema);