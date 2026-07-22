import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales-summary')
  getSalesSummary(@Query('range') range?: string) {
    return this.reportsService.getSalesSummary(range);
  }

  @Get('best-sellers')
  getBestSellers(@Query('limit') limit?: string) {
    return this.reportsService.getBestSellers(limit ? +limit : 5);
  }
}
