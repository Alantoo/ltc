import { Document, LeanDocument } from 'mongoose';
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
      return ret;
    },
  },
};

@Schema(options)
export class User {
  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop()
  age: number;
}

export class UserUpdateDto extends PickType(User, ['age']) {}

export const UserSchema = SchemaFactory.createForClass(User);
