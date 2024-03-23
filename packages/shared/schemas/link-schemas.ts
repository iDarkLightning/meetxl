import { z } from "zod";

// Generic

export const applyLinkSchema = z.object({
  code: z.string().length(6),
});

// Attribute Links

export const createAttributeLinkShema = z.object({
  attributeName: z.string(),
  value: z.string().transform((v) => parseInt(v)),
  name: z.string(),
  action: z.string(),
});
