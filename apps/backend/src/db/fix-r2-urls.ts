import dotenv from 'dotenv';
dotenv.config();

import { sql } from 'drizzle-orm';
import { db, client } from './index';

const WRONG_PREFIX = 'https://pub-a8b71d738ead4aa6b73aea1ed64104fc.r2.dev/eatygo/';
const CORRECT_PREFIX = 'https://pub-a8b71d738ead4aa6b73aea1ed64104fc.r2.dev/';

async function fixUrls() {
  console.log('🔧 Fixing R2 URL format in database...\n');

  let totalFixed = 0;

  // Fix public.advertisements
  const ads = await db.execute<{ id: string; image_url: string | null; media_url_low: string | null }>(
    sql`SELECT id, image_url, media_url_low FROM public.advertisements WHERE image_url LIKE ${WRONG_PREFIX + '%'} OR media_url_low LIKE ${WRONG_PREFIX + '%'}`
  );
  for (const row of ads) {
    if (row.image_url?.startsWith(WRONG_PREFIX)) {
      const fixed = row.image_url.replace(WRONG_PREFIX, CORRECT_PREFIX);
      await db.execute(sql`UPDATE public.advertisements SET image_url = ${fixed} WHERE id = ${row.id}`);
      totalFixed++;
    }
    if (row.media_url_low?.startsWith(WRONG_PREFIX)) {
      const fixed = row.media_url_low.replace(WRONG_PREFIX, CORRECT_PREFIX);
      await db.execute(sql`UPDATE public.advertisements SET media_url_low = ${fixed} WHERE id = ${row.id}`);
      totalFixed++;
    }
  }
  console.log(`   public.advertisements: ${ads.length} rows checked`);

  // Fix public.restaurants settings
  const restaurants = await db.execute<{ id: string; settings: unknown }>(
    sql`SELECT id, settings FROM public.restaurants WHERE settings::text LIKE ${'%' + WRONG_PREFIX + '%'}`
  );
  for (const row of restaurants) {
    const settingsStr = JSON.stringify(row.settings);
    if (settingsStr.includes(WRONG_PREFIX)) {
      const fixed = JSON.parse(settingsStr.replaceAll(WRONG_PREFIX, CORRECT_PREFIX));
      await db.execute(sql`UPDATE public.restaurants SET settings = ${JSON.stringify(fixed)}::jsonb WHERE id = ${row.id}`);
      totalFixed++;
    }
  }
  console.log(`   public.restaurants: ${restaurants.length} rows fixed`);

  // Fix per-tenant menu_items
  const schemas = await db.execute<{ schema_name: string }>(
    sql`SELECT schema_name FROM public.restaurants WHERE status = 'active'`
  );

  for (const { schema_name } of schemas) {
    const items = await db.execute<{ id: string }>(
      sql`SELECT id FROM ${sql.identifier(schema_name)}.menu_items WHERE image_url LIKE ${WRONG_PREFIX + '%'}`
    );
    if (items.length > 0) {
      await db.execute(
        sql`UPDATE ${sql.identifier(schema_name)}.menu_items SET image_url = REPLACE(image_url, ${WRONG_PREFIX}, ${CORRECT_PREFIX}) WHERE image_url LIKE ${WRONG_PREFIX + '%'}`
      );
      totalFixed += items.length;
      console.log(`   ${schema_name}.menu_items: ${items.length} URLs fixed`);
    }
  }

  console.log(`\n✅ Total fixed: ${totalFixed}`);
  await client.end();
}

fixUrls().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
