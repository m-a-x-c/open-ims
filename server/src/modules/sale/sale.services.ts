/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import BaseServices from '../baseServices';
import Sale from './sale.model';
import Product from '../product/product.model';
import CustomError from '../../errors/customError';

class SaleServices extends BaseServices<any> {
  constructor(model: any, modelName: string) {
    super(model, modelName);
  }

  /**
   * Create new sale and decrease product stock
   */
  async create(payload: any, userId: string) {
    const { productPrice, quantity } = payload;
    payload.user = userId;
    payload.totalPrice = productPrice * quantity;
    const product = await Product.findById(payload.product);

    if (quantity > product!.stock) {
      throw new CustomError(400, `${quantity} product are not available in stock!`);
    }
    let result: any[];
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      await Product.findByIdAndUpdate(product?._id, { $inc: { stock: -quantity } }, { session });
      result = await this.model.create([payload], { session });
      await session.commitTransaction();

      return result;
    } catch (error) {
      await session.abortTransaction();
      throw new CustomError(400, 'Sale create failed');
    } finally {
      await session.endSession();
    }
  }
}

const saleServices = new SaleServices(Sale, 'modelName');
export default saleServices;
