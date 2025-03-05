const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, size, description } = req.body;

    // Validate required fields
    if (!name || !category || !price || !stock) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'ecommerce_products' },
          (error, result) => error ? reject(error) : resolve(result)
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    // Handle size: ensure it’s a string before splitting
    const sizeArray = typeof size === 'string' && size ? size.split(',') : [];

    const product = new Product({
      name,
      category,
      price: parseFloat(price) || 0, // Default to 0 if parsing fails
      stock: parseInt(stock) || 0,   // Default to 0 if parsing fails
      size: sizeArray,
      description,
      image: imageUrl
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q, category } = req.query;
    let query = {};
    
    if (q) query.name = { $regex: q, $options: 'i' };
    if (category) query.category = category;

    const products = await Product.find(query);
    
    if (!products.length && q) {
      const suggestions = await Product.find({ 
        name: { $regex: q.split('')[0], $options: 'i' } 
      }).limit(5);
      return res.json({ products: [], suggestions });
    }
    
    const suggestions = await Product.find({ 
      price: { $lt: products[0]?.price || Infinity } 
    }).limit(3);
    
    res.json({ products, suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};