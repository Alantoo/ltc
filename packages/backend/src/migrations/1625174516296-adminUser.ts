import { encodePass, model } from '../migrations-utils';
import { UserDocument, UserSchema } from '../dals/schemas';

export const up = async () => {
  const User = model<UserDocument>('users', UserSchema);
  const cur = await User.findOne({
    email: process.env.ADMIN_EMAIL,
  });
  if (!cur) {
    const user = new User({
      email: process.env.ADMIN_EMAIL,
      password: encodePass(process.env.ADMIN_PASSWORD),
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
