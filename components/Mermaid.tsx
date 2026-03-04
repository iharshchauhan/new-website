'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
  const diagramId = useMemo(
    () => `mermaid-diagram-${Math.random().toString(36).slice(2, 10)}`,
    [],
  )

  useEffect(() => {
    let isCancelled = false

    const renderDiagram = async () => {
      if (!ref.current) {
        return
      }

      ensureMermaidInitialized()

      try {
        const { svg, bindFunctions } = await mermaid.render(diagramId, chart.trim())
        if (isCancelled || !ref.current) {
          return
        }
        ref.current.innerHTML = svg
        bindFunctions?.(ref.current)
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
      if (ref.current) {
        ref.current.innerHTML = ''
      }
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
