const prisma = require('../utils/prismaClient');

async function removeCartItem(cartItemId) {
    try {
        return await prisma.shoppingcartitem.delete({
            where: { cartitem_id: cartItemId }
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error("Item not found");
        }
        throw error;
    }
}

module.exports = { removeCartItem };