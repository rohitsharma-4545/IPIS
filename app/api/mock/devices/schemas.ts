import { z } from "zod";

export const CreatePdcDeviceSchema = z.object({
  vendor: z.string().min(1),
  device: z.literal("PDC"),
  ip: z.string().regex(/^(?:\d{1,3}\.){3}\d{1,3}$/, "Invalid IP address"),
  pf: z.string().min(1),
});

export const CreateDisplayDeviceSchema = z.object({
  vendor: z.string().min(1),
  device: z.enum(["MLD", "PFD", "AGD", "CGD"]),
  ip: z.string().regex(/^(?:\d{1,3}\.){3}\d{1,3}$/, "Invalid IP address"),
  pf: z.string().min(1),
  int: z.number().int().positive(),
  hsr: z.string().min(1),
});
