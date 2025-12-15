const request = require('supertest');
const app = require('../../src/app');
const { clearDatabase, prisma } = require('../../src/utils/db');

describe('Analytics Service Integration', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('GET /api/analytics/revenue - Should calculate revenue by category', async () => {
        const category = await prisma.productcategory.create({ data: { name: 'Gold' } });
        const product = await prisma.product.create({
            data: { name: 'Ring', category_id: category.category_id, currentprice: 100.00 }
        });
        const customer = await prisma.customer.create({ data: { name: 'Rich', email: 'rich@test.com' } });
        
        const order = await prisma.order.create({
            data: { customer_id: customer.customer_id, totalorderamount: 200.00 }
        });

        await prisma.orderitem.create({
            data: { 
                order_id: order.order_id, 
                product_id: product.product_id, 
                quantity: 2, 
                unitprice: 100.00 
            }
        });

        const response = await request(app).get('/api/analytics/revenue');

        expect(response.status).toBe(200);
        const report = response.body;
        expect(report).toHaveLength(1);
        expect(report[0].category_name).toBe('Gold');
        expect(report[0].total_revenue).toBe(200);
        expect(report[0].total_items_sold).toBe(1);
    });
});