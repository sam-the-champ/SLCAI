export type TriageLevel = 'low' | 'moderate' | 'high' | 'crisis'

export interface Assessment {
  triageLevel: TriageLevel
  summary: string
  patterns: string[]
  strategies: string[]
  affirmation: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface MoodEntry {
  id: string
  date: string
  triageLevel: TriageLevel
  note: string
  timestamp: number
}