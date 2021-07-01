const confPath =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: confPath });
import * as mongoose from 'mongoose';
import { hashSync } from 'bcrypt';

mongoose.connect(process.env.DB_CONNECTION);
mongoose.connection.on('error', (err) => {
  console.log('Error in the database:', err);
});

export const encodePass = (rawPass: string): string => {
  return hashSync(rawPass, process.env.SALT);
};

export const model = mongoose.model;
