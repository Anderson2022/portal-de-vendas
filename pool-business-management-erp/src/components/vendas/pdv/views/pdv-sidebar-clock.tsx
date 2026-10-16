"use client";

import { CalendarDays, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function PdvSidebarClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="card p-3 text-ink-900" aria-label="Data e hora de Cuiabá">
      <div className="flex items-center gap-2">
        <CalendarDays size={20} className="shrink-0" />
        <div className="min-w-0 text-xs leading-5">
          <p className="capitalize">
            {now?.toLocaleDateString("pt-BR", {
              weekday: "long",
              timeZone: "America/Cuiaba",
            }) ?? "—"}
          </p>
          <p>
            {now?.toLocaleDateString("pt-BR", {
              dateStyle: "long",
              timeZone: "America/Cuiaba",
            }) ?? "—"}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-ink-100 pt-2">
        <time className="text-2xl font-bold">
          {now?.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Cuiaba",
          }) ?? "—"}
        </time>
        <Sun size={22} className="text-amber-400" />
        <span className="text-xs text-ink-700">Cuiabá - MT</span>
      </div>
    </div>
  );
}
