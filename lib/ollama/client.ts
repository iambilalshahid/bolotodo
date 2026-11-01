import { getOllamaSystemPrompt } from './prompt';
import { validateParsedTodo, type ParsedTodoResult } from './validator';

export interface CloudAIConfig {
  apiKey?: string;
  model?: string;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Returns current local time with explicit ISO offset (+05:00 for PKT)
 */
function getLocalIsoAndOffset() {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const tzStr = `${sign}${pad(offset / 60)}:${pad(offset % 60)}`;

  const localIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${tzStr}`;

  return { localIso, tzStr };
}

export async function parseUrduWithCloudAI(
  romanUrduText: string,
  config?: CloudAIConfig
): Promise<ParsedTodoResult> {
  const apiKey = config?.apiKey || process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
  const model = config?.model || process.env.EXPO_PUBLIC_AI_MODEL || 'openai/gpt-oss-20b';

  if (!apiKey) {
    throw new Error('Groq API Key missing. Please set EXPO_PUBLIC_GROQ_API_KEY in .env');
  }

  const { localIso, tzStr } = getLocalIsoAndOffset();
  const systemPrompt = getOllamaSystemPrompt(localIso, tzStr);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Spoken Reminder: "${romanUrduText}"` },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloud AI returned status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';

    // Parse JSON safely even if wrapped in markdown codeblock
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    const parsedObj = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawContent);

    return validateParsedTodo(parsedObj);
  } finally {
    clearTimeout(timeoutId);
  }
}