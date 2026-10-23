import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Delete, Unlock, AlertCircle } from 'lucide-react';

export const AppLockModal: React.FC = () => {
  const { isLocked, unlockApp, updateSettings } = useApp();
  const [pin, setPin] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [showForgotConfirm, setShowForgotConfirm] = useState<boolean>(false);

  if (!isLocked) return null;

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setHasError(false);

    if (nextPin.length === 4) {
      setTimeout(() => {
        const success = unlockApp(nextPin);
        if (!success) {
          setHasError(true);
          setPin('');
        }
      }, 150);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setHasError(false);
  };

  const handleEmergencyResetPin = () => {
    updateSettings({ pinLock: { enabled: false, pinCode: '' } });
    setShowForgotConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#091511] flex flex-col items-center justify-between p-6 sm:p-12 select-none">
      {/* Top Lock Icon and Prompt */}
      <div className="flex flex-col items-center mt-8 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#142e23] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-xl">
          <Lock className="w-8 h-8" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-white">Enter PIN</h2>
          <p className="text-xs text-slate-400">Hamdeen is locked for your privacy</p>
        </div>

        {/* 4 PIN Dots */}
        <div className={`flex items-center gap-4 pt-3 ${hasError ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isFilled
                    ? 'bg-[#d4af37] border-[#d4af37] shadow-[0_0_10px_#d4af37]'
                    : hasError
                    ? 'border-rose-500 bg-rose-950/40'
                    : 'border-slate-600 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {hasError && (
          <span className="text-xs font-semibold text-rose-400">Incorrect PIN code</span>
        )}
      </div>

      {/* Numeric Keypad Grid (matches Screen 16) */}
      <div className="w-full max-w-xs space-y-3 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-16 rounded-2xl bg-[#11261e] border border-white/5 text-xl font-bold text-white hover:bg-[#183a2d] active:scale-95 transition-all flex items-center justify-center shadow-sm"
            >
              {num}
            </button>
          ))}

          {/* Bottom row: Blank/Forgot, 0, Backspace */}
          <button
            onClick={() => setShowForgotConfirm(true)}
            className="h-16 rounded-2xl text-[11px] font-medium text-slate-400 hover:text-[#d4af37] transition-colors flex items-center justify-center"
          >
            Forgot?
          </button>

          <button
            onClick={() => handleDigit('0')}
            className="h-16 rounded-2xl bg-[#11261e] border border-white/5 text-xl font-bold text-white hover:bg-[#183a2d] active:scale-95 transition-all flex items-center justify-center shadow-sm"
          >
            0
          </button>

          <button
            onClick={handleBackspace}
            className="h-16 rounded-2xl bg-[#11261e] border border-white/5 text-slate-300 hover:text-white hover:bg-[#183a2d] active:scale-95 transition-all flex items-center justify-center shadow-sm"
            title="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Emergency Reset Dialog */}
      {showForgotConfirm && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#0e221b] border border-[#d4af37]/30 rounded-3xl p-6 w-full max-w-sm space-y-4 text-center">
            <AlertCircle className="w-8 h-8 text-[#d4af37] mx-auto" />
            <h4 className="text-base font-bold text-white">Reset PIN Code?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you forgot your PIN code, you can disable app lock now. Your prayer logs and bookmarks will remain intact.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowForgotConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyResetPin}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 shadow-md"
              >
                Disable App Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
