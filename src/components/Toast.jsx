import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let bgClass = 'bg-emerald-600 text-white shadow-emerald-500/20';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          bgClass = 'bg-rose-600 text-white shadow-rose-500/20';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgClass = 'bg-indigo-600 text-white shadow-indigo-500/20';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 animate-slide-up ${bgClass}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 rounded-lg hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
