const cartService = require('../services/cartService');

const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        await cartService.removeCartItem(parseInt(id));
        res.json({ success: true, message: "Item deleted" });
    } catch (err) {
        res.status(404).json({ success: false, error: err.message });
    }
};

module.exports = { deleteCartItem };