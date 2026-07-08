'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import type { DemoFiche, DemoRoadmap } from '@/lib/atelier/types'

type SearchResult = {
  type: 'fiche' | 'roadmap'
  slug: string
  title: string
  subtitle: string
}

type Props = {
  fiches: DemoFiche[]
  roadmaps: DemoRoadmap[]
  placeholder?: string
}

export default function BarreRecherche({ fiches, roadmaps, placeholder = 'Rechercher…' }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const q = query.trim().toLowerCase()
    if (!q) {
      setResults([])
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      const hits: SearchResult[] = []

      // Search in fiches
      for (const f of fiches) {
        let match = false
        match ||= f.title.toLowerCase().includes(q)
        match ||= f.question.toLowerCase().includes(q)
        match ||= f.summary.toLowerCase().includes(q)
        match ||= f.tags.some((t) => t.toLowerCase().includes(q))
        match ||= f.category.toLowerCase().includes(q)
        match ||= f.tool.toLowerCase().includes(q)
        match ||= f.sections.some((s) =>
          s.title.toLowerCase().includes(q) ||
          s.paragraphs.some((p) => p.toLowerCase().includes(q))
        )
        if (match) {
          hits.push({ type: 'fiche', slug: f.slug, title: f.title, subtitle: f.question })
        }
      }

      // Search in roadmaps
      for (const r of roadmaps) {
        let match = false
        match ||= r.title.toLowerCase().includes(q)
        match ||= r.summary.toLowerCase().includes(q)
        match ||= r.steps.some((s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        )
        if (match) {
          hits.push({ type: 'roadmap', slug: r.slug, title: r.title, subtitle: r.summary })
        }
      }

      setResults(hits.slice(0, 12))
      setIsOpen(hits.length > 0)
      setFocusedIndex(-1)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fiches, roadmaps])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        const item = results[focusedIndex]
        if (item) {
          router.push(item.type === 'fiche' ? `/atelier/fiches/${item.slug}` : `/atelier/roadmaps/${item.slug}`)
          setIsOpen(false)
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    },
    [isOpen, results, focusedIndex, router],
  )

  const ficheCount = results.filter((r) => r.type === 'fiche').length
  const roadmapCount = results.filter((r) => r.type === 'roadmap').length

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <div
        className="flex items-center gap-2 bg-background border border-foreground/15 rounded-xl px-3 h-11 focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/15 transition-all duration-300 shadow-sm"
      >
        <span className="text-muted-foreground text-lg select-none">⌕</span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          className="border-none bg-transparent flex-1 outline-none text-sm font-inherit text-foreground placeholder:text-muted-foreground/60"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); inputRef.current?.focus() }}
            className="border-none bg-transparent cursor-pointer text-muted-foreground hover:text-foreground text-xs p-1"
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          className="absolute top-[calc(100%+0.5rem)] left-0 right-0 z-[100] bg-popover text-popover-foreground border border-foreground/10 rounded-2xl shadow-xl max-h-[400px] overflow-y-auto backdrop-blur-md"
        >
          {/* Group: Fiches */}
          {ficheCount > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-accent/90">
                Fiches ({ficheCount})
              </div>
              {results.filter((r) => r.type === 'fiche').map((item) => {
                const idx = results.indexOf(item)
                return (
                  <Link
                    key={`fiche-${item.slug}`}
                    href={`/atelier/fiches/${item.slug}`}
                    className={`block px-4 py-2 text-left transition-colors duration-200 ${
                      focusedIndex === idx ? 'bg-accent/10 border-l-2 border-accent pl-3.5' : 'border-l-2 border-transparent'
                    }`}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-semibold text-sm text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.subtitle}</div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Group: Roadmaps */}
          {roadmapCount > 0 && (
            <div className="py-2 border-t border-foreground/5">
              <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500/90">
                Roadmaps ({roadmapCount})
              </div>
              {results.filter((r) => r.type === 'roadmap').map((item) => {
                const idx = results.indexOf(item)
                return (
                  <Link
                    key={`roadmap-${item.slug}`}
                    href={`/atelier/roadmaps/${item.slug}`}
                    className={`block px-4 py-2 text-left transition-colors duration-200 ${
                      focusedIndex === idx ? 'bg-emerald-500/10 border-l-2 border-emerald-500 pl-3.5' : 'border-l-2 border-transparent'
                    }`}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-semibold text-sm text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.subtitle}</div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
