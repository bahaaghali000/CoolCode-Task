import { TaskStatus } from '../task-status.enum';

export class CreateTaskDto {
  title: string;
  description: string;
  category: string;
  status: TaskStatus;
  authorId: string;
  startDate: Date;
  endDate: Date;
  members: string[];
}
