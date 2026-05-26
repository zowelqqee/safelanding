"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintMoveBriefButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      data-print-hidden="true"
      variant="outline"
      size="sm"
      className="rounded-full border-[var(--city-border)] bg-transparent text-stone-700 hover:bg-[var(--city-card)]"
      onClick={() => window.print()}
    >
      {label}
      <Printer className="h-3.5 w-3.5" />
    </Button>
  );
}
