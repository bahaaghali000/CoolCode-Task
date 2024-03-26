export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  avatarUrl: string;
  tasks?: Task[];
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  author: string;
  status: TaskStatus;
  category: string;
  members: User[];
  reminderSent: boolean;
}

export enum TaskStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}
