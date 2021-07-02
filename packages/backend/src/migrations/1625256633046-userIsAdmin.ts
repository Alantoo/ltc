import { model } from '../migrations-utils';
import { UserDocument, UserSchema } from '../dals/schemas';

export const up = async () => {
  const User = model<UserDocument>('users', UserSchema);
  await User.updateMany({}, { $set: { isAdmin: false } });
  await User.updateMany(
    {
      email: 'admin@evg-soft.com',
    },
    { $set: { isAdmin: true } },
  );
};

export const down = async () => {
  //
};
