import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/schemas/user.schema';
import { AuthGuard } from './auth.guard';
import { GetUser } from './get-user.decorater';
import { FilterDto } from './dto/filter.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
    // console.log(data);
    // response.cookie('token', data.token, {
    //   maxAge: 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   // secure: true,
    // });
  }

  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    // @Res({ passthrough: true }) response: Response,
  ): Promise<{ token: string; user: User }> {
    return await this.authService.login(loginDto);
    // if (!data?.token) {
    //   throw new ConflictException('Invalid login token');
    // }
    // response.cookie('token', data.token, {
    //   maxAge: 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   // secure: true,
    // });
    // return data;
  }

  @Get('/')
  @UseGuards(AuthGuard)
  getAllUsers(@Query() filterDto: FilterDto, @GetUser() user: User) {
    return this.authService.getAllUsers(filterDto, user);
  }
}
