import { z } from 'zod';

const envSchema = z.object({
    OCTOKIT_TOKEN: z.string().min(1),
})

export const env = envSchema.parse(process.env);