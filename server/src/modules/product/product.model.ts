import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const productSchema = new Schema<IProduct>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    seller: { type: Schema.Types.ObjectId, required: true, ref: 'Seller' },
    category: { type: Schema.Types.ObjectId, required: true, ref: 'category' },
    name: { type: String, required: true },
    size: { type: String, enum: ['SMALL', 'MEDIUM', 'LARGE'] },
    brand: { type: Schema.Types.ObjectId, ref: 'brand' },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String },
    sku: { type: String, required: true, uppercase: true, trim: true },
    barcode: { type: String, trim: true },
    lowStockThreshold: { type: Number, default: 10, min: 0 }
  },
  { timestamps: true }
);

// SKU is unique per workspace (per user). Barcode is unique per workspace when present.
productSchema.index({ user: 1, sku: 1 }, { unique: true });
productSchema.index(
  { user: 1, barcode: 1 },
  { unique: true, partialFilterExpression: { barcode: { $type: 'string' } } }
);

const Product = model<IProduct>('product', productSchema);
export default Product;
