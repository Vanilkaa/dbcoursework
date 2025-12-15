const prisma = require('../../src/utils/prismaClient');

async function clearDatabase() {
    const tablenames = [
        'payment',
        'orderitem',
        'Order',
        'shoppingcartitem',
        'shoppingcart',
        'Review',
        'product',
        'productcategory',
        'customer'
    ];

    for (const tableName of tablenames) {
        try {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
        } catch (error) {
            console.log(`Error cleaning ${tableName}: ${error.message}`);
        }
    }
}

module.exports = { clearDatabase, prisma };