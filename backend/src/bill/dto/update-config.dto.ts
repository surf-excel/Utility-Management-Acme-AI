import { IsNumber, IsPositive, Min, Max } from 'class-validator';

export class UpdateConfigDto {
  @IsNumber()
  @IsPositive()
  rate_per_unit: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  vat_percentage: number;

  @IsNumber()
  @Min(0)
  service_charge: number;
}
