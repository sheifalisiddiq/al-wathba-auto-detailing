import type { ReactNode } from "react";

/** Re-mounts on every navigation: a gold light bar sweeps up and lifts the curtain off the new page. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="route-curtain" aria-hidden="true"><i /></div>
      {children}
    </>
  );
}
