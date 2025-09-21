import User from './user.model';
import generateToken from '../../utils/generateToken';

class UserServices {
  private model = User;

  // register new user
  async register(payload: any) {
    const user = await this.model.create(payload);

    const token = generateToken({ _id: user._id, email: user.email });
    return { token, user };
  }
}

const userServices = new UserServices();
export default userServices;
