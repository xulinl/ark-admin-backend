import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // 注册用户信息
  async register(
    username: string,
    password: string,
    role: string = 'user',
  ): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(password, 10); // 加密密码
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      role,
      createDate: new Date(),
      updateDate: new Date(),
    });
    return this.usersRepository.save(user);
  }

  // 校验用户信息，查询数据库中，是否存在该用户，并校验密码
  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, (await user).password))) {
      return user;
    }
    return null;
  }

  async validateUserById(id: number): Promise<UserEntity> {
    const user = this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    return null;
  }

  // 生成token
  generateAccessToken(user: UserEntity): string {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
  }

  // 刷新token
  generateRefreshToken(user: UserEntity): string {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
    });
  }
}
