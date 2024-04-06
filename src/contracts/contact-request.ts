import { z } from 'zod';

export const contactRequestSchema = z.object({
  fullName: z.string().trim(),
  emailAddress: z.string().trim().email(),
  message: z.string().trim().min(80).max(1000),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
