import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CalculateBillDto } from './dto/calculate-bill.dto';
import { AdminGuard } from './guards/admin.guard';

@Controller('api')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get('config')
  async getConfig() {
    return await this.billService.getActiveConfig();
  }

  @Get('/config')
  async getConfigPublic() {
    return await this.billService.getActiveConfig();
  }

  @Put('config')
  @UseGuards(AdminGuard)
  async updateConfig(@Body() updateConfigDto: UpdateConfigDto) {
    return await this.billService.updateConfig(updateConfigDto);
  }

  @Post('calculate')
  async calculateBill(@Body() calculateBillDto: CalculateBillDto) {
    return await this.billService.calculateBill(calculateBillDto);
  }
}
