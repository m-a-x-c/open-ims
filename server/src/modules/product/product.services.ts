/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import sortAndPaginatePipeline from '../../lib/sortAndPaginate.pipeline';
import BaseServices from '../baseServices';
import Product from './product.model';
import matchStagePipeline from './product.aggregation.pipeline';
import CustomError from '../../errors/customError';
import Purchase from '../purchase/purchase.model';
import Seller from '../seller/seller.model';
import { IProduct } from './product.interface';

class ProductServices extends BaseServices<any> {
  constructor(model: any, modelName: string) {
    super(model, modelName);
  }

  /**
   * Generate a unique SKU for this user. Format: SKU-XXXXXX (6 alphanumeric).
   * Skips visually ambiguous characters (I, O, 1, 0). Retries on collision.
   */
  private async generateSku(userId: string): Promise<string> {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let attempt = 0; attempt < 8; attempt++) {
      let suffix = '';
      for (let i = 0; i < 6; i++) {
        suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      const candidate = `SKU-${suffix}`;
      const existing = await this.model.findOne({ user: new Types.ObjectId(userId), sku: candidate });
      if (!existing) return candidate;
    }
    throw new CustomError(500, 'Failed to generate a unique SKU after 8 attempts');
  }

  /**
   * Create new product
   */
  async create(payload: IProduct, userId: string) {
    type str = keyof IProduct;
    (Object.keys(payload) as str[]).forEach((key: str) => {
      if (payload[key] === '') {
        delete payload[key];
      }
    });

    if (!payload.sku) {
      payload.sku = await this.generateSku(userId);
    } else {
      payload.sku = payload.sku.toUpperCase();
    }

    payload.user = new Types.ObjectId(userId);
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const seller = await Seller.findById(payload.seller);
      const product: any = await this.model.create([payload], { session });

      await Purchase.create(
        [
          {
            user: userId,
            seller: product[0]?.seller,
            product: product[0]?._id,
            sellerName: seller?.name,
            productName: product[0]?.name,
            quantity: product[0]?.stock,
            unitPrice: product[0]?.price,
            totalPrice: product[0]?.stock * product[0]?.price
          }
        ],
        { session }
      );

      await session.commitTransaction();

      return product;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw new CustomError(400, 'Product create failed');
    } finally {
      await session.endSession();
    }
  }

  /**
   * Count Total Product
   */
  async countTotalProduct(userId: string) {
    return this.model.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$stock' }
        }
      },
      {
        $project: {
          totalQuantity: 1,
          _id: 0
        }
      }
    ]);
  }

  /**
   * Get All product of user
   */
  async readAll(query: Record<string, unknown> = {}, userId: string) {
    let data = await this.model.aggregate([...matchStagePipeline(query, userId), ...sortAndPaginatePipeline(query)]);

    const totalCount = await this.model.aggregate([
      ...matchStagePipeline(query, userId),
      {
        $group: {
          _id: null,
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ]);

    data = await this.model.populate(data, { path: 'category', select: '-__v -user' });
    data = await this.model.populate(data, { path: 'brand', select: '-__v -user' });
    data = await this.model.populate(data, { path: 'seller', select: '-__v -user -createdAt -updatedAt' });

    return { data, totalCount };
  }

  /**
   * Get Single product of user
   */
  async read(id: string, userId: string) {
    await this._isExists(id);
    return this.model.findOne({ user: new Types.ObjectId(userId), _id: id });
  }

  /**
   * Get products at or below their low-stock threshold (default 10 when unset).
   * Sorted by lowest stock first. Limit defaults to 50, capped at 200.
   */
  async getLowStock(userId: string, limit = 50) {
    return this.model.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId),
          $expr: { $lte: ['$stock', { $ifNull: ['$lowStockThreshold', 10] }] }
        }
      },
      { $sort: { stock: 1 } },
      { $limit: Math.max(1, Math.min(200, limit)) },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
    ]);
  }

  /**
   * Count products at or below their low-stock threshold.
   */
  async countLowStock(userId: string) {
    const result = await this.model.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId),
          $expr: { $lte: ['$stock', { $ifNull: ['$lowStockThreshold', 10] }] }
        }
      },
      { $count: 'total' }
    ]);
    return result[0]?.total || 0;
  }

  /**
   * Find product by SKU or barcode. Used for scan-to-sell flows.
   */
  async findByCode(code: string, userId: string) {
    const trimmed = code.trim();
    if (!trimmed) {
      throw new CustomError(400, 'Code is required');
    }
    const product = await this.model
      .findOne({
        user: new Types.ObjectId(userId),
        $or: [{ barcode: trimmed }, { sku: trimmed.toUpperCase() }]
      })
      .populate('category', '-__v -user')
      .populate('brand', '-__v -user')
      .populate('seller', '-__v -user -createdAt -updatedAt');

    if (!product) {
      throw new CustomError(404, `No product found with code "${trimmed}"`);
    }
    return product;
  }

  /**
   * Multiple delete
   */
  async bulkDelete(payload: string[]) {
    const data = payload.map((item) => new Types.ObjectId(item));

    return this.model.deleteMany({ _id: { $in: data } });
  }

  /**
   * Create new product
   */
  async addToStock(id: string, payload: Pick<IProduct, 'seller' | 'stock'>, userId: string) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const seller = await Seller.findById(payload.seller);
      const product: any = await this.model.findByIdAndUpdate(id, { $inc: { stock: payload.stock } }, { session });

      await Purchase.create(
        [
          {
            user: userId,
            seller: product.seller,
            product: product._id,
            sellerName: seller?.name,
            productName: product.name,
            quantity: Number(product.stock),
            unitPrice: Number(product.price),
            totalPrice: Number(product.stock) * Number(product.price)
          }
        ],
        { session }
      );

      await session.commitTransaction();

      return product;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw new CustomError(400, 'Product create failed');
    } finally {
      await session.endSession();
    }
  }
}

const productServices = new ProductServices(Product, 'Product');
export default productServices;
