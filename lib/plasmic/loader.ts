// Minimal Plasmic loader example. Try to require the loader package if available.
let PLASMIC: any = undefined;
try {
  // Use require so builds where @plasmicapp/loader-nextjs isn't available won't fail at import time.
   
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const plasmicMod = require("@plasmicapp/loader-nextjs");
  const create = plasmicMod?.createPlasmicLoader ?? plasmicMod?.initPlasmicLoader ?? plasmicMod?.default;
  if (typeof create === "function") {
    PLASMIC = create({
      projects: [
        { id: process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID || "", token: process.env.PLASMIC_API_TOKEN || undefined },
      ],
    });
  }
} catch {
  // ignore missing optional dependency
  PLASMIC = undefined;
}

export { PLASMIC };
