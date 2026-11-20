import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (mode: 'signup' | 'login', name: string, email: string) => void;
  onDemoLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onDemoLogin,
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid student or personal email address.');
      return;
    }
    if (mode === 'signup' && name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 4) {
      setError('Please enter a password (at least 4 characters for demo login).');
      return;
    }

    const derivedName =
      mode === 'signup'
        ? name.trim()
        : trimmedEmail.split('@')[0].replace(/[._]/g, ' ');
    onAuthSuccess(mode, derivedName, trimmedEmail);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2
              id="auth-modal-title"
              className="font-display text-xl font-bold text-slate-900"
            >
              {mode === 'signup' ? 'Join the CampusBridge Beta' : 'Sign in to CampusBridge'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Local prototype authentication (stored in your browser)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Full name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Riya Bisht"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A]"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                College email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dgu.ac.in"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A]"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 4 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/25 focus:border-[#1E3A8A]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 min-h-[44px] rounded-xl bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-[#172D6E] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {mode === 'signup' ? 'Continue to profile setup' : 'Sign in to feed'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-200">
            <button
              type="button"
              onClick={onDemoLogin}
              className="w-full py-2.5 px-4 min-h-[44px] rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Instant Demo: Continue as DGU MBA Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
