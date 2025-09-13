/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Migration1757755767849 {
    name = 'Migration1757755767849'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users2" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users2" DROP COLUMN "createdAt"`);
    }
}
