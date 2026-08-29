import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  confirmAction: (options: ConfirmationOptions) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalOptions, setModalOptions] = useState<ConfirmationOptions | null>(null);

  useEffect(() => {
    if (!modalOptions) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOptions]);

  const confirmAction = (options: ConfirmationOptions) => {
    setModalOptions(options);
  };

  const handleConfirm = () => {
    if (modalOptions) {
      modalOptions.onConfirm();
      setModalOptions(null);
    }
  };

  const handleCancel = () => {
    if (modalOptions && modalOptions.onCancel) {
      modalOptions.onCancel();
    }
    setModalOptions(null);
  };

  return (
    <ModalContext.Provider value={{ confirmAction }}>
      {children}
      <AnimatePresence>
        {modalOptions && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      modalOptions.isDestructive
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{modalOptions.title}</h3>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {modalOptions.message}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  {modalOptions.cancelText || 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-xs ${
                    modalOptions.isDestructive
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {modalOptions.confirmText || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
