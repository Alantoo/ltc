import { Document, LeanDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from './User';
import { List } from './List';

export type RotatorItemDocument = RotatorItem & Document;

export type RawRotatorItemDocument = LeanDocument<RotatorItemDocument>;

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
export class RotatorItem extends Document {
  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: List.name })
  listId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: User.name })
  userId: MongooseSchema.Types.ObjectId;

  @ApiProperty()
  @Prop([
    { type: MongooseSchema.Types.ObjectId, required: true, ref: User.name },
  ])
  selected: Array<MongooseSchema.Types.ObjectId>;

  @Prop()
  status: string;
}

export class RotatorItemCreateDto extends PickType(RotatorItem, []) {
  listId: string;
  userId: string;
}

export const RotatorItemSchema = SchemaFactory.createForClass(RotatorItem);
