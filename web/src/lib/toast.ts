import { toast, type ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  autoClose: 4000,
};

export function notifySuccess(message: string, options?: ToastOptions) {
  toast.success(message, { ...defaultOptions, ...options });
}

export function notifyError(message: string, options?: ToastOptions) {
  toast.error(message, { ...defaultOptions, ...options });
}

export function notifyErrorFromUnknown(
  error: unknown,
  fallbackMessage: string,
  options?: ToastOptions,
) {
  const message = error instanceof Error ? error.message : fallbackMessage;
  notifyError(message, options);
}
