const prisma = require('../utils/prismaClient');

async function updateProductPrice(productId, newPrice) {
    if (newPrice <= 0) throw new Error("Price must be positive");

    const product = await prisma.product.findUnique({ where: { product_id: productId } });
    if (!product) throw new Error("Product not found");

    return await prisma.product.update({
        where: { product_id: productId },
        data: { currentprice: newPrice }
    });
}

async function getProductsByCategory(categoryId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await prisma.product.findMany({
        where: { category_id: parseInt(categoryId) },
        take: parseInt(limit),
        skip: skip,
        orderBy: { name: 'asc' },
        include: { productcategory: true }
    });
}

module.exports = { updateProductPrice, getProductsByCategory };