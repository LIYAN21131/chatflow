"use client";

import { useEffect, useState } from "react";

export function useAnalysisProgress() {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 13, 100));
    }, 220);

    return () => window.clearInterval(timer);
  }, []);

  return progress;
}
