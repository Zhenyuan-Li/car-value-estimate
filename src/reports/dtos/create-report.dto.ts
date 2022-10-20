import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ example: 'ford', type: String, description: 'make' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'mustang', type: String, description: 'model' })
  @IsString()
  model: string;

  @ApiProperty({ example: 1982, type: Number, description: 'year of produce' })
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @ApiProperty({ example: 5000, type: Number, description: 'mileage' })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @ApiProperty({ example: 45, type: Number, description: 'longitude' })
  @IsLongitude()
  lng: number;

  @ApiProperty({ example: 45, type: Number, description: 'latitude' })
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: 20000, type: Number, description: 'price of car' })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
