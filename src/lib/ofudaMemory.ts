// Facts seen in last 48 hours are locked out
// Returns a fact the user hasn't seen recently

const STORAGE_KEY = 'ofuda_seen';
const LOCKOUT_MS = 48 * 60 * 60 * 1000; // 48 hours

interface SeenEntry {
  index: number;
  seenAt: number;
}

export function getNextFact(allFacts: string[]): { fact: string; index: number } {
  if (typeof window === 'undefined') return { fact: allFacts[0], index: 0 };
  
  const raw = localStorage.getItem(STORAGE_KEY);
  const seen: SeenEntry[] = raw ? JSON.parse(raw) : [];
  const now = Date.now();
  
  // Clear entries older than 48 hours
  const recent = seen.filter(e => now - e.seenAt < LOCKOUT_MS);
  const seenIndices = new Set(recent.map(e => e.index));
  
  // Find available facts
  const available = allFacts
    .map((_, i) => i)
    .filter(i => !seenIndices.has(i));
  
  // If all facts exhausted, reset (edge case)
  const pool = available.length > 0 ? available : allFacts.map((_, i) => i);
  
  const chosenIndex = pool[Math.floor(Math.random() * pool.length)];
  
  // Save to localStorage
  recent.push({ index: chosenIndex, seenAt: now });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  
  return { fact: allFacts[chosenIndex], index: chosenIndex };
}
