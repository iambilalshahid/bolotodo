import { db } from '@/lib/db/client';
import { todosTable, type TodoRow } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { flow, types } from 'mobx-state-tree';
import { cancelTodoAlarm } from '@/lib/alarm/scheduler';
import { TodoModel } from './TodoModel';

export const TodosStore = types
  .model('TodosStore', {
    todos: types.array(TodoModel),
    isLoading: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get activeTodos() {
      return self.todos.filter((t) => !t.isCompleted);
    },
    get completedTodos() {
      return self.todos.filter((t) => t.isCompleted);
    },
    get pendingSyncCount() {
      return self.todos.filter((t) => t.needsParsing).length;
    },
  }))
  .actions((self) => {
    const loadTodos = flow(function* () {
      self.isLoading = true;
      try {
        const rows: TodoRow[] = yield db
          .select()
          .from(todosTable)
          .orderBy(desc(todosTable.createdAt));

        self.todos.clear();
        for (const r of rows) {
          self.todos.push(
            TodoModel.create({
              id: r.id,
              title: r.title,
              urduTitle: r.urduTitle,
              dueDate: r.dueDate,
              category: r.category,
              hasAlarm: r.hasAlarm,
              isCompleted: r.isCompleted,
              needsParsing: r.needsParsing,
              createdAt: r.createdAt,
            })
          );
        }
      } catch (error) {
        console.error('Failed to load todos from DB:', error);
      } finally {
        self.isLoading = false;
      }
    });

    const addTodo = flow(function* (todoData: {
      id: string;
      title: string;
      urduTitle: string;
      dueDate: string | null;
      category?: string;
      hasAlarm?: boolean;
      needsParsing?: boolean;
    }) {
      const effectiveTitle = todoData.title || todoData.urduTitle || 'Voice Reminder';
      const effectiveUrdu = todoData.urduTitle || todoData.title || 'Voice Reminder';
      const now = new Date().toISOString();
      const newTodo = {
        id: todoData.id,
        title: effectiveTitle,
        urduTitle: effectiveUrdu,
        dueDate: todoData.dueDate ?? null,
        category: todoData.category || 'general',
        hasAlarm: todoData.hasAlarm ?? false,
        isCompleted: false,
        needsParsing: todoData.needsParsing ?? false,
        createdAt: now,
      };

      // 1. Optimistic MST store update
      self.todos.unshift(newTodo);

      // 2. Safe parameterized SQLite insert via Drizzle
      yield db.insert(todosTable).values(newTodo);
    });

    const toggleTodo = flow(function* (id: string) {
      const item = self.todos.find((t) => t.id === id);
      if (!item) return;

      item.toggleComplete();
      yield db
        .update(todosTable)
        .set({ isCompleted: item.isCompleted })
        .where(eq(todosTable.id, id));
    });

    const deleteTodo = flow(function* (id: string) {
      const index = self.todos.findIndex((t) => t.id === id);
      if (index !== -1) {
        self.todos.splice(index, 1);
        yield db.delete(todosTable).where(eq(todosTable.id, id));
        cancelTodoAlarm(id).catch(() => {});
      }
    });

    return {
      loadTodos,
      addTodo,
      toggleTodo,
      deleteTodo,
    };
  });