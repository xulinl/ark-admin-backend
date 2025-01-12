import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsIn,
  IsOptional, // 可选
} from 'class-validator';

export class UserDto {
  // 登录账号
  @ApiProperty({
    description: '登录账号',
    example: 'admin',
  })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为字符串' })
  @MaxLength(20, { message: '用户名长度不能超过20个字符' })
  @MinLength(2, { message: '用户名长度不能小于2个字符' })
  usename: string;
  // 登录密码
  @ApiProperty({
    description: '登录密码',
    example: '123456',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
    message: '密码必须包含数字、字母，长度为6-16',
  })
  password: string;
  // 昵称
  @ApiProperty({
    description: '昵称',
    example: 'admin',
  })
  @IsNotEmpty({ message: '昵称不能为空' })
  @IsString({ message: '昵称必须为字符串' })
  @MaxLength(20, { message: '昵称长度不能超过20个字符' })
  @MinLength(2, { message: '昵称长度不能小于2个字符' })
  nickname: string;
  // 邮箱
  @ApiProperty({
    description: '邮箱',
    example: 'admin@qq.com',
  })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;
  @ApiProperty({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'QQ' })
  @IsOptional()
  @IsString()
  @Matches(/^[1-9]\d{4,10}$/)
  @MinLength(5)
  @MaxLength(11)
  qq?: string;

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '状态' })
  @IsIn([0, 1])
  status: number;
}
