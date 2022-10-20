import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ type: String, description: 'email' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ type: String, description: 'password' })
  @IsString()
  @IsOptional()
  password: string;
}
