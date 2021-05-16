import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { Document, LeanDocument } from 'mongoose';

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
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop()
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
