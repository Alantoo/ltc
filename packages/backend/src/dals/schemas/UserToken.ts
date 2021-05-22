import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from './User';

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
export class UserToken extends Document {
  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    unique: true,
    ref: User.name,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop()
  rememberMe: boolean;

  @Prop()
  validityTimestamp: number;
}

export class UserTokenCreateDto extends PickType(UserToken, [
  'validityTimestamp',
]) {
  userId: string;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
