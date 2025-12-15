const productService = require('../../src/services/productService');
const prisma = require('../../src/utils/prismaClient');

jest.mock('../../src/utils/prismaClient', () => ({
    product: {
        findUnique: jest.fn(),
        update: jest.fn()
    }
}));

describe('Unit Tests: Product Logic', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('updateProductPrice - Should throw error if price is negative', async () => {
        await expect(productService.updateProductPrice(1, -50))
            .rejects
            .toThrow('Price must be positive');
            
        expect(prisma.product.update).not.toHaveBeenCalled();
    });

    test('updateProductPrice - Should call update if valid', async () => {
        prisma.product.findUnique.mockResolvedValue({ product_id: 1, currentprice: 10 });
        prisma.product.update.mockResolvedValue({ product_id: 1, currentprice: 20 });

        const result = await productService.updateProductPrice(1, 20);

        expect(result.currentprice).toBe(20);
        expect(prisma.product.update).toHaveBeenCalledWith({
            where: { product_id: 1 },
            data: { currentprice: 20 }
        });
    });
});