import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtAuthModule } from '../auth/jwt/jwt.module';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtAuthModule], // Import JwtAuthModule
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
