"use client";

import { useEffect, useState } from "react";

function formatRemaining(ms: number) {
  if (ms <= 0) return "0d 0h 0m";
  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${days}d ${hours}h ${minutes}m`;
}

export function BannerSoldCountdown({
  endDate,
  className = "",
  prefix = "Available in",
}: {
  endDate: string | Date;
  className?: string;
  prefix?: string;
}) {
  const endMs = new Date(endDate).getTime();
  const [remaining, setRemaining] = useState(() => formatRemaining(endMs - Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(formatRemaining(endMs - Date.now()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [endMs]);

  return (
    <span className={className}>
      {prefix} {remaining}
    </span>
  );
}
