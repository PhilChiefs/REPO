export function nozzleNumberFromPsiLpm(psi: number, lpm: number): number {
  if (psi <= 0 || lpm <= 0) throw new Error("psi and lpm must be > 0");
  return 16.7077 * lpm / Math.sqrt(psi);
}

export function pickNearestTip(n: number, tips: number[]): number {
  const sorted = [...tips].sort((a,b)=>a-b);
  return sorted.reduce((best,t)=>Math.abs(t-n)<Math.abs(best-n)?t:best, sorted[0]);
}

// Given chosen tip size N_tip and LPM, what PSI would the pump see?
// (kept here if you later want to re-enable warnings)
// PSI = (16.7077*LPM / N_tip)^2
export function psiFromTip(lpm: number, tipSize: number): number {
  const x = 16.7077 * lpm / tipSize;
  return x * x;
}
