import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { ReportDto } from './dtos/report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportsService } from './reports.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@ApiTags('Report')
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @ApiCookieAuth()
  @ApiBody({
    description: 'User create report',
    type: CreateReportDto,
  })
  @ApiCreatedResponse({
    description: 'Report created successfully',
    type: ReportDto,
  })
  @UseGuards(AuthGuard)
  @Post()
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  @ApiCookieAuth()
  @ApiBody({
    description: 'Fetch User with ID',
    type: ApproveReportDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Report approved!',
    type: ReportDto,
  })
  @ApiNotFoundResponse({ description: 'Report not found' })
  @UseGuards(AdminGuard)
  @Patch('/:id')
  approveReport(@Param() id: string, @Body() body: ApproveReportDto) {
    return this.reportService.changeApproval(id, body.approved);
  }

  @ApiCookieAuth()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Here is the estimate of cars',
    type: GetEstimateDto,
  })
  getEstimate(@Query() query: GetEstimateDto) {
    // problem: some property need to convert to number, since queryString return string
    return this.reportService.createEstimate(query);
  }
}
