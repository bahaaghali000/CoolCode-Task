import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Task } from './Task.schema';

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ trim: true, required: true })
  fullname: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({
    default:
      'https://res.cloudinary.com/dtvbuahbi/image/upload/v1705673678/instagram/lbhpwzmijlqxo39vv4ny.jpg',
  })
  avatarUrl?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  tasks?: Task[];
}

export const UserSchema = SchemaFactory.createForClass(User);
