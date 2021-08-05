import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from './User';
import { List } from './List';

export type PayOutDocument = PayOut & Document;

export type RawPayOutDocument = LeanDocument<PayOutDocument>;

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
export class PayOut extends Document {
  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: Number })
  rates: number;

  @Prop({ type: Number })
  amountEth: number;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: String })
  tx: string;
}

export class PayOutCreateDto extends PickType(PayOut, [
  'userId',
  'amount',
  'address',
  'status',
]) {}

export const PayOutSchema = SchemaFactory.createForClass(PayOut);
