import httpStatus from 'http-status';
import asyncHandler from '../../lib/asyncHandler';
import sendResponse from '../../lib/sendResponse';
import saleServices from './sale.services';

class SaleControllers {
  services = saleServices;

  /**
   * create new sale
   */
  create = asyncHandler(async (req, res) => {
    const result = await this.services.create(req.body, req.user._id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'sale created successfully!',
      data: result
    });
  });
}

const saleControllers = new SaleControllers();
export default saleControllers;
