import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from './User';

export type UserResetPasswordTokenDocument = UserResetPasswordToken & Document;

export type RawUserResetPasswordTokenDocument =
  LeanDocument<UserResetPasswordTokenDocument>;

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
export class UserResetPasswordToken extends Document {
  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    unique: true,
    ref: User.name,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop()
  token: string;
}

export class UserResetPasswordTokenCreateDto extends PickType(
  UserResetPasswordToken,
  ['token'],
) {
  userId: string;
}

export const UserResetPasswordTokenSchema = SchemaFactory.createForClass(
  UserResetPasswordToken,
);
