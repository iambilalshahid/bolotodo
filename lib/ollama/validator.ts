import { z } from 'zod';

export const ParsedTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .describe('Action-oriented English todo title'),
  urduTitle: z
    .string()
    .describe('Original or normalized Roman Urdu transcription text'),
  dueDate: z
    .string()
    .nullable()
    .describe('ISO 8601 formatted datetime string if user specified a time/date, else null'),
  hasAlarm: z
    .boolean()
    .default(false)
    .describe('True if a reminder/alarm is appropriate based on date/time mentioned'),
  category: z
    .enum(['personal', 'work', 'fitness', 'health', 'finance', 'shopping', 'general'])
    .default('general')
    .describe('Appropriate category for this reminder'),
});

export type ParsedTodoResult = z.infer<typeof ParsedTodoSchema>;

export function validateParsedTodo(rawJson: unknown): ParsedTodoResult {
  return ParsedTodoSchema.parse(rawJson);
}