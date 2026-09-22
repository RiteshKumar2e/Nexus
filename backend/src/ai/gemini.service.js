import axios from 'axios'
import fs from 'fs'

// gemini-1.5-flash was retired; gemini-flash-latest always points at the
// current default Flash model so this doesn't go stale again.
const MODEL = 'gemini-flash-latest'

function endpoint() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')
  return `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`
}

export async function geminiText(systemPrompt, userPrompt) {
  const { data } = await axios.post(
    endpoint(),
    {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 400, temperature: 0.3 },
    },
    { timeout: 15000 }
  )
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
}

export async function geminiAnalyzeImage(filePath, mimeType, systemPrompt, contextText = '') {
  const base64 = fs.readFileSync(filePath, { encoding: 'base64' })

  const { data } = await axios.post(
    endpoint(),
    {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [
        {
          role: 'user',
          parts: [
            { text: contextText || 'Analyze this field evidence photo from the incident.' },
            { inlineData: { mimeType, data: base64 } },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 200, temperature: 0.2 },
    },
    { timeout: 20000 }
  )
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
}
