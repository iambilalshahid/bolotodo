import { types } from 'mobx-state-tree';

export const TodoModel = types
  .model('TodoModel', {
    id: types.identifier,
    title: types.optional(types.string, 'Voice Reminder'),
    urduTitle: types.optional(types.string, 'Voice Reminder'),
    dueDate: types.maybeNull(types.string),
    category: types.optional(types.string, 'general'),
    hasAlarm: types.optional(types.boolean, false),
    isCompleted: types.optional(types.boolean, false),
    needsParsing: types.optional(types.boolean, false),
    createdAt: types.optional(types.string, () => new Date().toISOString()),
  })
  .actions((self) => ({
    toggleComplete() {
      self.isCompleted = !self.isCompleted;
    },
    updateDetails(title: string, dueDate: string | null, category: string) {
      self.title = title;
      self.dueDate = dueDate;
      self.category = category;
      self.needsParsing = false;
    },
  }));