import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsNotEmpty } from 'class-validator';
export class PasswordUpdateDto {
  @ApiProperty({
    description: '旧密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
    message: '密码必须包含数字、字母，长度为6-16',
  })
  oldPassword: string;
  @ApiProperty({
    description: '新密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Matches(/^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])\S*$/i, {
    message: '密码必须包含数字、字母，长度为6-16',
  })
  newPassword: string;
}
