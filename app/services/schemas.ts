import { z } from "zod";

/* ------------------ Regex ------------------ */

const TIME_HHMM = /^((([01]\d|2[0-3]):[0-5]\d)|--:--)$/;

const TIME_HHMMSS = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

const IP_REGEX =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

/* ------------------ Train Schema ------------------ */

export const CdcTrainSchema = z.object({
  TNO: z
    .string()
    .regex(/^\d{5}$/)
    .catch("00000"),

  TNE: z.string().max(50).catch(""),

  TNH: z.string().max(50).catch(""),

  TNR: z.string().max(50).optional().catch(""),

  ADF: z.enum(["A", "D"]).catch("A"),

  EAT: z
    .union([z.string().regex(TIME_HHMM), z.literal("")])
    .optional()
    .catch(""),

  EDT: z
    .union([z.string().regex(TIME_HHMM), z.literal("")])
    .optional()
    .catch(""),

  PNO: z
    .string()
    .regex(/^(\d{1,3}|--)$/)
    .catch("1"),

  STA: z.string().min(1).catch(""),

  CCD: z.string().min(1).catch(""),
});

/* ------------------ Line Config Schema ------------------ */

export const CdcLineConfigSchema = z.object({
  INT: z
    .union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)])
    .catch(25),

  PTO: z.number().min(10).max(120).multipleOf(10).catch(10),

  DTO: z.number().min(60).max(240).multipleOf(30).catch(0),

  CHR: z.number().int().nonnegative().catch(3),

  EFF: z.number().int().nonnegative().catch(5),

  SPD: z.number().int().nonnegative().catch(3),

  MSG: z.string().optional().catch(""),

  MST: z.enum(["Default", "Normal"]).optional().catch("Default"),

  TOD: z.string().regex(TIME_HHMMSS).catch("00:00:00"),

  RST: z.enum(["Y", "N"]).catch("N"),
});

/* ------------------ CDC Main Response ------------------ */

export const CdcResponseSchema = z.object({
  TrainList: z.array(CdcTrainSchema).catch([]),

  LineConf: z
    .array(CdcLineConfigSchema)
    .length(1)
    .catch([
      {
        INT: 25,
        PTO: 10,
        DTO: 0,
        CHR: 3,
        EFF: 5,
        SPD: 3,
        MSG: "",
        MST: "Default",
        TOD: "00:00:00",
        RST: "N",
      },
    ]),
});

/* ------------------ Device Schema ------------------ */

export const CdcConfigDeviceSchema = z.object({
  IP: z.string().regex(IP_REGEX).catch("0.0.0.0"),

  INT: z
    .union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)])
    .catch(25),

  PNO: z.number().int().nonnegative().catch(1),
});

/* ------------------ CDC Config Response ------------------ */

export const CdcConfigResponseSchema = z.object({
  DeviceList: z
    .tuple([
      z.object({
        NOD: z.number().int().nonnegative(),
      }),
    ])
    .rest(CdcConfigDeviceSchema)
    .catch([{ NOD: 0 }]),

  DevConf: z
    .array(
      z.object({
        TOD: z.string().regex(TIME_HHMMSS).catch("00:00:00"),

        RST: z.enum(["Y", "N"]).catch("N"),
      }),
    )
    .length(1)
    .catch([
      {
        TOD: "00:00:00",
        RST: "N",
      },
    ]),
});
