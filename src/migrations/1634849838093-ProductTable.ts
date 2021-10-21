import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductTable1634849838093 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO product (name, category, sku, price, quantity) VALUES ('Pong','Games','A0001',69.99,20), ('GameStation 5','Games','A0002',269.99,15), ('AP Oman PC - Aluminum','Computers','A0003',1399.99,10), ('Fony UHD HDR 55 4k TV','TVs and Accessories','A0004',1399.99, 5)",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM product');
  }
}
