import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { PricingConfig } from './entities/pricing-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PricingConfig]),
    ConfigModule,
  ],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}
