const express = require('express');
const router = express.Router();

const checkoutController = require('../controllers/checkoutController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const analyticsController = require('../controllers/analyticsController');

router.post('/checkout', checkoutController.checkout);
router.put('/products/:id', productController.updateProduct);
router.delete('/cart-item/:id', cartController.deleteCartItem);
router.get('/products', productController.getProducts);
router.get('/analytics/revenue', analyticsController.getAnalytics);

module.exports = router;