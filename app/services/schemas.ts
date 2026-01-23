import { z } from "zod";

/* ---------- COMMON ---------- */
const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$|^--:--$/;
const TIME_HHMMSS = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

/* ---------- TRAIN (Page 55) ---------- */
export const CdcTrainSchema = z.object({
  TNO: z.string().regex(/^\d{5}$/, "TNO must be 5 digits"),

  TNE: z.string().max(50),
  TNH: z.string().max(50),
  TNR: z.string().max(50).optional(),

  ADF: z.enum(["A", "D"]),

  EAT: z.string().regex(TIME_HHMM),
  EDT: z.string().regex(TIME_HHMM),

  PNO: z.string().regex(/^(\d{1,3}|- -)$/),

  STA: z.string().min(1), // includes 0x01 OR multilingual status

  CCD: z.string().min(1), // CSV validated at CDC side

  COL: z.array(z.string().regex(/^[0-9A-Fa-f]{6}$/)),
});

/* ---------- LINE CONFIG (Page 55) ---------- */
export const CdcLineConfigSchema = z.object({
  INT: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]),

  PTO: z.number().min(10).max(120).multipleOf(10),

  DTP: z.number().min(60).max(240).multipleOf(30),

  CHR: z.number().min(0x00).max(0x05),

  EFF: z.number().min(0x00).max(0x09),

  SPD: z.number().min(0x00).max(0x05),

  MSG: z.string().optional(),

  MST: z.enum(["Default", "Normal"]).optional(),

  TOD: z.string().regex(TIME_HHMMSS),

  RST: z.enum(["Y", "N"]),

  VID: z.string().optional(),
  IMG: z.string().optional(),
});

/* ---------- CDC RESPONSE ---------- */
export const CdcResponseSchema = z.object({
  TrainList: z.array(CdcTrainSchema),
  LineConf: z.array(CdcLineConfigSchema).length(1),
});
