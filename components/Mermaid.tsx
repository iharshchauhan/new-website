'use client'

import { useEffect, useRef, useState } from 'react'

type MermaidApi = (typeof import('mermaid'))['default']

let mermaidApi: MermaidApi | null = null
let isMermaidInitialized = false
let nextDiagramId = 0

async function getMermaidApi(): Promise<MermaidApi> {
  if (mermaidApi) {
    return mermaidApi
  }

  const mod = await import('mermaid')
  mermaidApi = mod.default
  return mermaidApi
}

async function ensureMermaidInitialized() {
  if (isMermaidInitialized) {
    return getMermaidApi()
  }

  const api = await getMermaidApi()

  api.initialize({
    startOnLoad: false,
    theme: 'neutral',
    securityLevel: 'strict',
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
    },
  })

  isMermaidInitialized = true
  return api
}

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [diagramId] = useState(() => {
    nextDiagramId += 1
    return `mermaid-diagram-${nextDiagramId}`
  })

  useEffect(() => {
    let isCancelled = false
    const container = ref.current

    if (!container) {
      return
    }

    const renderDiagram = async () => {
      try {
        const api = await ensureMermaidInitialized()
        const { svg, bindFunctions } = await api.render(diagramId, chart.trim())
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
