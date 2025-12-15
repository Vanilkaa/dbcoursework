const request = require('supertest');
const app = require('../../src/app');
const { clearDatabase, prisma } = require('../../src/utils/db');

describe('Product Service Integration', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('PUT /api/products/:id - Should update price', async () => {
        const category = await prisma.productcategory.create({ data: { name: 'Books' } });
        const product = await prisma.product.create({
            data: { name: 'Old Book', category_id: category.category_id, currentprice: 10.00 }
        });

        const response = await request(app)
            .put(`/api/products/${product.product_id}`)
            .send({ price: 15.50 });

        expect(response.status).toBe(200);
        expect(Number(response.body.data.currentprice)).toBe(15.50);

        const updated = await prisma.product.findUnique({ where: { product_id: product.product_id }});
        expect(Number(updated.currentprice)).toBe(15.50);
    });

    test('PUT /api/products/:id - Should fail on negative price', async () => {
        const category = await prisma.productcategory.create({ data: { name: 'Books' } });
        const product = await prisma.product.create({
            data: { name: 'Math', category_id: category.category_id, currentprice: 10.00 }
        });

        const response = await request(app)
            .put(`/api/products/${product.product_id}`)
            .send({ price: -5.00 });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Price must be positive');
    });

    test('GET /api/products - Should return paginated products', async () => {
        const category = await prisma.productcategory.create({ data: { name: 'Misc' } });
        await prisma.product.createMany({
            data: [
                { name: 'A', category_id: category.category_id, currentprice: 10 },
                { name: 'B', category_id: category.category_id, currentprice: 20 },
                { name: 'C', category_id: category.category_id, currentprice: 30 }
            ]
        });

        const response = await request(app)
            .get(`/api/products?categoryId=${category.category_id}&page=1&limit=2`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe('A');
    });
});