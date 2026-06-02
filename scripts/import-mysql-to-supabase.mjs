import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';

const required = ['MYSQL_HOST', 'MYSQL_DATABASE', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing env vars: ${missing.join(', ')}`);
  console.error('Example: MYSQL_HOST=127.0.0.1 MYSQL_PORT=3307 MYSQL_USER=root MYSQL_DATABASE=piggery_db SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-mysql-to-supabase.mjs');
  process.exit(1);
}

const mysqlDb = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE,
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const tableMap = [
  ['pig_breeds', 'pig_breeds'],
  ['pens', 'pens'],
  ['pigs', 'pigs'],
  ['feed_types', 'feed_types'],
  ['feed_inventory', 'feed_inventory'],
  ['feeding_records', 'feeding_records'],
  ['weight_records', 'weight_records'],
  ['health_records', 'health_records'],
  ['breeding_records', 'breeding_records'],
  ['mortality_records', 'mortality_records'],
  ['sales_records', 'sales_records'],
  ['expenses', 'expenses'],
  ['tasks', 'tasks'],
];

const skipped = [];
for (const [mysqlTable, pgTable] of tableMap) {
  const [rows] = await mysqlDb.query(`select * from ${mysqlTable}`);
  if (!rows.length) {
    console.log(`${mysqlTable}: 0 rows`);
    continue;
  }

  const payload = rows.map((row) => {
    const copy = { ...row };
    delete copy.updated_at;
    for (const key of Object.keys(copy)) {
      if (copy[key] instanceof Date) copy[key] = copy[key].toISOString().slice(0, 10);
      if (key.endsWith('_by') || key === 'created_by' || key === 'assigned_to') copy[key] = null;
    }
    return copy;
  });

  const { error } = await supabase.from(pgTable).upsert(payload, { onConflict: 'id' });
  if (error) {
    skipped.push({ table: mysqlTable, reason: error.message });
    console.error(`${mysqlTable}: skipped - ${error.message}`);
  } else {
    console.log(`${mysqlTable}: imported ${payload.length} rows`);
  }
}

await mysqlDb.end();

if (skipped.length) {
  console.log('\nSkipped tables:');
  console.table(skipped);
  process.exitCode = 1;
} else {
  console.log('\nImport completed.');
}
