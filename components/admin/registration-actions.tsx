"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import WalkInRegistrationModal from "./walk-in-registration-modal";

export default function RegistrationActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 inline-flex items-center gap-2 rounded-xl bg-patasi px-5 py-3 text-sm font-semibold text-white hover:bg-patasi/90"
      >
        <Plus className="h-4 w-4" />
        Register Walk In
      </button>

      <WalkInRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
}
