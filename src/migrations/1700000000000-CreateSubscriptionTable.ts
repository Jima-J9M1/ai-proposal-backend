import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateSubscriptionTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subscriptions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive', 'cancelled', 'past_due'],
            default: "'inactive'",
          },
          {
            name: 'plan',
            type: 'enum',
            enum: ['free', 'basic', 'premium'],
            default: "'free'",
          },
          {
            name: 'stripeCustomerId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'stripeSubscriptionId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'stripePriceId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'currentPeriodStart',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'currentPeriodEnd',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'cancelAtPeriodEnd',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'profilesUsed',
            type: 'int',
            default: 0,
          },
          {
            name: 'proposalsUsed',
            type: 'int',
            default: 0,
          },
          {
            name: 'profilesLimit',
            type: 'int',
            default: 2,
          },
          {
            name: 'proposalsLimit',
            type: 'int',
            default: 5,
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'subscriptions',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscriptions');
  }
} 