import * as z from 'zod';

const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  rate: z.optional(z.number()),
  isDefaultOrg: z.number(),
  createdAt: z.string(z.date()),
  updatedAt: z.string(z.date()),
  roles: z.array(z.enum(['OWNER', 'MEMBER'])),
});

export type Organization = z.infer<typeof OrganizationSchema>;
