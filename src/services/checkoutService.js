const prisma = require('../utils/prismaClient');

async function processCheckout(customerId, paymentMethod) {
    return await prisma.$transaction(async (tx) => {
        const cart = await tx.shoppingcart.findFirst({
            where: { customer_id: customerId },
            include: { shoppingcartitem: { include: { product: true } } }
        });

        if (!cart || cart.shoppingcartitem.length === 0) {
            throw new Error("Cart is empty or not found");
        }

        let totalAmount = 0;
        const orderItemsData = cart.shoppingcartitem.map(item => {
            const itemTotal = Number(item.product.currentprice) * item.quantity;
            totalAmount += itemTotal;
            return {
                product_id: item.product_id,
                quantity: item.quantity,
                unitprice: item.product.currentprice
            };
        });

        const newOrder = await tx.order.create({
            data: {
                customer_id: customerId,
                totalorderamount: totalAmount,
                orderitem: {
                    create: orderItemsData
                }
            }
        });

        await tx.payment.create({
            data: {
                order_id: newOrder.order_id,
                amount: totalAmount,
                method: paymentMethod
            }
        });

        await tx.shoppingcartitem.deleteMany({
            where: { cart_id: cart.cart_id }
        });

        return newOrder;
    });
}

module.exports = { processCheckout };