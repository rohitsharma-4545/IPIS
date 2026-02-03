import { z } from "zod";

const IP_REGEX =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export const LiveDataSchema = z.object({
  vendor: z.string().min(1),
  device: z.enum(["MLD", "PFD", "AGD", "CGD"]),
  ip: z.string().regex(IP_REGEX, "Invalid IP Address"),
  pf: z.string().min(1),
  pno: z.number().int().nonnegative().optional(),
  int: z.number().int().nonnegative(),
  hsr: z.string().min(1),
});

export const ConfDataSchema = z.object({
  vendor: z.string().min(1),
  device: z.enum(["MLD", "PFD", "AGD", "CGD"]),
  ip: z.string().regex(IP_REGEX, "Invalid IP Address"),
});
