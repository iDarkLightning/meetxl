import { AttributeModifierAction } from "@prisma/client";
import { z } from "zod";

export const updateMeetingSchema = z.object({
  name: z.string(),
  location: z.string(),
  startTime: z.string().transform((d) => new Date(d)),
  endTime: z.string().transform((d) => new Date(d)),
});

export const createMeetingSchema = z.object({
  name: z.string(),
  startTime: z.string().transform((d) => new Date(d)),
  endTime: z.string().transform((d) => new Date(d)),
});

export const updateParticipantLimitSchema = z.object({
  limit: z.string().transform((v) => parseInt(v)),
});

export const createMeetingRewardSchema = z.object({
  key: z.string(),
  value: z.string().transform((v) => parseInt(v)),
  action: z.nativeEnum(AttributeModifierAction),
});
