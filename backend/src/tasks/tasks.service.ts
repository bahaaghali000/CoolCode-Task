import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/schemas/Task.schema';
import { FilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/schemas/user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailerService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: any): Promise<Task> {
    const {
      title,
      members,
      category,
      description,
      startDate,
      status,
      endDate,
    } = createTaskDto;

    const author = await this.userModel.findById(user._id);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    try {
      const task: any = await this.taskModel.create({
        title,
        description,
        endDate,
        startDate,
        author: author._id,
        status,
        category,
        members,
      });

      author.tasks.push(task._id);
      await author.save();
      return task;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getTasks(filterDto: FilterDto, user: any): Promise<Task[]> {
    const { search, category, status } = filterDto;

    let query: any = {
      $or: [
        { author: user._id }, // User is the author
        { members: user._id }, // User is a member
      ],
    };

    if (search) {
      query = {
        ...query,
        $and: [
          // Ensure both conditions are met
          {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
          },
          {
            $or: [{ author: user._id }, { members: user._id }],
          },
        ],
      };
    }

    if (category) {
      query = {
        ...query,
        category,
      };
    }

    if (status !== undefined) {
      query = {
        ...query,
        status,
      };
    }

    const tasks = await this.taskModel.find(query).populate({
      path: 'members',
      select: '-password -tasks -__v',
    });

    return tasks;
  }

  async getTaskById(taskId: string, user: any): Promise<Task> {
    const task = await this.taskModel.findById(taskId).populate({
      path: 'members',
      select: '-password -tasks -__v',
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (
      task.author.toString() == user._id.toString() ||
      task.members.some(
        (member: any) => member._id.toString() === user._id.toString(),
      )
    ) {
      return task; // User has access
    } else {
      throw new ConflictException("Don't have access to this task");
    }
  }

  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    user: any,
  ): Promise<Task> {
    // const task = await this.taskModel.findByIdAndUpdate(taskId, { status });
    const task = await this.taskModel.findOne({
      _id: taskId,
      author: user._id,
    });

    if (task) {
      task.status = status;
      await task.save();
      return task;
    } else {
      throw new ConflictException(
        "You Don't have access to change the status of this task",
      );
    }
  }

  async addMember(taskId: string, memberId: any, user: any) {
    const task = await this.taskModel.findOne({
      _id: taskId,
      author: user._id,
    });

    if (!task) {
      throw new ConflictException("You don't have permsion to do that");
    }

    if (task.members.includes(memberId)) {
      // remove it
      const index = task.members.indexOf(memberId);
      task.members.splice(index, 1);
      await task.save();
      return 'removed successfully';
    }

    task.members.push(memberId);
    await task.save();
    return 'added successfully';
  }

  async deleteTask(taskId: string, user: any) {
    try {
      await this.taskModel.findOneAndDelete({
        _id: taskId,
        $or: [
          { author: user._id }, // User is the author
          { members: user._id }, // User is a member
        ],
      });

      return 'Task Deleted Successfully';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateTask(taskId: string, body: any, user: any) {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
        $or: [
          { author: user._id }, // User is the author
          { members: user._id }, // User is a member
        ],
      },
      body,
    );

    return task;
  }

  // send reminder email notification
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleReminders() {
    const tasks = await this.taskModel.find({});

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.status == TaskStatus.OPEN) {
        const thirtyMinutesFromNow = new Date(Date.now() + 30 * 60 * 1000);
        if (
          task.endDate.getTime() <= thirtyMinutesFromNow.getTime() &&
          !task.reminderSent
        ) {
          const author: User = await this.userModel.findById(task.author);

          if (!author) {
            throw new NotFoundException('Author not found');
          }
          const members: User[] = await this.userModel.find({
            _id: {
              $in: task.members,
            },
          });

          // send email
          const options = {
            to: `${author.email},${members.map((m) => m.email + ',')}`,
            from: 'beboghali0@gmail.com',
            subject: 'Reminder Notification Task will be ended soon ',
            html: `<div>
            <h2>Hi ${author.fullname}</h2>
            <p>The task will be ended in less than 30 minutes</p>
        </div>`,
          };

          await this.mailService.sendMail(options);
          await task.updateOne({ reminderSent: true });

          await task.save();
        }
      }
    }
  }
}
