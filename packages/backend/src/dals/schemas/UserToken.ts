import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { Document, LeanDocument } from 'mongoose';

export type UserTokenDocument = UserToken & Document;

export type RawUserTokenDocument = LeanDocument<UserTokenDocument>;

const options: SchemaOptions = {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
};

@Schema(options)
export class UserToken {
  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop()
  rememberMe: boolean;

  @Prop()
  validityTimestamp: number;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
