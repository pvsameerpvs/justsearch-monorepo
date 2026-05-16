import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, client } from './index';

async function runMigrations() {
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  await client.end();
}

runMigrations().catch((err) => {
  process.stderr.write(`Migration failed: ${String(err)}\n`);
  process.exit(1);
});
