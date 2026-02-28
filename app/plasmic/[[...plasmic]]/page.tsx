import React from 'react';

// Plasmic pages are not configured in this build.
export default function PlasmicCatchAll() {
  return (
    <div className="p-4 text-center">
      Plasmic integration is disabled. Remove the <code>app/plasmic</code> folder if you
      don’t need it.
    </div>
  );
}
