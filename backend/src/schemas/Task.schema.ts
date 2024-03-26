import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';
import { TaskStatus } from 'src/tasks/task-status.enum';

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  startDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: string;

  @Prop({ default: TaskStatus.OPEN })
  status: TaskStatus;

  @Prop()
  category: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: User[];

  @Prop({ default: false })
  reminderSent: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
