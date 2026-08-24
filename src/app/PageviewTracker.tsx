"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "@/lib/logEvent";

export function PageviewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    logEvent("pageview", pathname);
  }, [pathname]);

  return null;
}
