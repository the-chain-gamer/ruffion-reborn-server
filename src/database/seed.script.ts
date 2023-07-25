// import { Card } from 'gen/db';
// import { MigrationExecutor } from 'typeorm';
// import { Env, fetchConfig } from 'src/app.config';
// import { RunInContext } from 'src/app.script';
// import {cardsDefaults} from "../system/cards.defaults";
//
// const ALLOWED_ENVS = [Env.dev, Env.test, Env.stage];
//
// /**
//  * Perform various checks to ensure we run the seed script
//  * in an empty and fully-migrated database only.
//  */
// const performChecks = async (datasource) => {
//     const env = fetchConfig('app', 'env');
//     const migrator = new MigrationExecutor(datasource, datasource.createQueryRunner('master'));
//     const pendingMigrations = await migrator.getPendingMigrations();
//     const { manager } = datasource;
//
//     if (!ALLOWED_ENVS.includes(env)) {
//         throw new Error(`Cannot seed database in "${process.env.NODE_ENV}".`);
//     }
//
//     if (pendingMigrations.length > 0) {
//         throw new Error('Cannot seed database with pending migrations.');
//     }
//
//     const [existing] = await manager.query(`
//     SELECT count(*) as count FROM card
//   `);
//     if (existing.count > 0) {
//         throw new Error('Cannot seed database with existing data.');
//     }
// };
//
// /**
//  * Main Seed Script
//  */
// const seed = async ({ datasource }) => {
//     await performChecks(datasource);
//
//     // Make all seed operations atomic
//     await datasource.transaction(async (manager) => {
//         // Create Cards
//
//         await datasource.manager.save(Card,cardsDefaults);
//     });
// };
//
// RunInContext(seed);
