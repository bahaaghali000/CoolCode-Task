import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signup(signupDto: SignupDto): Promise<{ token: string; user: User }> {
    try {
      const isExist = await this.userModel.findOne({
        $or: [{ email: signupDto.email }, { username: signupDto.username }],
      });

      if (isExist) {
        throw new ConflictException('Email or username already exists');
      }

      const user = await this.userModel.create(signupDto);

      const token = await this.jwtService.signAsync(
        { id: user._id },
        {
          secret: process.env.JWT_SECRET_KEY,
        },
      );

      user.password = undefined;
      user.__v = undefined;

      // send email
      const options = {
        to: user.email,
        from: 'beboghali0@gmail.com',
        subject: 'Welcome To Cool Code Task ',
        html: `<div>
            <h2>Hi ${user.fullname}</h2>
            <p>welcome to cool code task. We Just Wanaa say welcome</p>
        </div>`,
      };

      await this.mailService.sendMail(options);

      return {
        token,
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: User }> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email }).populate('tasks');

      if (!user) {
        throw new NotFoundException(`Invalid email or password`);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Incorrect password');
      }
      if (user.username && isMatch) {
        // don't return the password in the response
        user.password = undefined;
        user.__v = undefined;

        const token = await this.jwtService.signAsync(
          { id: user._id },
          {
            secret: process.env.JWT_SECRET_KEY,
          },
        );

        return {
          token,
          user,
        };
      }
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async getAllUsers(filterDto: FilterDto, user: any): Promise<User[]> {
    const { search } = filterDto;
    if (search) {
      const users = await this.userModel
        .find({
          $nor: [{ _id: user._id }],
          $or: [
            {
              username: {
                $regex: search,
                $options: 'i',
              },
            },
            {
              fullname: {
                $regex: search,
                $options: 'i',
              },
            },
            {
              email: {
                $regex: search,
                $options: 'i',
              },
            },
          ],
        })
        .select('-password -__v -tasks');

      return users;
    } else {
      const users = await this.userModel
        .find({ $nor: [{ _id: user._id }] })
        .select('-password -__v -tasks');
      return users;
    }
  }
}
