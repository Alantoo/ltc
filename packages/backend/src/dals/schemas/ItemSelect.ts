import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { RotatorItem } from './RotatorItem';

export type ItemSelectDocument = ItemSelect & Document;

export type RawItemSelectDocument = LeanDocument<ItemSelectDocument>;

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
export class ItemSelect extends Document {
  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: RotatorItem.name,
  })
  parentId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: RotatorItem.name,
  })
  childId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number })
  index: number;

  @Prop({ type: Boolean, default: false })
  isPaid: boolean;

  @Prop({ type: String })
  payType: string;

  @Prop({ type: String })
  payAddress: string;

  @Prop({ type: Number })
  payAmount: number;

  @Prop({ type: String })
  payTx: string;
}

export class ItemSelectCreateDto extends PickType(ItemSelect, [
  'parentId',
  'childId',
  'index',
]) {}

export const ItemSelectSchema = SchemaFactory.createForClass(ItemSelect);
