import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '1', type: Number, description: 'id' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'a@a.com', type: String, description: 'email' })
  @Expose()
  email: string;
}
