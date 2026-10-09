import React, { useState } from 'react';
import { RentPayment } from '../types';
import { X, CreditCard, Landmark, CheckCircle, Shield, Printer } from 'lucide-react';

interface PaymentModalProps {
  payment: RentPayment;
  onClose: () => void;
  onSuccess: (paymentId: string, method: 'CARD' | 'UPI' | 'NET_BANKING') => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  payment,
  onClose,
  onSuccess
}) => {
  const [method, setMethod] = useState<'CARD' | 'NET_BANKING' | 'UPI'>('NET_BANKING');
  const [accountNumber, setAccountNumber] = useState('**** 9842 (Chase Checking)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    receiptNumber: string;
    ref: string;
    date: string;
  } | null>(null);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedReceipt = {
        receiptNumber: `RCP-SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        ref: `SN-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      };
      setReceiptData(generatedReceipt);
      setIsProcessing(false);
      setIsDone(true);
      onSuccess(payment.id, method);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isDone ? 'Payment Confirmed' : 'Settle Monthly Rent'}
            </h2>
            <p className="text-xs text-slate-500">{payment.billingMonth} · {payment.propertyTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {isDone && receiptData ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle size={28} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Payment Succeeded</h3>
              <p className="text-xs text-slate-500 mt-1">
                Amount of <strong className="font-mono text-slate-900 font-bold">₹{payment.amount.toLocaleString('en-IN')}</strong> transferred to verified escrow.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Receipt Number:</span>
                <span className="font-bold text-slate-900">{receiptData.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Transaction Reference:</span>
                <span className="text-slate-700">{receiptData.ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Payment Date:</span>
                <span className="text-slate-700">{receiptData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Tenant:</span>
                <span className="text-slate-700">{payment.tenantName}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Printer size={14} />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Due</span>
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400 block">Due By</span>
                <span className="font-semibold text-slate-700">{payment.dueDate}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMethod('UPI');
                    setAccountNumber('tenant@oksbi (Google Pay / PhonePe)');
                  }}
                  className={`p-3 rounded-lg border text-xs text-center flex flex-col items-center gap-1.5 transition-all ${
                    method === 'UPI' ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold' : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Shield size={18} />
                  <span>UPI / Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('NET_BANKING');
                    setAccountNumber('HDFC Bank NetBanking (A/c **9842)');
                  }}
                  className={`p-3 rounded-lg border text-xs text-center flex flex-col items-center gap-1.5 transition-all ${
                    method === 'NET_BANKING' ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold' : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Landmark size={18} />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMethod('CARD');
                    setAccountNumber('**** 4242 (RuPay / Visa)');
                  }}
                  className={`p-3 rounded-lg border text-xs text-center flex flex-col items-center gap-1.5 transition-all ${
                    method === 'CARD' ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold' : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <CreditCard size={18} />
                  <span>Debit / Card</span>
                </button>
              </div>
            </div>

            {/* Account Info Simulation */}
            <div className="text-xs">
              <label className="block text-slate-600 mb-1 font-medium">Selected Account / VPA</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <Shield size={14} className="text-teal-600 shrink-0" />
              <span>SafeNest Verified Escrow: Zero convenience fee · Instant GST invoice receipt.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 rounded-lg shadow-sm transition-colors"
              >
                {isProcessing ? 'Processing Transaction...' : `Pay ₹${payment.amount.toLocaleString('en-IN')}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
