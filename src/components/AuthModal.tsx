import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { storage } from '../services/storageService';
import {
  X,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  HelpCircle,
  AlertCircle,
  KeyRound
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const SECURITY_QUESTIONS = [
  'What was the name of your first school?',
  "What was your childhood pet's name?",
  "What is your mother's maiden name?",
  'What is your favorite city in India?',
  'What was your primary school best friend name?'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess
}) => {
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER' | 'RECOVERY'>('LOGIN');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('sarah.chen@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+91 98765 12345');
  const [regRole, setRegRole] = useState<UserRole>('TENANT');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regSecurityQuestion, setRegSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
  const [regSecurityAnswer, setRegSecurityAnswer] = useState('');

  // Password Recovery state
  const [recEmail, setRecEmail] = useState('');
  const [recSecurityAnswer, setRecSecurityAnswer] = useState('');
  const [recNewPassword, setRecNewPassword] = useState('');
  const [recConfirmPassword, setRecConfirmPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const user = storage.loginWithCredentials(loginEmail, loginPassword);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (!regSecurityAnswer.trim()) {
      setErrorMessage('Please provide an answer to your security question.');
      return;
    }

    try {
      const newUser = storage.registerUser(
        regName,
        regEmail,
        regPassword,
        regRole,
        regPhone,
        regSecurityQuestion,
        regSecurityAnswer.trim()
      );
      onLoginSuccess(newUser);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (recNewPassword !== recConfirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    try {
      const user = storage.recoverPassword(recEmail, recSecurityAnswer, recNewPassword);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Password reset failed.');
    }
  };

  const fillDemo = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-600 text-white font-bold">
              <ShieldCheck size={18} />
            </span>
            <span className="text-base font-bold text-slate-900">SafeNest Portal Login</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => {
              setTab('LOGIN');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'LOGIN' ? 'border-teal-600 text-teal-800 bg-teal-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('REGISTER');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              tab === 'REGISTER' ? 'border-teal-600 text-teal-800 bg-teal-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register Account
          </button>
          <button
            onClick={() => {
              setTab('RECOVERY');
              setErrorMessage(null);
            }}
            className={`py-3 px-3 text-center border-b-2 transition-colors ${
              tab === 'RECOVERY' ? 'border-teal-600 text-teal-800 bg-teal-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Recovery
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800">
            <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* LOGIN TAB */}
        {tab === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs text-slate-800">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-700 font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setTab('RECOVERY');
                    setRecEmail(loginEmail);
                  }}
                  className="text-[11px] text-teal-700 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Quick Demo Credentials */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Quick Verified Demo Accounts
              </span>
              <div className="flex flex-col gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => fillDemo('sarah.chen@example.com', 'password123')}
                  className="text-left py-1.5 px-2 rounded hover:bg-slate-200/70 text-slate-700 flex justify-between items-center transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">Sarah Chen (Tenant)</span>
                    <span className="text-[10px] text-slate-500">sarah.chen@example.com</span>
                  </div>
                  <span className="text-teal-700 font-mono font-bold text-xs">Fill Credentials &gt;</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('marcus.vance@example.com', 'password123')}
                  className="text-left py-1.5 px-2 rounded hover:bg-slate-200/70 text-slate-700 flex justify-between items-center transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">Marcus Vance (Owner)</span>
                    <span className="text-[10px] text-slate-500">marcus.vance@example.com</span>
                  </div>
                  <span className="text-indigo-700 font-mono font-bold text-xs">Fill Credentials &gt;</span>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('admin@safenest.org', 'password123')}
                  className="text-left py-1.5 px-2 rounded hover:bg-slate-200/70 text-slate-700 flex justify-between items-center transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">David Miller (Admin)</span>
                    <span className="text-[10px] text-slate-500">admin@safenest.org</span>
                  </div>
                  <span className="text-amber-700 font-mono font-bold text-xs">Fill Credentials &gt;</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              Sign In to SafeNest
            </button>
          </form>
        )}

        {/* REGISTER TAB */}
        {tab === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 text-xs text-slate-800">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Select Account Persona</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('TENANT')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    regRole === 'TENANT' ? 'bg-teal-50 border-teal-600 text-teal-800' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <UserCheck size={14} />
                  <span>Tenant (Renter)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('OWNER')}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    regRole === 'OWNER' ? 'bg-indigo-50 border-indigo-600 text-indigo-800' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>Property Owner</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Full Legal Name</label>
              <div className="relative">
                <UserIcon size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Valid Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="priya.sharma@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Mobile Contact</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Re-type password"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Security Question & Answer (Required Requirement) */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="block text-slate-900 font-semibold flex items-center gap-1.5">
                <HelpCircle size={14} className="text-teal-600" />
                <span>Security Verification Question</span>
              </label>
              <select
                value={regSecurityQuestion}
                onChange={e => setRegSecurityQuestion(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {SECURITY_QUESTIONS.map((q, idx) => (
                  <option key={idx} value={q}>{q}</option>
                ))}
              </select>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Type your secret answer (e.g. St. Xavier's High School)"
                  value={regSecurityAnswer}
                  onChange={e => setRegSecurityAnswer(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Used for account recovery and identity verification.
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors mt-2"
            >
              Register & Sign In
            </button>
          </form>
        )}

        {/* RECOVERY TAB */}
        {tab === 'RECOVERY' && (
          <form onSubmit={handleRecoverySubmit} className="p-6 space-y-3.5 text-xs text-slate-800">
            <div>
              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                Answer the security question registered with your SafeNest account to reset your password.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Registered Email Address</label>
              <input
                type="email"
                required
                value={recEmail}
                onChange={e => setRecEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="sarah.chen@example.com"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Security Question Answer (e.g. First school name or childhood pet)
              </label>
              <input
                type="text"
                required
                value={recSecurityAnswer}
                onChange={e => setRecSecurityAnswer(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Type your security answer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={recNewPassword}
                  onChange={e => setRecNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                  placeholder="Min 6 chars"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={recConfirmPassword}
                  onChange={e => setRecConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none font-mono"
                  placeholder="Re-type password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
            >
              Verify Answer & Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
