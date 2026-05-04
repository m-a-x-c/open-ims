import { z } from 'zod';

const skuSchema = z
  .string()
  .trim()
  .min(2, { message: 'SKU must have at least 2 characters' })
  .max(40, { message: 'SKU is too long' })
  .regex(/^[A-Za-z0-9_-]+$/, { message: 'SKU can only contain letters, numbers, dashes and underscores' });

const barcodeSchema = z
  .string()
  .trim()
  .min(4, { message: 'Barcode is too short' })
  .max(40, { message: 'Barcode is too long' });

const createSchema = z.object({
  name: z.string(),
  seller: z.string(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
  category: z.string(),
  brand: z.string().optional(),
  price: z.number().min(1, { message: 'Must be grater than 1!' }),
  stock: z.number().min(1, { message: 'Must be grater than 1!' }),
  sku: skuSchema.optional(),
  barcode: barcodeSchema.optional(),
  lowStockThreshold: z.number().int().min(0).optional()
});

const updateSchema = z.object({
  name: z.string().optional(),
  seller: z.string().optional(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().min(1, { message: 'Must be grater than 1!' }).optional(),
  stock: z.number().min(1, { message: 'Must be grater than 1!' }).optional(),
  sku: skuSchema.optional(),
  barcode: barcodeSchema.optional(),
  lowStockThreshold: z.number().int().min(0).optional()
});

const addStockSchema = z.object({
  stock: z.number().min(1, { message: 'Must be grater than 1!' })
});

const productValidator = { createSchema, updateSchema, addStockSchema };
export default productValidator;
