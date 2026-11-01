import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const todosTable = sqliteTable('todos', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  urduTitle: text('urdu_title').notNull(),
  dueDate: text('due_date'),
  category: text('category').default('general').notNull(),
  hasAlarm: integer('has_alarm', { mode: 'boolean' }).default(false).notNull(),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false).notNull(),
  needsParsing: integer('needs_parsing', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at').notNull(),
});

export type TodoRow = typeof todosTable.$inferSelect;
export type NewTodoRow = typeof todosTable.$inferInsert;
