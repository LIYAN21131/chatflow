"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";

export function useHydrateTaskStore() {
  const hydrate = useTaskStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
