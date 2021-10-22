import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  sku: string;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  price: number;

  @Column()
  quantity: number;

  constructor(
    name: string,
    category: string,
    sku: string,
    price: number,
    quantity: number,
  ) {
    this.name = name;
    this.category = category;
    this.sku = sku;
    this.price = price;
    this.quantity = quantity;
  }
}
