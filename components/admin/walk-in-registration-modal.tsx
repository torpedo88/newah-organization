"use client";

import { useState } from "react";
import { X } from "lucide-react";
import DoorRegistrationForm from "./door-registration-form";

export default function WalkInRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <DoorRegistrationForm
          onSuccess={() => {
            onSuccess?.();
            setTimeout(onClose, 2000);
          }}
        />
      </div>
    </div>
  );
}
