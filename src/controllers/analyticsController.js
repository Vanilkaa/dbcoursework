const analyticsService = require('../services/analyticsService');

const getAnalytics = async (req, res) => {
    try {
        const stats = await analyticsService.getRevenueByCategory();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAnalytics };