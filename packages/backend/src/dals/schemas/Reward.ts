import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from './User';
import { List } from './List';

export type RewardDocument = Reward & Document;

export type RawRewardDocument = LeanDocument<RewardDocument>;

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
export class Reward extends Document {
  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: List.name,
  })
  listId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  toUserId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  fromUserId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: String })
  payType: string;

  @ApiProperty()
  @Prop({ type: String })
  payAddress: string;

  @ApiProperty()
  @Prop({ type: Number })
  payAmount: number;

  @ApiProperty()
  @Prop({ type: String })
  payTx: string;

  @ApiProperty()
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty()
  @Prop({ type: Date })
  updatedAt: Date;
}

export class RewardCreateDto extends PickType(Reward, [
  'listId',
  'toUserId',
  'fromUserId',
  'payType',
  'payAddress',
  'payAmount',
  'payTx',
]) {}

export const RewardSchema = SchemaFactory.createForClass(Reward);
