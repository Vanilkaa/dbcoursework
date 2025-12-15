const productService = require('../services/productService');

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
        const updated = await productService.updateProductPrice(parseInt(id), price);
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const { categoryId, page, limit } = req.query;
        
        const products = await productService.getProductsByCategory(categoryId, page, limit);
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { updateProduct, getProducts };