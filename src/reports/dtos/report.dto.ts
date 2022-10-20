import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReportDto {
  @ApiProperty({ example: 1, type: Number, description: 'report id' })
  @Expose()
  id: number;

  @ApiProperty({ example: 20000, type: Number, description: 'price' })
  @Expose()
  price: number;

  @ApiProperty({ example: 1982, type: Number, description: 'year of produce' })
  @Expose()
  year: number;

  @ApiProperty({ example: 45, type: Number, description: 'longitude' })
  @Expose()
  lng: number;

  @ApiProperty({ example: 45, type: Number, description: 'latitude' })
  @Expose()
  lat: number;

  @ApiProperty({ example: 5000, type: Number, description: 'mileage' })
  @Expose()
  mileage: number;

  @ApiProperty({ example: 'ford', type: String, description: 'make' })
  @Expose()
  make: string;

  @ApiProperty({ example: 'mustang', type: String, description: 'model' })
  @Expose()
  model: string;

  @ApiProperty({
    example: false,
    type: Boolean,
    description: 'whether is approved',
  })
  @Expose()
  approved: boolean;

  @ApiProperty({ example: 1, type: Number, description: 'User ID' })
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
