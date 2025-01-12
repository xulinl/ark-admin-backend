import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthModule } from './jwt/jwt.module';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtAuthModule],
  providers: [UserService, AuthService],
  controllers: [AuthController],
  exports: [AuthService, UserService],
})
export class AuthModule {}
