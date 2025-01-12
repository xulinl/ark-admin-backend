import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/user.entity';
import { AuthController } from '../auth.controller';
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class JwtAuthModule {}
