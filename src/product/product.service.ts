import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from './entities/product.entity';
import { IProduct } from './interfaces/product.interface';
import { ProductDto } from './dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<IProduct>,
  ) {}

  createProduct(productData: ProductDto): Observable<IProduct[] | IProduct> {
    const newProduct = this.productRepository.create(productData);
    return from(this.productRepository.save(newProduct)).pipe(
      map((product: IProduct[] | IProduct) => {
        if (!product) {
          throw new BadRequestException();
        }
        return product;
      }),
      catchError((e) => {
        throw new InternalServerErrorException(e);
      }),
    );
  }

  updateProduct(
    productId: number,
    productData: Partial<ProductDto>,
  ): Observable<number> {
    return from(this.productRepository.update(productId, productData)).pipe(
      map((response) => {
        if (!response || response.affected < 1) {
          throw new NotFoundException();
        }
        return response.affected;
      }),
      catchError((e) => {
        throw new InternalServerErrorException(e);
      }),
    );
  }

  findOneProduct(productId: number): Observable<IProduct> {
    return from(this.productRepository.findOneOrFail(productId)).pipe(
      map((product) => {
        if (!product) {
          throw new NotFoundException();
        }
        return product;
      }),
      catchError((e) => {
        throw new InternalServerErrorException(e);
      }),
    );
  }

  findAllProducts(): Observable<IProduct[]> {
    return from(this.productRepository.find()).pipe(
      map((products) => {
        if (!products || !products.length) {
          throw new NotFoundException();
        }
        return products;
      }),
      catchError(() => {
        throw new InternalServerErrorException();
      }),
    );
  }

  findAllCategores(): Observable<string[]> {
    return from(this.productRepository.find()).pipe(
      map((products) => {
        if (!products || !products.length) {
          throw new NotFoundException();
        }
        return [...new Set(products.map((product) => product.category))];
      }),
      catchError(() => {
        throw new InternalServerErrorException();
      }),
    );
  }

  deleteProduct(productId: number): Observable<number> {
    return from(this.productRepository.delete(productId)).pipe(
      map((response) => {
        if (!response) {
          throw new NotFoundException();
        }
        return response.affected;
      }),
      catchError(() => {
        throw new InternalServerErrorException();
      }),
    );
  }
}
