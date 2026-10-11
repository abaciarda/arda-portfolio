import { z } from 'zod';

const envSchema = z.object({
    OCTOKIT_TOKEN: z.string().optional(),
})

export const env = envSchema.parse(process.env);
