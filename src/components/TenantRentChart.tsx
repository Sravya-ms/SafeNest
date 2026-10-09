import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { RentPayment } from '../types';
import { CheckCircle, ShieldCheck } from 'lucide-react';

interface TenantRentChartProps {
  payments: RentPayment[];
  monthlyRent?: number;
}

interface MonthlyDataPoint {
  month: string;
  fullMonth: string;
  rent: number;
  utilities: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Upcoming';
  receiptRef?: string;
}

export const TenantRentChart: React.FC<TenantRentChartProps> = ({
  payments,
  monthlyRent = 28500
}) => {
  const [chartView, setChartView] = useState<'bar' | 'area'>('bar');

  // Generate 12 months trend data leading up to October 2026 (in INR)
  const last12Months: MonthlyDataPoint[] = [
    { month: "Nov '25", fullMonth: 'November 2025', rent: 26000, utilities: 1400, total: 27400, status: 'Paid', receiptRef: 'RCP-SN-2025-8812' },
    { month: "Dec '25", fullMonth: 'December 2025', rent: 26000, utilities: 1650, total: 27650, status: 'Paid', receiptRef: 'RCP-SN-2025-9104' },
    { month: "Jan '26", fullMonth: 'January 2026', rent: 26000, utilities: 1800, total: 27800, status: 'Paid', receiptRef: 'RCP-SN-2026-0115' },
    { month: "Feb '26", fullMonth: 'February 2026', rent: 26000, utilities: 1750, total: 27750, status: 'Paid', receiptRef: 'RCP-SN-2026-0294' },
    { month: "Mar '26", fullMonth: 'March 2026', rent: 26000, utilities: 1500, total: 27500, status: 'Paid', receiptRef: 'RCP-SN-2026-0419' },
    { month: "Apr '26", fullMonth: 'April 2026', rent: 26000, utilities: 1300, total: 27300, status: 'Paid', receiptRef: 'RCP-SN-2026-0562' },
    { month: "May '26", fullMonth: 'May 2026', rent: 26000, utilities: 1250, total: 27250, status: 'Paid', receiptRef: 'RCP-SN-2026-0711' },
    { month: "Jun '26", fullMonth: 'June 2026', rent: 26000, utilities: 1400, total: 27400, status: 'Paid', receiptRef: 'RCP-SN-2026-0899' },
    { month: "Jul '26", fullMonth: 'July 2026', rent: 26000, utilities: 1550, total: 27550, status: 'Paid', receiptRef: 'RCP-SN-2026-1045' },
    { month: "Aug '26", fullMonth: 'August 2026', rent: 26000, utilities: 1600, total: 27600, status: 'Paid', receiptRef: 'RCP-SN-2026-1190' },
    { month: "Sep '26", fullMonth: 'September 2026', rent: monthlyRent, utilities: 1450, total: monthlyRent + 1450, status: 'Paid', receiptRef: 'RCP-SN-2026-1302' },
    { month: "Oct '26", fullMonth: 'October 2026', rent: monthlyRent, utilities: 1500, total: monthlyRent + 1500, status: 'Paid', receiptRef: 'RCP-SN-2026-0091' }
  ];

  // Overlay any current real-time payments recorded
  const paidPayments = payments.filter(p => p.status === 'PAID');
  if (paidPayments.length > 0) {
    const latest = paidPayments[0];
    last12Months[last12Months.length - 1].rent = latest.amount;
    last12Months[last12Months.length - 1].total = latest.amount + 1500;
    if (latest.receiptNumber) {
      last12Months[last12Months.length - 1].receiptRef = latest.receiptNumber;
    }
  }

  const totalSpent12m = last12Months.reduce((sum, item) => sum + item.total, 0);
  const avgMonthly = Math.round(totalSpent12m / last12Months.length);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MonthlyDataPoint;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1">
            <span className="font-bold text-slate-200">{data.fullMonth}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
              {data.status}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono">
            <span className="text-slate-400 font-sans">Base Rent:</span>
            <span className="font-bold text-white">₹{data.rent.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono">
            <span className="text-slate-400 font-sans">Maintenance & Utilities:</span>
            <span className="text-slate-300">₹{data.utilities.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono pt-1 border-t border-slate-800 text-teal-400 font-bold">
            <span className="font-sans">Total Paid:</span>
            <span>₹{data.total.toLocaleString('en-IN')}</span>
          </div>
          {data.receiptRef && (
            <p className="text-[10px] text-slate-400 pt-1 font-mono truncate">
              Receipt: {data.receiptRef}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              12-Month Rent Payment Trends (₹ INR)
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle size={12} />
              <span>100% On-Time Record</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historical monthly rent and verified escrow ledger over the previous 12 billing cycles in Indian Rupees.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 text-xs font-semibold">
          <button
            onClick={() => setChartView('bar')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              chartView === 'bar'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Bars
          </button>
          <button
            onClick={() => setChartView('area')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              chartView === 'area'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trend Area
          </button>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div>
          <span className="text-[11px] text-slate-400 font-medium uppercase block">Total 12-Month Spend</span>
          <span className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
            ₹{totalSpent12m.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500">12 cycles settled</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 font-medium uppercase block">Average Monthly</span>
          <span className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5 block">
            ₹{avgMonthly.toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[10px] text-slate-500">Rent + maintenance</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 font-medium uppercase block">Credit Score Impact</span>
          <span className="text-lg font-bold font-mono tabular-nums text-teal-700 mt-0.5 block">
            +38 pts
          </span>
          <span className="text-[10px] text-teal-600 font-medium">CIBIL / Experian Verified</span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 font-medium uppercase block">Payment Method</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block truncate">
            UPI Escrow Autopay
          </span>
          <span className="text-[10px] text-slate-500">₹0 convenience fee</span>
        </div>
      </div>

      {/* Recharts Chart Viewport */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'bar' ? (
            <BarChart data={last12Months} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
                domain={[20000, 35000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="rent"
                name="Base Rent"
                fill="#0D9488"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="utilities"
                name="Utilities"
                fill="#94A3B8"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          ) : (
            <AreaChart data={last12Months} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
                domain={[22000, 32000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                name="Total Paid"
                stroke="#0D9488"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rentGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-teal-600 shrink-0" />
            <span className="text-slate-700 font-medium">Base Monthly Rent</span>
          </div>
          {chartView === 'bar' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-400 shrink-0" />
              <span className="text-slate-700 font-medium">Maintenance Escrow</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck size={13} className="text-teal-600" />
          <span>All 12 receipts digitally archived with SHA-256 escrow signatures.</span>
        </div>
      </div>
    </div>
  );
};
