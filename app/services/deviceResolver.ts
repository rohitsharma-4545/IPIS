export function resolveDeviceTypeFromIP(ip: string): string {
  const parts = ip.split(".");
  if (parts.length !== 4) return "UNKNOWN";

  const last = Number(parts[3]);

  if (last >= 101 && last <= 130) return "MLD";
  if (last >= 131 && last <= 160) return "AGD";
  if (last >= 161 && last <= 190) return "PFD";
  if (last >= 2 && last <= 30) return "CGD";

  console.warn("⚠️ Unknown device IP range:", ip);
  return "UNKNOWN";
}
