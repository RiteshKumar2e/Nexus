import axios from 'axios'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
// llama-3.3-70b-versatile was retired from Groq's catalog; gpt-oss-120b is
// the current flagship text model there. It's a reasoning model, so
// reasoning_effort is kept low to leave enough of max_tokens for the
// actual answer instead of being consumed by hidden reasoning tokens.
const MODEL = 'openai/gpt-oss-120b'

export async function groqChat(systemPrompt, userPrompt, { maxTokens = 400, temperature = 0.3 } = {}) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not configured')

  const { data } = await axios.post(
    GROQ_URL,
    {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature,
      reasoning_effort: 'low',
    },
    {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 15000,
    }
  )

  return data.choices?.[0]?.message?.content?.trim()
}
