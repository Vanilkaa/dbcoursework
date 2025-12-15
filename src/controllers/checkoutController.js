const checkoutService = require('../services/checkoutService');

const checkout = async (req, res) => {
    try {
        const { customerId, paymentMethod } = req.body;
        const order = await checkoutService.processCheckout(customerId, paymentMethod);
        res.status(201).json({ success: true, message: "Order placed successfully", data: order });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = { checkout };