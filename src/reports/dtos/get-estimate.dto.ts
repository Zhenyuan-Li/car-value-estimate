import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetEstimateDto {
  @ApiProperty({ example: 'ford', type: String, description: 'make' })
  @IsString()
  make: string;

  @ApiProperty({ example: 'mustang1', type: String, description: 'model' })
  @IsString()
  model: string;

  @ApiProperty({ example: 1982, type: Number, description: 'year of produce' })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @ApiProperty({ example: 5000, type: Number, description: 'mileage' })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @ApiProperty({ example: 45, type: Number, description: 'longitude' })
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @ApiProperty({ example: 45, type: Number, description: 'latitude' })
  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
