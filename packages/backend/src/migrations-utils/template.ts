import { encodePass, model } from '../migrations-utils';
import { UserDocument, UserSchema } from '../dals/schemas';

export const up = async () => {
  const User = model<UserDocument>('users', UserSchema);
  const cur = await User.findOne({
    email: 'admin@evg-soft.com',
  });
  if (!cur) {
    const user = new User({
      email: 'admin@evg-soft.com',
      password: encodePass('1234'),
      isVerified: true,
      name: 'Super User',
      roles: ['admins'],
    });
    await user.save();
  }
};

export const down = async () => {
  //
};
