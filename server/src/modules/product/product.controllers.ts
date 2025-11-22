import httpStatus from 'http-status';
import asyncHandler from '../../lib/asyncHandler';
import sendResponse from '../../lib/sendResponse';
import productServices from './product.services';

class ProductControllers {
  services = productServices;

  /**
   * create new product
   */
  create = asyncHandler(async (req, res) => {
    const result = await this.services.create(req.body, req.user._id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Product created successfully!',
      data: result
    });
  });
}

const productControllers = new ProductControllers();
export default productControllers;
