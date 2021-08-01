import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from './User';
import { List } from './List';

export type PaySelectDocument = PaySelect & Document;

export type RawPaySelectDocument = LeanDocument<PaySelectDocument>;

const options: SchemaOptions = {
  timestamps: true,
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
export class PaySelect extends Document {
  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  fromUserId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: List.name,
  })
  listId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number })
  amount: number;
}

export class PaySelectCreateDto extends PickType(PaySelect, [
  'userId',
  'fromUserId',
  'listId',
  'amount',
]) {}

export const PaySelectSchema = SchemaFactory.createForClass(PaySelect);
