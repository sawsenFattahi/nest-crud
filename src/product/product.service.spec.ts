import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

const productList = [
  new Product('AP Oman PC - Aluminum', 'Computers', 'A0003', 1399.99, 10),
  new Product('GameStation 5', 'Games', 'A0002', 269.99, 15),
];

const oneProduct = new Product('GameStation 5', 'Games', 'A0002', 269.99, 15);

const categoriesList = ['Computers', 'Games'];

describe('ProductService', () => {
  let productService: ProductService;

  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue(productList),
            findOneOrFail: jest.fn().mockResolvedValue(oneProduct),
            create: jest.fn().mockReturnValue(oneProduct),
            save: jest.fn().mockReturnValue(
              of({
                id: 1,
                name: 'GameStation 6',
                category: 'Games',
                sku: 'A0002',
                price: 269.99,
                quantity: 15,
              }),
            ),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });
  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const products = await productService.findAllProducts().toPromise();
      expect(products).toEqual(productList);
    });
  });
  describe('getOneProduct', () => {
    it('should get a single product', async () => {
      const repoSpy = jest.spyOn(repo, 'findOneOrFail');
      const product = await productService.findOneProduct(1).toPromise();
      expect(product).toEqual(oneProduct);
      expect(repoSpy).toBeCalledWith(1);
    });
  });

  describe('createProduct', () => {
    it('should successfully insert a product', () => {
      expect(
        productService
          .createProduct({
            name: 'GameStation 5',
            category: 'Games',
            sku: 'A0002',
            price: 269.99,
            quantity: 15,
          })
          .toPromise(),
      ).resolves.toEqual(of(oneProduct));
      expect(repo.create).toBeCalledTimes(1);
      expect(repo.create).toBeCalledWith({
        name: 'GameStation 5',
        category: 'Games',
        sku: 'A0002',
        price: 269.99,
        quantity: 15,
      });
      expect(repo.save).toBeCalledTimes(1);
    });
  });
  describe('updateProduct', () => {
    it('should successfully insert a product', () => {
      expect(
        productService
          .updateProduct(1, {
            name: 'GameStation 5',
            category: 'Games',
            sku: 'A0002',
            price: 269.99,
            quantity: 15,
          })
          .toPromise(),
      ).resolves.toEqual(of(oneProduct));
      expect(repo.update).toBeCalledTimes(1);
      expect(repo.update).toBeCalledWith(1, {
        name: 'GameStation 5',
        category: 'Games',
        sku: 'A0002',
        price: 269.99,
        quantity: 15,
      });
    });
  });
  describe('deleteOne', () => {
    it('should return 1', () => {
      expect(productService.deleteProduct(2).toPromise()).resolves.toEqual(1);
    });
    it('should return {deleted: false, message: err.message}', () => {
      const repoSpy = jest
        .spyOn(repo, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'));
      expect(productService.deleteProduct(15).toPromise()).resolves.toEqual(0);
      expect(repoSpy).toBeCalledWith(15);
      expect(repoSpy).toBeCalledTimes(1);
    });
  });

  describe('getAllCategories', () => {
    it('should return an array of categories', async () => {
      const categories = await productService.findAllCategores().toPromise();
      expect(categories).toEqual(categoriesList);
    });
  });
});
