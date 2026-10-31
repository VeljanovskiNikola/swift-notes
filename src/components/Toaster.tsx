"use client";

import { useSyncExternalStore } from "react";
import { dismissToast, getServerToasts, getToasts, subscribeToToasts } from "@/lib/toast";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/cn";

export function Toaster() {
  const toasts = useSyncExternalStore(subscribeToToasts, getToasts, getServerToasts);

  return (
    <section
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[380px] max-w-[calc(100%-2rem)] flex-col gap-2"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          role={item.variant === "error" ? "alert" : "status"}
          className="bg-card border-border animate-toast-in pointer-events-auto flex items-start gap-3 rounded-[10px] border p-4 text-sm shadow-[0_10px_30px_rgb(0_0_0/0.4)]"
        >
          <div className="flex-1">
            <p className={cn("font-semibold", item.variant === "error" && "text-danger")}>
              {item.title}
            </p>
            {item.description && <p className="text-muted mt-0.5">{item.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(item.id)}
            aria-label="Dismiss notification"
            className="text-muted hover:text-foreground cursor-pointer"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </section>
  );
}
