export const PSI_PER_BAR = 14.5037738;
export const LPM_PER_GPM = 3.785411784;

export function toPSI(value: number, unit: "psi"|"bar"): number {
  return unit === "psi" ? value : value * PSI_PER_BAR;
}
export function toLPM(value: number, unit: "lpm"|"gpm"): number {
  return unit === "lpm" ? value : value * LPM_PER_GPM;
}
