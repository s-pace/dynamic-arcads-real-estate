import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTransactionIndexes1710947200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Index for getTop5HighestMarginTransactions query
    await queryRunner.query(`
      CREATE INDEX idx_transaction_margin 
      ON transactions ((transaction_net_value - transaction_cost) DESC);
    `);

    // Index for getWeeklyAverageMargin and calculateAverageMargin queries
    await queryRunner.query(`
      CREATE INDEX idx_transaction_date 
      ON transactions (transaction_date);
    `);

    // Composite index for getTopCitiesByTransactionValue query
    await queryRunner.query(`
      CREATE INDEX idx_city_value 
      ON transactions (city, transaction_net_value);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transaction_margin;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transaction_date;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_city_value;`);
  }
}
