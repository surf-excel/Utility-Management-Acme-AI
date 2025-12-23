import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingConfig } from './entities/pricing-config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CalculateBillDto } from './dto/calculate-bill.dto';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(PricingConfig)
    private pricingConfigRepository: Repository<PricingConfig>,
  ) {}

  async getActiveConfig(): Promise<PricingConfig> {
    let config = await this.pricingConfigRepository.findOne({
      where: { active: true },
    });

    // If no active config exists, create a default one
    if (!config) {
      config = this.pricingConfigRepository.create({
        rate_per_unit: 5.0,
        vat_percentage: 15.0,
        service_charge: 50.0,
        active: true,
      });
      await this.pricingConfigRepository.save(config);
    }

    return config;
  }

  async updateConfig(updateConfigDto: UpdateConfigDto): Promise<PricingConfig> {
    // Get the current active config
    const currentConfig = await this.pricingConfigRepository.findOne({
      where: { active: true },
    });

    if (currentConfig) {
      // Update the existing config
      currentConfig.rate_per_unit = updateConfigDto.rate_per_unit;
      currentConfig.vat_percentage = updateConfigDto.vat_percentage;
      currentConfig.service_charge = updateConfigDto.service_charge;
      
      return await this.pricingConfigRepository.save(currentConfig);
    } else {
      // Create new active config if none exists
      const newConfig = this.pricingConfigRepository.create({
        ...updateConfigDto,
        active: true,
      });

      return await this.pricingConfigRepository.save(newConfig);
    }
  }

  async calculateBill(calculateBillDto: CalculateBillDto) {
    const { units } = calculateBillDto;

    if (units <= 0) {
      throw new BadRequestException('Units must be a positive number');
    }

    const config = await this.getActiveConfig();

    const subtotal = units * Number(config.rate_per_unit);
    const vatAmount = subtotal * (Number(config.vat_percentage) / 100);
    const serviceCharge = Number(config.service_charge);
    const total = subtotal + vatAmount + serviceCharge;

    return {
      units,
      rate_per_unit: Number(config.rate_per_unit),
      vat_percentage: Number(config.vat_percentage),
      service_charge: serviceCharge,
      breakdown: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        vat_amount: parseFloat(vatAmount.toFixed(2)),
        service_charge: serviceCharge,
        total: parseFloat(total.toFixed(2)),
      },
    };
  }
}
