import { parseUrduWithCloudAI } from '@/lib/ollama/client';
import type { ParsedTodoResult } from '@/lib/ollama/validator';
import { QUERY_KEYS } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';

export function useParseTodoMutation() {
  return useMutation<ParsedTodoResult, Error, string>({
    mutationKey: QUERY_KEYS.parseTodo,
    mutationFn: async (romanUrduText: string) => {
      return parseUrduWithCloudAI(romanUrduText);
    },
    retry: 1,
  });
}