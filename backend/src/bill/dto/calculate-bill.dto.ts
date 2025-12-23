import { IsNumber, IsPositive } from 'class-validator';

export class CalculateBillDto {
  @IsNumber()
  @IsPositive()
  units: number;
}
