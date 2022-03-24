import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';

export type UserDocument = User & Document;

export type RawUserDocument = LeanDocument<UserDocument>;

const options: SchemaOptions = {
  timestamps: true,
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

  @Prop({ type: Boolean, default: false })
  isAdmin: boolean;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String })
  firstName: string;

  @ApiProperty()
  @Prop({ type: String })
  lastName: string;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ type: String })
  btcAddress: string;

  @ApiProperty()
  @Prop()
  isVerified: boolean;

  @Prop()
  isBlocked: boolean;

  @Prop()
  code: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  refer: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty()
  @Prop({ type: Date })
  updatedAt: Date;
}

export class UserCreateDto extends PickType(User, [
  'email',
  'password',
  'name',
  'firstName',
  'lastName',
  'btcAddress',
]) {}

export class UserUpdateDto extends PickType(User, ['name', 'btcAddress']) {}

export const UserSchema = SchemaFactory.createForClass(User);
