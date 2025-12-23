import React, { useEffect, useState } from 'react';
import { Zap, Lock, Calculator, Download, Loader2, Save, DollarSign, Percent, Hash, KeyRound, FileText, Info } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { billApi, PricingConfig } from './services/api';
import { generateBillPDF } from './utils/pdfGenerator';

// Interface for the result structure shown in the preview
interface BillResult {
  units: number;
  ratePerUnit: number;
  subtotal: number;
  vatAmount: number;
  serviceCharge: number;
  totalPayable: number;
}

// User Calculator Component
const UserCalculatorView = () => {
  const [units, setUnits] = useState<string>('');
  const [result, setResult] = useState<BillResult | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const { data: config, isLoading: configLoading, isError: configError } = useQuery<PricingConfig>({
    queryKey: ['utilityConfig'],
    queryFn: billApi.getConfig,
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 2,
  });

  const currentRate = config?.rate_per_unit ?? 0;
  const currentVAT = config?.vat_percentage ?? 0;
  const currentServiceCharge = config?.service_charge ?? 0;

  const handleCalculate = () => {
    if (!config) return;
    const unitsNum = parseFloat(units);
    if (!units || isNaN(unitsNum) || unitsNum <= 0) return;

    const subtotal = unitsNum * currentRate;
    const vat = subtotal * (currentVAT / 100);
    const total = subtotal + vat + currentServiceCharge;

    setHasCalculated(true);
    setResult({
      units: unitsNum,
      ratePerUnit: currentRate,
      subtotal,
      vatAmount: vat,
      serviceCharge: currentServiceCharge,
      totalPayable: total,
    });
  };

  // Automatically refresh the calculation when config changes
  useEffect(() => {
    if (!config || !hasCalculated) return;
    const unitsNum = parseFloat(units);
    if (!units || isNaN(unitsNum) || unitsNum <= 0) return;

    const rate = config?.rate_per_unit ?? 0;
    const vatPercent = config?.vat_percentage ?? 0;
    const serviceCharge = config?.service_charge ?? 0;

    const subtotal = unitsNum * rate;
    const vat = subtotal * (vatPercent / 100);
    const total = subtotal + serviceCharge + vat;

    setResult({
      units: unitsNum,
      ratePerUnit: rate,
      subtotal,
      vatAmount: vat,
      serviceCharge: serviceCharge,
      totalPayable: total,
    });
  }, [config, units, hasCalculated]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Enter Consumption */}
      <div className="bg-slate-900/60 rounded-2xl shadow-2xl border border-slate-800/70 p-8 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Zap className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Enter Consumption</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="units" className="block text-sm font-semibold text-slate-400 mb-3">
              Units Consumed (kWh)
            </label>
            <input
              type="number"
              name="units"
              id="units"
              className="block w-full px-4 py-4 text-2xl font-semibold text-slate-100 bg-black/30 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-400 transition-all duration-300 placeholder-slate-500"
              placeholder="0"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              min="0"
            />
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={configLoading || !units || !config}
            className="w-full flex justify-center items-center gap-2 py-4 px-6 text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <><Calculator className="h-5 w-5" /> Calculate Bill</>
          </button>

          {/* Current Rates Card */}
          <div className="bg-black/20 rounded-xl p-5 border border-slate-800/70">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-slate-400" />
              <h4 className="text-sm font-semibold text-slate-200">Current Rates</h4>
            </div>
            {configLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
              </div>
            ) : configError ? (
              <p className="text-xs text-red-400">Unable to fetch rates. Check connection.</p>
            ) : config ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Rate/Unit</span>
                  <span className="font-semibold text-slate-200">৳{config.rate_per_unit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">VAT</span>
                  <span className="font-semibold text-slate-200">{config.vat_percentage}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Service Charge</span>
                  <span className="font-semibold text-slate-200">৳{config.service_charge.toFixed(2)}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right Column - Bill Preview */}
      <div className="bg-slate-900/60 rounded-2xl shadow-2xl border border-slate-800/70 p-8 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <FileText className="h-6 w-6 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Bill Preview</h3>
        </div>

        {!result ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-black/20 rounded-full mb-4">
              <FileText className="h-12 w-12 text-slate-600" />
            </div>
            <p className="text-slate-400 text-sm">Enter units and calculate to see your bill</p>
          </div>
        ) : (
          <div className="space-y-6 transition-all duration-500 animate-in fade-in">
            {/* Result Header */}
            <div className="bg-indigo-600/10 rounded-xl p-4 border border-indigo-500/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-400">Units Consumed</span>
                <span className="text-lg font-bold text-slate-100">{result.units} kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-400">Rate/Unit</span>
                <span className="text-lg font-bold text-slate-100">৳{result.ratePerUnit.toFixed(2)}</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium text-slate-200">Subtotal</span>
                </div>
                <span className="text-lg font-semibold text-slate-100">৳{result.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <Percent className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium text-slate-200">VAT ({currentVAT}%)</span>
                </div>
                <span className="text-lg font-semibold text-slate-100">৳{result.vatAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-slate-800/60">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium text-slate-200">Service Charge</span>
                </div>
                <span className="text-lg font-semibold text-slate-100">৳{result.serviceCharge.toFixed(2)}</span>
              </div>

              {/* Final Total */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-700">
                <span className="text-xl font-bold text-slate-100">Total Amount</span>
                <span className="text-2xl font-bold text-indigo-400">৳{result.totalPayable.toFixed(2)}</span>
              </div>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={() => {
                generateBillPDF(
                  result.units,
                  result.ratePerUnit,
                  currentVAT,
                  {
                    subtotal: result.subtotal,
                    vat_amount: result.vatAmount,
                    service_charge: result.serviceCharge,
                    total: result.totalPayable,
                  }
                );
              }}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-semibold text-slate-100 bg-transparent hover:bg-white/5 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            >
              <Download className="h-4 w-4" />
              Download PDF Statement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanelView = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ratePerUnit, setRatePerUnit] = useState('5.50');
  const [vatPercentage, setVatPercentage] = useState('15');
  const [serviceCharge, setServiceCharge] = useState('50');

  const queryClient = useQueryClient();

  const { data: config } = useQuery<PricingConfig>({
    queryKey: ['utilityConfig'],
    queryFn: billApi.getConfig,
    staleTime: 30000,
    retry: 2,
  });

  useEffect(() => {
    if (!config) return;
    setRatePerUnit((config?.rate_per_unit ?? 0).toString());
    setVatPercentage((config?.vat_percentage ?? 0).toString());
    setServiceCharge((config?.service_charge ?? 0).toString());
  }, [config]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = adminSecret.trim();
    if (!entered) return;

    // Frontend gate: only allow correct default secret
    if (entered === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Wrong admin secret. Please try again.');
      setIsAuthenticated(false);
    }
  };

  const handleSave = async () => {
    if (!adminSecret.trim()) return;
    setIsSaving(true);
    try {
      const rate = parseFloat(ratePerUnit);
      const vat = parseFloat(vatPercentage);
      const charge = parseFloat(serviceCharge);

      if (isNaN(rate) || rate <= 0) {
        alert('Rate per unit must be a positive number');
        setIsSaving(false);
        return;
      }
      if (isNaN(vat) || vat < 0 || vat > 100) {
        alert('VAT percentage must be between 0 and 100');
        setIsSaving(false);
        return;
      }
      if (isNaN(charge) || charge < 0) {
        alert('Service charge must be a non-negative number');
        setIsSaving(false);
        return;
      }

      await billApi.updateConfig(
        {
          rate_per_unit: rate,
          vat_percentage: vat,
          service_charge: charge,
        },
        adminSecret
      );

      // Invalidate and refetch to ensure both views update
      await queryClient.invalidateQueries({ queryKey: ['utilityConfig'] });
      await queryClient.refetchQueries({ queryKey: ['utilityConfig'] });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        alert('Invalid admin secret. Please check your credentials.');
        setIsAuthenticated(false);
        setAdminSecret('');
      } else {
        alert('Failed to update configuration. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // --- The Gatekeeper View ---
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-slate-900/50 rounded-2xl shadow-2xl border border-slate-800/80 p-10 backdrop-blur-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500/20">
              <KeyRound className="h-8 w-8 text-indigo-300" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-slate-100">Admin Access</h2>
            <p className="mt-2 text-sm text-slate-400">Enter your PIN to modify pricing rules.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="pin-code" className="block text-sm font-semibold text-slate-400 mb-2">Admin Secret</label>
              <input
                id="pin-code"
                name="adminSecret"
                type="password"
                required
                className="appearance-none rounded-xl block w-full px-4 py-4 border border-slate-700 bg-black/30 placeholder-slate-500 text-slate-100 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-400 transition-all duration-300"
                placeholder="••••"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                maxLength={4}
              />
              <p className="mt-2 text-xs text-slate-500 text-center">Default secret: 1234 (backend-configured)</p>
            </div>
            <div>
              <button type="submit" className="group relative w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 shadow-lg">
                <Lock className="h-5 w-5" aria-hidden="true" />
                Unlock Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- The Dashboard View ---
  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl px-6 py-4 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-200">Configuration Updated!</p>
                <p className="text-xs text-emerald-300">Changes will apply to all new calculations</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900/60 rounded-2xl shadow-2xl border border-slate-800/70 p-8 backdrop-blur">
        <div className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Save className="h-6 w-6 text-indigo-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Pricing Configuration</h3>
          </div>
          <p className="mt-2 text-sm text-slate-400 ml-14">
            Update global billing constants. Changes affect all future calculations immediately.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rate Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Rate per Unit</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={ratePerUnit}
                  onChange={(e) => setRatePerUnit(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 text-base font-medium text-slate-100 bg-black/30 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-400 transition-all duration-300 placeholder-slate-500"
                  placeholder="5.50"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Price per kWh in ৳</p>
            </div>

            {/* VAT Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">VAT Percentage</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Percent className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="number"
                  step="0.1"
                  max="100"
                  value={vatPercentage}
                  onChange={(e) => setVatPercentage(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 text-base font-medium text-slate-100 bg-black/30 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-400 transition-all duration-300 placeholder-slate-500"
                  placeholder="15.0"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Value Added Tax (0% - 100%)</p>
            </div>

            {/* Service Charge Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Service Charge</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-indigo-300" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 text-base font-medium text-slate-100 bg-black/30 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-400 transition-all duration-300 placeholder-slate-500"
                  placeholder="50.00"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Fixed monthly fee in ৳</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(false);
              setAdminSecret('');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-200 bg-transparent hover:bg-white/5 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
          >
            <Lock className="h-4 w-4" />
            Lock Panel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSaving ? (
              <><Loader2 className="animate-spin h-5 w-5" /> Saving...</>
            ) : (
              <><Save className="h-5 w-5" /> Update Configuration</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Layout
function App() {
  const [currentView, setCurrentView] = useState<'user' | 'admin'>('user');
  
  // Pre-fetch config for faster initial load
  const { data: config, isLoading: appLoading, isError: appError } = useQuery<PricingConfig>({
    queryKey: ['utilityConfig'],
    queryFn: billApi.getConfig,
    retry: 3,
    retryDelay: 1000,
  });

  // Show loading screen while fetching initial config
  if (appLoading || !config || Object.keys(config).length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0c14] flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div>
        <p className="text-slate-400">Syncing with Acme AI Pricing Engine...</p>
      </div>
    );
  }

  // Show error screen if config fetch fails
  if (appError) {
    return (
      <div className="min-h-screen bg-[#0a0c14] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="p-4 bg-red-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Connection Error</h2>
          <p className="text-slate-400 mb-6">Unable to connect to the backend server. Please ensure the backend is running on port 3000.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] font-sans text-slate-200">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0a0c14] border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.prod.website-files.com/5f91af3ca95769b78bf37301/5f92a8049254dd486f25a88b_20201004%20New%20Logo%20Inverse%20AE%201.svg" 
                alt="Acme AI Logo" 
                className="h-8"
              />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">Acme AI Ltd.</h1>
                <p className="text-xs text-slate-400">Utility Management</p>
              </div>
            </div>
            
            {/* Toggle Pills */}
            <div className="flex items-center gap-1 p-1 border border-slate-700 rounded-full">
              <button
                onClick={() => setCurrentView('user')}
                className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  currentView === 'user' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Calculator
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  currentView === 'admin' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Lock className="h-4 w-4" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-[#0f172a] border-b border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-3 tracking-tight">
            Utility Bill Calculator
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Calculate your electricity bill instantly with our smart pricing engine
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentView === 'user' ? <UserCalculatorView /> : <AdminPanelView />}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0c14] border-t border-slate-800/80 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-slate-400">
            <p className="font-semibold text-slate-200 mb-2">Acme AI Ltd.</p>
            <p>H #385, R #6, Mirpur DOHS, Dhaka 1216, Bangladesh</p>
            <p className="mt-2">
              <a href="mailto:info@acmeai.tech" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300">
                info@acmeai.tech
              </a>
              {' | '}
              <a href="http://www.acmeai.tech" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300">
                www.acmeai.tech
              </a>
            </p>
            <p className="mt-4 text-xs text-slate-600">
              © {new Date().getFullYear()} Acme AI Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
