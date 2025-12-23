import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pricing_config')
export class PricingConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  rate_per_unit: number;

  @Column('decimal', { precision: 5, scale: 2 })
  vat_percentage: number;

  @Column('decimal', { precision: 10, scale: 2 })
  service_charge: number;

  @Column({ default: false })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
