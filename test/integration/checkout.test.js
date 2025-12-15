const request = require('supertest');
const app = require('../../src/app');
const { clearDatabase, prisma } = require('../../src/utils/db');

describe('Checkout Service Integration', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('POST /api/checkout - Should create order, payment, and clear cart', async () => {
        const customer = await prisma.customer.create({
            data: { name: 'Test User', email: 'test@test.com' }
        });

        const category = await prisma.productcategory.create({
            data: { name: 'Tech' }
        });

        const product = await prisma.product.create({
            data: { 
                name: 'Laptop', 
                category_id: category.category_id, 
                currentprice: 1000.00 
            }
        });

        const cart = await prisma.shoppingcart.create({
            data: { customer_id: customer.customer_id }
        });

        await prisma.shoppingcartitem.create({
            data: { 
                cart_id: cart.cart_id, 
                product_id: product.product_id, 
                quantity: 2 
            }
        });

        const response = await request(app)
            .post('/api/checkout')
            .send({
                customerId: customer.customer_id,
                paymentMethod: 'Credit Card'
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        
        const order = await prisma.order.findFirst({ where: { customer_id: customer.customer_id }});
        expect(order).not.toBeNull();
        expect(Number(order.totalorderamount)).toBe(2000.00); // 2 * 1000

        const payment = await prisma.payment.findFirst({ where: { order_id: order.order_id }});
        expect(payment).not.toBeNull();
        expect(payment.method).toBe('Credit Card');

        const cartItems = await prisma.shoppingcartitem.findMany({ where: { cart_id: cart.cart_id }});
        expect(cartItems.length).toBe(0);
    });

    test('POST /api/checkout - Should fail if cart is empty', async () => {
        const customer = await prisma.customer.create({
            data: { name: 'Empty User', email: 'empty@test.com' }
        });
        
        await prisma.shoppingcart.create({
            data: { customer_id: customer.customer_id }
        });

        const response = await request(app)
            .post('/api/checkout')
            .send({ customerId: customer.customer_id, paymentMethod: 'Cash' });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Cart is empty');
        
        const orders = await prisma.order.count();
        expect(orders).toBe(0);
    });
});