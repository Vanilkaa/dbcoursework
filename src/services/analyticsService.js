const prisma = require('../utils/prismaClient');

async function getRevenueByCategory() {
    const result = await prisma.$queryRaw`
        SELECT 
            pc.name as category_name,
            COUNT(oi.order_id) as total_items_sold,
            SUM(oi.quantity * oi.unitprice) as total_revenue
        FROM "productcategory" pc
        JOIN "product" p ON pc.category_id = p.category_id
        JOIN "orderitem" oi ON p.product_id = oi.product_id
        GROUP BY pc.category_id, pc.name
        HAVING SUM(oi.quantity * oi.unitprice) > 0
        ORDER BY total_revenue DESC;
    `;
    
    const safeResult = result.map(row => ({
        category_name: row.category_name,
        total_items_sold: Number(row.total_items_sold), 
        total_revenue: Number(row.total_revenue)
    }));

    return safeResult;
}

module.exports = { getRevenueByCategory };