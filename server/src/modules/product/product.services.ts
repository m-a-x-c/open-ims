/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import BaseServices from '../baseServices';
import Product from './product.model';
import CustomError from '../../errors/customError';
import Purchase from '../purchase/purchase.model';
import Seller from '../seller/seller.model';
import { IProduct } from './product.interface';

class ProductServices extends BaseServices<any> {
  constructor(model: any, modelName: string) {
    super(model, modelName);
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
}

const productServices = new ProductServices(Product, 'Product');
export default productServices;
