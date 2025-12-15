import { z } from 'zod';

const createSchema = z.object({
  product: z.string(),
  productName: z.string(),
  quantity: z.number().min(1, { message: 'Must be equal or grater than 1' }),
  productPrice: z.number().min(1, { message: 'Must be equal or grater than 1' }),
  buyerName: z.string(),
  date: z.string()
});

const saleValidator = { createSchema };
export default saleValidator;
