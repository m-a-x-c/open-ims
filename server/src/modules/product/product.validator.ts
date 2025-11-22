import { z } from 'zod';

const createSchema = z.object({
  name: z.string(),
  seller: z.string(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
  category: z.string(),
  brand: z.string().optional(),
  price: z.number().min(1, { message: 'Must be grater than 1!' }),
  stock: z.number().min(1, { message: 'Must be grater than 1!' })
});

const productValidator = { createSchema };
export default productValidator;
