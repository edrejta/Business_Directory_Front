import React from 'react'
import { PLASMIC } from '@/lib/plasmic/loader'

// Note: This is a minimal example. Install Plasmic packages and adapt to your preferred workflow.
export default async function PlasmicCatchAll({ params }: { params: { plasmic?: string[] } }) {
  const path = '/' + (params.plasmic ? params.plasmic.join('/') : '');

  // Runtime loading approach (requires @plasmicapp/loader-nextjs)
  try {
    const page = await PLASMIC.fetchComponentData({ path })
    if (!page || !page.entryCompMetas || page.entryCompMetas.length === 0) {
      return <div>No Plasmic page found for {path}</div>
    }
    const compName = page.entryCompMetas[0].name
    const Component = PLASMIC.getComponent(compName)
    return <Component {...(page.params || {})} />
  } catch (err) {
    // If loader not configured or packages not installed, show helpful message.
     
    console.error(err)
    return (
      <div>
        Plasmic loader not available — follow <a href="/plasmic/README.md">plasmic/README.md</a> to set up.
      </div>
    )
  }
}
