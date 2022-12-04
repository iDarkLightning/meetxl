import { z } from "zod";

export const createOrgSchema = z.object({ name: z.string().min(2).max(64) });

export const createAttributeSchema = z.object({ name: z.string() });
