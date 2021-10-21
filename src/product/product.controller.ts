import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductDto } from './dtos/product.dto';
import { IProduct } from './interfaces/product.interface';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  addProduct(@Body() product): Observable<IProduct[] | IProduct> {
    return this.productService.createProduct(product);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':productId')
  updateProduct(
    @Body() product: Partial<ProductDto>,
    @Param('productId') productId: number,
  ): Observable<number> {
    return this.productService.updateProduct(productId, product);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  deleteProduct(@Param('productId') productId: number): Observable<number> {
    return this.productService.deleteProduct(productId);
  }

  @Get('/id/:productId')
  getProduct(@Param('productId') productId: number) {
    return this.productService.findOneProduct(productId);
  }

  @Get('/all/')
  getAllProducts(): Observable<IProduct[]> {
    return this.productService.findAllProducts();
  }

  @Get('/categories/')
  getAllcategories(): Observable<string[]> {
    return this.productService.findAllCategores();
  }
}
