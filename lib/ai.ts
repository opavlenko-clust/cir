// lib/ai.ts
import OpenAI from 'openai'

let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY ?? 'missing',
      defaultHeaders: {
        'HTTP-Referer': `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME,
      },
    })
  }
  return _client
}

// Proxy so existing `ai.chat.completions.create(...)` calls keep working
export const ai = {
  get chat() { return getClient().chat },
}

// Моделі для різних задач
export const MODELS = {
  fast: 'anthropic/claude-3.5-haiku',    // Швидко, дешево
  smart: 'anthropic/claude-sonnet-4.6',  // Складні задачі
  vision: 'anthropic/claude-sonnet-4.6', // Аналіз зображень
  code: 'anthropic/claude-sonnet-4.6',   // Генерація коду
}

// Базова функція з fallback
export async function generateText({
  prompt,
  system,
  model = MODELS.smart,
  maxTokens = 1000,
}: {
  prompt: string
  system?: string
  model?: string
  maxTokens?: number
}) {
  try {
    const response = await ai.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [
        ...(system ? [{ role: 'system' as const, content: system }] : []),
        { role: 'user' as const, content: prompt },
      ],
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    // Fallback на дешевшу модель
    if (model === MODELS.smart) {
      return generateText({ prompt, system, model: MODELS.fast, maxTokens })
    }
    throw error
  }
}
