import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './schemas/user.schema';
import { TasksModule } from './tasks/tasks.module';
import { MailModule } from './mail/mail.module';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ScheduleModule } from '@nestjs/schedule';
import { LinkedinModule } from './linkedin/linkedin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),

    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          UserSchema.pre('save', async function (next) {
            this.password = await bcrypt.hash(this.password, 10);
            next();
          });

          UserSchema.methods.createRestToken = function () {
            const restToken = crypto.randomBytes(26).toString('hex');

            this.passwordResetToken = crypto
              .createHash('sha256')
              .update(restToken)
              .digest('hex');

            this.passwordResetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

            return restToken;
          };

          UserSchema.methods.createVerificationCode = function () {
            let verificationCode = '';
            for (let i = 0; i < 4; i++) {
              verificationCode += Math.floor(Math.random() * 10);
            }

            this.verificationCode = verificationCode;
            this.verificationCodeExpires = Date.now() + 60 * 60 * 1000; // 1 hour

            return verificationCode;
          };
        },
      },
    ]),
   
    AuthModule,
    TasksModule,
    MailModule,
    LinkedinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
