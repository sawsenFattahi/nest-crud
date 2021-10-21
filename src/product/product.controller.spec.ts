import { TestingModule, Test } from '@nestjs/testing';
import { ProductDto } from './dtos/product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let productController: ProductController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAllProducts: jest.fn().mockResolvedValue([
              {
                id: 1,
                name: 'ccc',
                category: 'TVs and Accessories',
                sku: 'A0004',
                price: 1399,
                quantity: 15,
              },
            ]),
            findOneProduct: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                id,
                name: 'ccc',
                category: 'TVs and Accessories',
                sku: 'A0004',
                price: 1399,
                quantity: 15,
              }),
            ),
            findAllCategores: jest
              .fn()
              .mockResolvedValue(['TVs and Accessories']),
            createProduct: jest
              .fn()
              .mockImplementation((product: ProductDto) =>
                Promise.resolve({ id: 10, ...product }),
              ),
            updateProduct: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((_product: Partial<ProductDto>, _id) =>
                Promise.resolve(1),
              ),
            deleteProduct: jest
              .fn()
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .mockImplementation((_id) => Promise.resolve(1)),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
  });
  it('should be defined', () => {
    expect(productController).toBeDefined();
  });
  describe('getAllProducts', () => {
    it('should get an array of products', async () => {
      await expect(productController.getAllProducts()).resolves.toEqual([
        {
          id: 1,
          name: 'ccc',
          category: 'TVs and Accessories',
          sku: 'A0004',
          price: 1399,
          quantity: 15,
        },
      ]);
    });
  });
  describe('getProduct', () => {
    it('should get a single cat', async () => {
      await expect(productController.getProduct(1)).resolves.toEqual({
        id: 1,
        name: 'ccc',
        category: 'TVs and Accessories',
        sku: 'A0004',
        price: 1399,
        quantity: 15,
      });
      await expect(productController.getProduct(2)).resolves.toEqual({
        id: 2,
        name: 'ccc',
        category: 'TVs and Accessories',
        sku: 'A0004',
        price: 1399,
        quantity: 15,
      });
    });
  });
  describe('getAllCategories', () => {
    it('should get an array of categories', async () => {
      await expect(productController.getAllcategories()).resolves.toEqual([
        'TVs and Accessories',
      ]);
    });
  });
  describe('addProduct', () => {
    it('should create a new product', async () => {
      const newProduct: ProductDto = {
        name: 'product 1',
        category: 'TVs and Accessories',
        sku: 'A0004',
        price: 1399,
        quantity: 15,
      };
      await expect(productController.addProduct(newProduct)).resolves.toEqual({
        id: 10,
        ...newProduct,
      });
    });
  });
  describe('updateProduct', () => {
    it('should update a product and return 1', async () => {
      const updateData: Partial<ProductDto> = {
        price: 1399,
        quantity: 15,
      };
      await expect(
        productController.updateProduct(updateData, 10),
      ).resolves.toEqual(1);
    });
  });
  describe('deleteProduct', () => {
    it('should delete a new product and return 1', async () => {
      await expect(productController.deleteProduct(10)).resolves.toEqual(1);
    });
  });
});
