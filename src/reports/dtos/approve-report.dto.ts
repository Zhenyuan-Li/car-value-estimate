import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveReportDto {
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'approvement of report' })
  approved: boolean;
}
