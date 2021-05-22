import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';

export type UserDocument = User & Document;

export type RawUserDocument = LeanDocument<UserDocument>;

const options: SchemaOptions = {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.code;
      return ret;
    },
  },
};

@Schema(options)
export class User extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [String], default: [] })
  roles: string[];

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop()
  isVerified: boolean;

  @Prop()
  code: string;
}

export class UserCreateDto extends PickType(User, [
  'email',
  'password',
  'name',
]) {}

export class UserUpdateDto extends PickType(User, ['name']) {}

export const UserSchema = SchemaFactory.createForClass(User);
