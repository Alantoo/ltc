import { Document, LeanDocument } from 'mongoose';
import { Prop, Schema, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ListDocument = List & Document;

export type RawListDocument = LeanDocument<ListDocument>;

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
export class List extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  price: number;

  @ApiProperty()
  @Prop({ type: Number, default: 6 })
  selectCount: number;

  @ApiProperty()
  @Prop({ type: String, default: '60d' })
  rotateTime: string;
}

export const ListSchema = SchemaFactory.createForClass(List);
