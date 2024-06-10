import { z } from "zod";

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  created_at: z.string().datetime(),
  connection_params: z.object({
    im: z.object({
      id: z.string(),
      username: z.string(),
      premiumFeatures: z.array(z.string()),
      premiumContractId: z.string().optional(),
    }),
  }),
  sources: z.array(z.object({
    id: z.string(),
    status: z.string(),
  })),
  groups: z.array(z.unknown()),
});

export type Account = z.infer<typeof accountSchema>;
