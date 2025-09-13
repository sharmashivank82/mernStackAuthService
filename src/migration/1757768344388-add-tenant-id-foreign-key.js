/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddTenantIdForeignKey1757768344388 {
    name = 'AddTenantIdForeignKey1757768344388'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users2" ADD "tenantId" integer`);
        await queryRunner.query(`ALTER TABLE "users2" ADD CONSTRAINT "FK_e72398bd8dd64d509df8d5a4ed1" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users2" DROP CONSTRAINT "FK_e72398bd8dd64d509df8d5a4ed1"`);
        await queryRunner.query(`ALTER TABLE "users2" DROP COLUMN "tenantId"`);
    }
}
