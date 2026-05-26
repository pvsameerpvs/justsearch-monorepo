import { client } from './index';
import fs from 'fs';
import path from 'path';
import { TENANT_TABLES } from './tenant-template';

export async function backupTenantSchema(
  schemaName: string,
  restaurantSlug: string
): Promise<string> {
  const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${restaurantSlug}_${timestamp}.json`;
  const filepath = path.join(backupDir, filename);

  const backup: Record<string, unknown[]> = {};

  for (const table of TENANT_TABLES) {
    try {
      const rows = await client.unsafe(`SELECT * FROM "${schemaName}"."${table}"`);
      backup[table] = rows as unknown[];
    } catch {
      backup[table] = [];
    }
  }

  try {
    const [registry] = await client.unsafe(
      `SELECT * FROM public.restaurants WHERE schema_name = $1`,
      [schemaName]
    );
    backup['_registry'] = registry ? [registry] : [];
  } catch {
    backup['_registry'] = [];
  }

  fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
  return filepath;
}

export async function dropTenantSchema(schemaName: string): Promise<void> {
  await client.unsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
}
