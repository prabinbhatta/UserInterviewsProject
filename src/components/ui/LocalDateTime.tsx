"use client";

import { useSyncExternalStore } from "react";

// Server components render server-side, in the server's own timezone —
// which is neither the researcher's nor the participant's. Rendering
// here instead means the browser's own local timezone is used, same as
// any calendar app.
//
// useSyncExternalStore (rather than useEffect+useState) is what actually
// forces the client-only render to replace the server placeholder: a
// plain suppressHydrationWarning span never gets patched after hydration
// (React deliberately trusts the server output once told to suppress the
// mismatch), so without this the real date would never appear.
function subscribe() {
  return () => {};
}

export function LocalDateTime({ iso }: { iso: string }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) {
    return <span suppressHydrationWarning> </span>;
  }

  return (
    <span>
      {new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </span>
  );
}
