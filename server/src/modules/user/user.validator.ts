import { z } from 'zod';

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6, { message: 'password must have 6 characters' })
});

const userValidator = { registerSchema };
export default userValidator;
