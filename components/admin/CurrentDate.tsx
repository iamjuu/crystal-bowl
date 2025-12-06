"use client";

import { useEffect, useState } from "react";

export default function CurrentDate() {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
  }, []);

  if (!date) {
    return (
      <div className="rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 border border-zinc-700/50">
        Loading...
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 border border-zinc-700/50">
      {date}
    </div>
  );
}

