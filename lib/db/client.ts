import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

const expoDb = SQLite.openDatabaseSync('bolotodo.db');

export const db = drizzle(expoDb, { schema });

export async function initDatabase() {
  await expoDb.execAsync(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      urdu_title TEXT NOT NULL,
      due_date TEXT,
      category TEXT NOT NULL DEFAULT 'general',
      has_alarm INTEGER NOT NULL DEFAULT 0,
      is_completed INTEGER NOT NULL DEFAULT 0,
      needs_parsing INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
}
