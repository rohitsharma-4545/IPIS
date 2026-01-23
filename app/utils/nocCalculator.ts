export function calculateNOC(ccd: string): number {
  if (!ccd) return 0;

  return ccd
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean).length;
}
