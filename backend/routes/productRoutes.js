const express = require('express');
const { searchProducts, createProduct } = require('../controllers/productController');
const upload = require('multer')({ storage: require('multer').memoryStorage() });
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/search', searchProducts);
router.post('/', auth, upload.single('image'), createProduct);
router.delete('/:id', auth, async (req, res) => {
  const Product = require('../models/Product');
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;