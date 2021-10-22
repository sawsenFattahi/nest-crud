import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
