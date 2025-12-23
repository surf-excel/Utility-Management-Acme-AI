import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PricingConfig {
  id: number;
  rate_per_unit: number;
  vat_percentage: number;
  service_charge: number;
  active: boolean;
}

export interface UpdateConfigRequest {
  rate_per_unit: number;
  vat_percentage: number;
  service_charge: number;
}

export interface CalculateBillRequest {
  units: number;
}

export interface BillBreakdown {
  subtotal: number;
  vat_amount: number;
  service_charge: number;
  total: number;
}

export interface CalculateBillResponse {
  units: number;
  rate_per_unit: number;
  vat_percentage: number;
  service_charge: number;
  breakdown: BillBreakdown;
}

export const billApi = {
  getConfig: async (): Promise<PricingConfig> => {
    const response = await api.get<any>('/config');
    // Backend returns numeric fields as strings; convert to numbers
    return {
      id: response.data.id,
      rate_per_unit: parseFloat(response.data.rate_per_unit),
      vat_percentage: parseFloat(response.data.vat_percentage),
      service_charge: parseFloat(response.data.service_charge),
      active: response.data.active,
    };
  },

  updateConfig: async (
    config: UpdateConfigRequest,
    adminSecret: string
  ): Promise<PricingConfig> => {
    const response = await api.put<PricingConfig>('/config', config, {
      headers: {
        'x-admin-secret': adminSecret,
      },
    });
    return response.data;
  },

  calculateBill: async (
    data: CalculateBillRequest
  ): Promise<CalculateBillResponse> => {
    const response = await api.post<CalculateBillResponse>('/calculate', data);
    return response.data;
  },
};
