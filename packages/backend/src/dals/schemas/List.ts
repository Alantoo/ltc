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
}

export const ListSchema = SchemaFactory.createForClass(List);
