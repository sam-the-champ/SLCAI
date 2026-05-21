import type { Assessment, Message } from './types'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemma-4-31b-it'

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!key) throw new Error('Missing VITE_OPENROUTER_API_KEY')
  return key
}

export async function assessMood(userMessage: string): Promise<Assessment> {
  const systemPrompt = `You are Solace, a compassionate mental health first responder. 
You listen deeply, validate without judgment, and connect people to real help.
You are NOT a therapist or doctor. You are a warm, safe first point of contact.

Analyze the user's message and respond ONLY with valid JSON in this exact format:
{
  "triageLevel": "low" | "moderate" | "high" | "crisis",
  "summary": "A warm 2-3 sentence reflection of what you heard",
  "patterns": ["pattern 1", "pattern 2", "pattern 3"],
  "strategies": ["grounding strategy 1", "strategy 2", "strategy 3"],
  "affirmation": "A single genuine, personal affirmation for this person"
}

Triage levels:
- low: mild everyday stress, general worry
- moderate: persistent sadness, sleep issues, social withdrawal, low mood
- high: panic attacks, trauma symptoms, major crisis, inability to function
- crisis: suicidal ideation, self-harm, immediate danger

Respond ONLY with the JSON object. No preamble, no explanation.`

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Solace Mental Health',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 600,
    }),
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()
  const text = data.choices[0].message.content.trim()
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as Assessment
}

export async function chat(messages: Message[], triageLevel: string): Promise<string> {
  const isCrisis = triageLevel === 'crisis'

  const systemPrompt = isCrisis
    ? `You are Solace, a compassionate mental health companion. 
This person may be in CRISIS. Every response must:
1. Acknowledge their pain with genuine warmth
2. Strongly encourage them to call a crisis line or emergency services immediately
3. Stay present and calm — never lecture or panic
4. Keep responses short and grounding
You are not a replacement for professional help. You are a bridge to it.`
    : `You are Solace, a compassionate mental health companion.
You listen deeply, validate feelings, and offer gentle evidence-based coping strategies.
Keep responses warm, human, and concise (2-4 paragraphs max).
Never diagnose. Never minimize. Always validate before advising.
Remind the user you are an AI and encourage professional support when appropriate.`

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getApiKey()}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Solace Mental Health',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)
  const data = await response.json()
  return data.choices[0].message.content.trim()
}