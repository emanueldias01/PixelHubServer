import { z } from "zod";

export const userSchema = z.object({
  username: z.string().max(15)
});

export type LoginBody = z.infer<typeof userSchema>;

export interface User {
    username: string;
}