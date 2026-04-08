"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import CustomAlert, { AlertType } from "@/components/ui/CustomAlert";

interface AlertOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: AlertType;
  isDestructive?: boolean;
}


interface AlertContextType {
  showAlert: (message: string, options?: AlertOptions) => Promise<boolean>;
  showConfirm: (message: string, options?: AlertOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    message: string;
    type: AlertType;
    title?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    resolve: (value: boolean) => void;
  } | null>(null);


  const showAlert = useCallback((message: string, options: AlertOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setAlertState({
        isOpen: true,
        message,
        type: options.type || "info",
        title: options.title,
        confirmLabel: options.confirmLabel,
        isDestructive: options.isDestructive,
        resolve,
      });

    });
  }, []);

  const showConfirm = useCallback((message: string, options: AlertOptions = {}) => {
    return new Promise<boolean>((resolve) => {
      setAlertState({
        isOpen: true,
        message,
        type: "confirm",
        title: options.title,
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        isDestructive: options.isDestructive,
        resolve,
      });

    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (alertState) {
      alertState.resolve(true);
      setAlertState((prev) => prev ? { ...prev, isOpen: false } : null);
    }
  }, [alertState]);

  const handleCancel = useCallback(() => {
    if (alertState) {
      alertState.resolve(false);
      setAlertState((prev) => prev ? { ...prev, isOpen: false } : null);
    }
  }, [alertState]);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {alertState && (
        <CustomAlert
          isOpen={alertState.isOpen}
          type={alertState.type}
          title={alertState.title}
          message={alertState.message}
          confirmLabel={alertState.confirmLabel}
          cancelLabel={alertState.cancelLabel}
          isDestructive={alertState.isDestructive}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
