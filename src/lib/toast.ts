/**
 * A tiny toast store. Call `toast({...})` from anywhere in client code;
 * <Toaster /> in the root layout shows the messages.
 */
export interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "error";
}

type Listener = (toasts: ToastMessage[]) => void;

const DURATION_MS = 4000;
let toasts: ToastMessage[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener(toasts);
}

export function toast(message: Omit<ToastMessage, "id">): number {
  const id = nextId++;
  toasts = [...toasts, { id, ...message }];
  emit();
  setTimeout(() => dismissToast(id), DURATION_MS);
  return id;
}

export function dismissToast(id: number) {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
}

export function subscribeToToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts(): ToastMessage[] {
  return toasts;
}

const EMPTY: ToastMessage[] = [];
export function getServerToasts(): ToastMessage[] {
  return EMPTY;
}
