// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    username: string,
    password: string,
    role: string = 'user',
    id: number = 10,
  ): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
      id,
    });
    console.log('user', user);

    return this.userRepository.save(user);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    console.log(user, 'user');
    console.log(password, 'password');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword, 'hashedPassword');

    if (user && (await bcrypt.compare(hashedPassword, user.password))) {
      return user;
    }
    // if (user && password === user.password) {
    //   return user;
    // }
    return null;
  }

  async validateUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  generateAccessToken(user: UserEntity): string {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
  }

  generateRefreshToken(user: UserEntity): string {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
    });
  }

  refreshAccessToken(refreshToken: string): string {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    return this.generateAccessToken({
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      password: payload.password,
      createDate: new Date(),
      updateDate: new Date(),
    });
  }
}
