import * as z from 'zod';

const UserSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  rate: z.optional(z.number()),
  email: z.string().email(),
  createdAt: z.string(z.date()),
  updatedAt: z.string(z.date()),
  deletedAt: z.optional(z.string(z.date())),
});

export type User = z.infer<typeof UserSchema>;
