import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: '1', type: String, description: 'email' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'a@a.com', type: String, description: 'password' })
  @IsString()
  @IsOptional()
  password: string;
}
