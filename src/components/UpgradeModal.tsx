import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Smartphone, X } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSimulatedPayment: () => void;
  plusClicksCount: number;
}

const UPI_APPS = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'] as const;

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onCompleteSimulatedPayment,
  plusClicksCount,
}) => {
  const [selectedApp, setSelectedApp] = useState<(typeof UPI_APPS)[number]>('Google Pay');
  const [upiId, setUpiId] = useState('student@okicici');
  const [paid, setPaid] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setPaid(true);
    onCompleteSimulatedPayment();
  };

  const handleClose = () => {
    setPaid(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-[#1E3A8A] text-white flex items-center justify-between">
          <div>
            <h2 id="upgrade-modal-title" className="font-display text-lg font-bold">
              CampusBridge Plus
            </h2>
            <p className="text-xs text-blue-100">
              Simulated UPI checkout — no real money charged
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close upgrade dialog"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-blue-100 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!paid ? (
          <form onSubmit={handleConfirm} className="p-6 space-y-5">
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Monthly Student Pass
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full Match %, 48h Deadline Alerts & Unlimited Tracker
                </p>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-bold text-[#1E3A8A] tabular-nums">
                  ₹99
                </span>
                <span className="text-xs text-slate-500">/mo</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2.5">
                Choose simulated UPI app
              </p>
              <div className="grid grid-cols-2 gap-2">
                {UPI_APPS.map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setSelectedApp(app)}
                    className={`px-3 py-2.5 min-h-[44px] rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                      selectedApp === app
                        ? 'border-[#1E3A8A] bg-blue-50/70 text-[#1E3A8A]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span className="truncate">{app}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="upi-id-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                UPI ID (demo simulation)
              </label>
              <input
                id="upi-id-input"
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A]"
              />
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between text-xs text-slate-600">
              <span>Willingness-to-pay signal logged</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                Click #{plusClicksCount}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 min-h-[48px] rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#0D9488] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Simulate ₹99 Payment via {selectedApp}
            </button>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                CampusBridge Plus Activated
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Simulated payment of ₹99 via {selectedApp} succeeded. Full Match %, deadline alerts, and unlimited application tracking are now unlocked.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] transition-colors cursor-pointer"
            >
              Return to your feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
