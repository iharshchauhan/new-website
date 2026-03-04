'use client'

import { useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'

let isMermaidInitialized = false

function ensureMermaidInitialized() {
  if (isMermaidInitialized) {
    return
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'strict',
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
    },
  })

  isMermaidInitialized = true
}

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const reactId = useId()
  const diagramId = `mermaid-diagram-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  useEffect(() => {
    let isCancelled = false
    const container = ref.current

    if (!container) {
      return
    }

    const renderDiagram = async () => {
      ensureMermaidInitialized()

      try {
        const { svg, bindFunctions } = await mermaid.render(diagramId, chart.trim())
        if (isCancelled) {
          return
        }
        container.innerHTML = svg
        bindFunctions?.(container)
        setHasError(false)
      } catch {
        if (!isCancelled) {
          setHasError(true)
        }
      }
    }

    renderDiagram()

    return () => {
      isCancelled = true
      container.innerHTML = ''
    }
  }, [chart, diagramId])

  if (hasError) {
    return (
      <pre className="mermaid-fallback">
        <code>{chart}</code>
      </pre>
    )
  }

  return (
    <div className="mermaid-svg not-prose" ref={ref} aria-label="Mermaid diagram" role="img" />
  )
}
