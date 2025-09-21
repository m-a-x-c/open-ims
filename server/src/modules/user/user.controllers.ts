import httpStatus from 'http-status';
import asyncHandler from '../../lib/asyncHandler';
import sendResponse from '../../lib/sendResponse';
import userServices from './user.services';

class UserControllers {
  private services = userServices;

  // register new account
  register = asyncHandler(async (req, res) => {
    const result = await this.services.register(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'User registered successfully!',
      data: result
    });
  });
}

const userControllers = new UserControllers();
export default userControllers;
