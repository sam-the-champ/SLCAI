import type { MoodEntry, TriageLevel } from './types'

const KEY = 'solace_journal'

export function getEntries(): MoodEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveEntry(triageLevel: TriageLevel, note: string): MoodEntry {
  const entry: MoodEntry = {
    id: crypto.randomUUID(),
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    triageLevel,
    note,
    timestamp: Date.now(),
  }
  const entries = getEntries()
  entries.unshift(entry)
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 30)))
  return entry
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter(e => e.id !== id)
  localStorage.setItem(KEY, JSON.stringify(entries))
}