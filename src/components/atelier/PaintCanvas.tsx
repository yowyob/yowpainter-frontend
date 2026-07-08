'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { generatePaintCommands, type AIContext, type DrawCommand } from '@/lib/atelier/aiPaintService'
import { useDemoStore } from '@/lib/atelier/context/DemoStoreContext'

// ─── Palettes de couleurs artistiques ───────────────────────────────────────────
const PALETTES = {
  terres: {
    label: 'Terres & Tradition',
    colors: ['#201712', '#3f2c22', '#5b3221', '#9d6a3b', '#d6b189', '#eadfce', '#e6d9c7', '#7b6b5d', '#7a2a1a', '#b05a2a']
  },
  impressionniste: {
    label: 'Impressionnisme',
    colors: ['#2a4a6a', '#4a7aaa', '#8abadf', '#6a7662', '#a0b08a', '#c8b45a', '#d44a2a', '#e8884a', '#fffdfa', '#f8f1e7']
  },
  pop: {
    label: 'Pop / Moderne',
    colors: ['#ff0055', '#ff5500', '#ffcc00', '#33cc33', '#0099ff', '#7700ff', '#ff00ff', '#000000', '#888888', '#ffffff']
  },
  monochrome: {
    label: 'Monochrome',
    colors: ['#000000', '#222222', '#444444', '#666666', '#888888', '#aaaaaa', '#cccccc', '#eeeeee', '#ffffff', '#eadfce']
  }
} as const

type PaletteType = keyof typeof PALETTES

const TOOLS = [
  { id: 'pencil',      label: 'Crayon',       icon: '✏️',   desc: 'Trait fin et précis' },
  { id: 'brush',       label: 'Pinceau',      icon: '🖌️',   desc: 'Trait fluide classique' },
  { id: 'calligraphy', label: 'Calligraphie', icon: '🖋️',   desc: 'Plume plate biseautée' },
  { id: 'spray',       label: 'Aérographe',   icon: '💨',   desc: 'Spray moucheté texturé' },
  { id: 'highlighter', label: 'Surligneur',   icon: '🖍️',   desc: 'Trait large semi-transparent' },
  { id: 'eraser',      label: 'Gomme',        icon: '⬜',   desc: 'Gommer la peinture' },
  { id: 'fill',        label: 'Remplir',      icon: '🪣',   desc: 'Remplir une zone' },
  { id: 'line',        label: 'Ligne',        icon: '╱',    desc: 'Ligne droite' },
  { id: 'rect',        label: 'Rectangle',    icon: '▭',    desc: 'Dessiner un rectangle' },
  { id: 'circle',      label: 'Cercle',       icon: '○',    desc: 'Dessiner un cercle' },
  { id: 'triangle',    label: 'Triangle',     icon: '▲',    desc: 'Dessiner un triangle' },
] as const

const SIZES = [2, 4, 8, 14, 22, 32, 48]

function hexToRgba(hex: string): [number, number, number, number] {
  // Handle HSL strings if returned by mistake
  if (hex.startsWith('hsl')) {
    return [150, 150, 150, 255]
  }
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex
  const r = parseInt(cleanHex.slice(0, 2), 16) || 0
  const g = parseInt(cleanHex.slice(2, 4), 16) || 0
  const b = parseInt(cleanHex.slice(4, 6), 16) || 0
  return [r, g, b, 255]
}

function floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, fillColor: string) {
  const canvas = ctx.canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const idx = (Math.round(y) * canvas.width + Math.round(x)) * 4
  const target = [data[idx], data[idx+1], data[idx+2], data[idx+3]]
  const fill = hexToRgba(fillColor)
  if (target.every((v, i) => v === fill[i])) return

  const stack = [[Math.round(x), Math.round(y)]]
  const w = canvas.width, h = canvas.height
  const visited = new Uint8Array(w * h)

  function match(i: number) {
    return data[i] === target[0] && data[i+1] === target[1] && data[i+2] === target[2] && data[i+3] === target[3]
  }
  function paint(px: number, py: number) {
    const i = (py * w + px) * 4
    data[i] = fill[0]; data[i+1] = fill[1]; data[i+2] = fill[2]; data[i+3] = fill[3]
  }

  while (stack.length) {
    const [cx, cy] = stack.pop()!
    if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue
    const vi = cy * w + cx
    if (visited[vi]) continue
    visited[vi] = 1
    if (!match((cy * w + cx) * 4)) continue
    paint(cx, cy)
    stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1])
  }
  ctx.putImageData(imageData, 0, 0)
}

function PanelContent({
  tool, setTool,
  color, setColor,
  bgColor, setBgColor,
  size, setSize,
  opacity, setOpacity,
  colorTarget, setColorTarget,
  activePalette, setActivePalette,
  drawCanvasRef,
  bgCanvasRef: _bgCanvasRef,
  fileInputRef,
  isOpen, setIsOpen,
  mode,
  canUndo, canRedo,
  handleUndo, handleRedo,
  handleClearCanvas,
  handleDownload,
  isAiPainting,
  aiStatusMessage,
  handleAiPaint,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: {
  tool: string
  setTool: (t: string) => void
  color: string
  setColor: (c: string) => void
  bgColor: string
  setBgColor: (c: string) => void
  size: number
  setSize: (s: number) => void
  opacity: number
  setOpacity: (o: number) => void
  colorTarget: 'fg' | 'bg'
  setColorTarget: (t: 'fg' | 'bg') => void
  activePalette: PaletteType
  setActivePalette: (p: PaletteType) => void
  drawCanvasRef: React.RefObject<HTMLCanvasElement | null>
  bgCanvasRef: React.RefObject<HTMLCanvasElement | null>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isOpen: boolean
  setIsOpen: (o: boolean) => void
  mode: 'floating' | 'panel'
  canUndo: boolean
  canRedo: boolean
  handleUndo: () => void
  handleRedo: () => void
  handleClearCanvas: () => void
  handleDownload: () => void
  isAiPainting: boolean
  aiStatusMessage: string
  handleAiPaint: () => void
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void
  onTouchEnd: () => void
}) {
  useEffect(() => {
    const ctx = _bgCanvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }, [bgColor, _bgCanvasRef])

  return (
    <div className="flex flex-col h-full bg-[#f4ece1] font-sans text-[#2a2019]">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#2a2019] border-b-2 border-black/30">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          <span className="font-serif text-[#d6b189] text-base font-bold tracking-wide">
            Atelier de Création
          </span>
        </div>

        {/* Undo/Redo & Utility Actions */}
        <div className="flex gap-1.5 items-center">
          <button
            onClick={handleUndo}
            disabled={!canUndo || isAiPainting}
            title="Annuler (Ctrl+Z)"
            className={`w-8 h-8 rounded flex items-center justify-center text-sm border transition-colors ${
              canUndo && !isAiPainting 
                ? 'bg-[#d6b189]/20 border-[#d6b189]/30 text-[#d6b189] hover:bg-[#d6b189]/30' 
                : 'border-[#d6b189]/10 text-[#d6b189]/30 cursor-not-allowed'
            }`}
          >
            ↩️
          </button>

          <button
            onClick={handleRedo}
            disabled={!canRedo || isAiPainting}
            title="Rétablir (Ctrl+Y)"
            className={`w-8 h-8 rounded flex items-center justify-center text-sm border transition-colors ${
              canRedo && !isAiPainting 
                ? 'bg-[#d6b189]/20 border-[#d6b189]/30 text-[#d6b189] hover:bg-[#d6b189]/30' 
                : 'border-[#d6b189]/10 text-[#d6b189]/30 cursor-not-allowed'
            }`}
          >
            ↪️
          </button>

          <div className="w-[1px] h-5 bg-[#d6b189]/20 mx-1" />

          {/* AI Inspiration Button */}
          <button
            onClick={handleAiPaint}
            disabled={isAiPainting}
            title="Peinture guidée par l'IA"
            className={`w-8 h-8 rounded flex items-center justify-center text-sm border transition-all duration-300 ${
              isAiPainting 
                ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300 animate-pulse' 
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/25'
            }`}
          >
            💡
          </button>

          <div className="w-[1px] h-5 bg-[#d6b189]/20 mx-1" />

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Importer une image de fond"
            className="w-8 h-8 rounded bg-[#d6b189]/15 border border-[#d6b189]/30 text-[#d6b189] hover:bg-[#d6b189]/25 flex items-center justify-center text-sm transition-colors"
          >
            🖼️
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={() => {}}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            onClick={handleDownload}
            title="Télécharger l'œuvre"
            className="w-8 h-8 rounded bg-[#d6b189]/15 border border-[#d6b189]/30 text-[#d6b189] hover:bg-[#d6b189]/25 flex items-center justify-center text-sm transition-colors"
          >
            ⬇️
          </button>

          <button
            onClick={handleClearCanvas}
            title="Tout effacer"
            className="w-8 h-8 rounded bg-[#d6b189]/15 border border-[#d6b189]/30 text-[#d6b189] hover:bg-[#d6b189]/25 flex items-center justify-center text-sm transition-colors"
          >
            🗑️
          </button>

          {mode === 'floating' && (
            <button
              onClick={() => setIsOpen(false)}
              title="Fermer"
              className="w-8 h-8 rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/35 flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Toolbar & Settings */}
      <div className="flex flex-col gap-2 p-3 bg-[#ebdcc5] border-b border-black/15">
        {/* Row 1: Brush styles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-[#5b3221] mr-1 min-w-[40px]">Style :</span>
          {TOOLS.map(t => (
            <button
              key={t.id}
              title={`${t.label} : ${t.desc}`}
              onClick={() => setTool(t.id)}
              className={`px-2.5 py-1 text-xs border rounded transition-all flex items-center gap-1 ${
                tool === t.id 
                  ? 'border-[#9d6a3b] border-2 bg-[#fff9f0] font-bold' 
                  : 'border-[#2a2019]/20 bg-white/35 hover:bg-white/50'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Row 2: Thickness, Opacity, and Live Preview */}
        <div className="flex items-center gap-4 flex-wrap border-t border-dashed border-[#2a2019]/15 pt-2 mt-0.5">
          {/* Thickness buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5b3221] mr-1">Taille :</span>
            {SIZES.map(s => (
              <button
                key={s}
                title={`Épaisseur ${s}px`}
                onClick={() => setSize(s)}
                className={`w-7.5 h-7.5 border rounded flex items-center justify-center transition-all ${
                  size === s 
                    ? 'border-[#9d6a3b] border-2 bg-[#fff9f0]' 
                    : 'border-[#2a2019]/20 bg-white/35 hover:bg-white/50'
                }`}
              >
                <div 
                  className="rounded-full bg-[#2a2019]" 
                  style={{
                    width: `${Math.min(s * 0.7 + 1, 16)}px`,
                    height: `${Math.min(s * 0.7 + 1, 16)}px`,
                  }} 
                />
              </button>
            ))}
          </div>

          {/* Opacity slider */}
          <div className="flex items-center gap-2 flex-1 min-w-[150px]">
            <span className="text-xs font-bold text-[#5b3221]">Opacité:</span>
            <input
              type="range"
              min="1"
              max="100"
              value={opacity}
              onChange={e => setOpacity(parseInt(e.target.value))}
              className="flex-1 cursor-pointer accent-[#9d6a3b]"
            />
            <span className="text-xs font-bold w-8 text-right">{opacity}%</span>
          </div>

          {/* Brush Preview Widget */}
          <div className="flex items-center gap-2 bg-white/45 px-2.5 py-1 border border-[#2a2019]/15 rounded">
            <span className="text-[10px] text-[#5b3221] font-bold">Aperçu :</span>
            <div 
              className="w-8 h-8 flex items-center justify-center border border-[#2a2019]/20"
              style={{ background: 'repeating-conic-gradient(#fff 0% 25%, #ddd 0% 50%) 50% / 8px 8px' }}
            >
              <div 
                style={{
                  width: `${Math.max(2, Math.min(size, 28))}px`,
                  height: `${Math.max(2, Math.min(size, 28))}px`,
                  borderRadius: tool === 'highlighter' || tool === 'rect' ? '0' : '50%',
                  background: tool === 'eraser' ? '#ffffff' : color,
                  opacity: opacity / 100,
                  border: tool === 'eraser' ? '1px dashed #aaa' : 'none',
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Drawing Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-3 bg-[#cbd2c7] relative">
        <style>{`
          @keyframes aiPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.03); opacity: 1; }
          }
        `}</style>
        <div className="relative w-[640px] h-[480px] max-w-full max-h-full">
          {/* Background canvas */}
          <canvas
            ref={_bgCanvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full block"
          />
          {/* Drawing canvas */}
          <canvas
            ref={drawCanvasRef}
            width={640}
            height={480}
            onMouseDown={isAiPainting ? undefined : onMouseDown}
            onMouseMove={isAiPainting ? undefined : onMouseMove}
            onMouseUp={isAiPainting ? undefined : onMouseUp}
            onMouseLeave={isAiPainting ? undefined : onMouseLeave}
            onTouchStart={isAiPainting ? undefined : onTouchStart}
            onTouchMove={isAiPainting ? undefined : onTouchMove}
            onTouchEnd={isAiPainting ? undefined : onTouchEnd}
            className="relative block w-full h-full shadow-lg border border-black/10"
            style={{ cursor: isAiPainting ? 'not-allowed' : 'crosshair' }}
          />

          {/* AI Painting Overlay */}
          {isAiPainting && aiStatusMessage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 z-10 pointer-events-none">
              <div
                className="bg-[#2a2019]/90 text-[#d6b189] px-6 py-3.5 rounded-xl text-sm font-semibold text-center border border-[#d6b189]/30 max-w-[85%]"
                style={{ animation: 'aiPulse 1.5s ease-in-out infinite' }}
              >
                {aiStatusMessage}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Colors & Palette Drawer */}
      <div className="p-3 bg-[#ebdcc5] border-t border-[#2a2019]/20 flex flex-col gap-1.5">
        <div className="flex gap-1.5 items-center">
          <span className="text-xs font-bold text-[#5b3221] mr-1">Palette :</span>
          {(Object.keys(PALETTES) as PaletteType[]).map((pKey) => (
            <button
              key={pKey}
              onClick={() => setActivePalette(pKey)}
              className={`px-2 py-0.5 text-[10px] uppercase tracking-wider rounded border transition-colors ${
                activePalette === pKey 
                  ? 'bg-[#2a2019] text-white border-transparent font-bold' 
                  : 'bg-white/45 text-[#2a2019] border-[#2a2019]/20 hover:bg-white/60'
              }`}
            >
              {PALETTES[pKey].label}
            </button>
          ))}
        </div>

        {/* Color circles & custom pickers */}
        <div className="flex items-center gap-2 flex-wrap border-t border-dashed border-[#2a2019]/15 pt-2">
          {/* Active Colors (FG/BG) Swapper */}
          <div className="relative w-12 h-9 cursor-pointer flex-shrink-0 mr-1.5">
            <div
              onClick={() => setColorTarget('bg')}
              title="Couleur d'arrière-plan"
              className={`absolute bottom-0 right-0 w-6 h-6 border shadow-sm z-10 ${
                colorTarget === 'bg' ? 'border-[#9d6a3b] border-2 z-20 scale-105' : 'border-[#2a2019]/40'
              }`}
              style={{ backgroundColor: bgColor }}
            />
            <div
              onClick={() => setColorTarget('fg')}
              title="Couleur du pinceau"
              className={`absolute top-0 left-0 w-6 h-6 border shadow z-10 ${
                colorTarget === 'fg' ? 'border-[#9d6a3b] border-2 z-20 scale-105' : 'border-[#2a2019]/40'
              }`}
              style={{ backgroundColor: color }}
            />
          </div>

          <div className="w-[1px] h-6 bg-[#2a2019]/15 mx-0.5" />

          {/* Render Active Palette Colors */}
          <div className="flex gap-1 flex-wrap items-center">
            {PALETTES[activePalette].colors.map(c => (
              <button
                key={c}
                title={c}
                onClick={() => {
                  if (colorTarget === 'fg') {
                    setColor(c)
                  } else {
                    setBgColor(c)
                  }
                }}
                className={`w-6 h-6 rounded-full border flex-shrink-0 shadow-sm transition-transform ${
                  (colorTarget === 'fg' ? color : bgColor) === c 
                    ? 'border-[#9d6a3b] border-2 scale-110' 
                    : 'border-[#2a2019]/35 hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-[1px] h-6 bg-[#2a2019]/15 mx-0.5" />

          {/* Custom Color Selector */}
          <div className="flex items-center gap-1">
            <input
              type="color"
              value={colorTarget === 'fg' ? color : bgColor}
              onChange={e => {
                if (colorTarget === 'fg') {
                  setColor(e.target.value)
                } else {
                  setBgColor(e.target.value)
                }
              }}
              title="Couleur sur mesure"
              className="w-6 h-6 border rounded-full cursor-pointer p-0 bg-transparent"
            />
            <span className="text-[10px] text-[#5b3221] font-bold">Perso</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Ouvrir l'atelier de dessin"
      className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-[#9d6a3b] border border-[#5b3221] text-white text-2xl cursor-pointer flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      🎨
    </button>
  )
}

export default function PaintCanvas({ mode = 'floating' }: { mode?: 'floating' | 'panel' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tool, setTool] = useState<string>('pencil')
  const [color, setColor] = useState('#9d6a3b')
  const [bgColor, setBgColor] = useState('#f8f1e7')
  const [size, setSize] = useState(8)
  const [opacity, setOpacity] = useState(100)
  const [colorTarget, setColorTarget] = useState<'fg' | 'bg'>('fg')
  const [activePalette, setActivePalette] = useState<PaletteType>('terres')

  const [isAiPainting, setIsAiPainting] = useState(false)
  const [aiStatusMessage, setAiStatusMessage] = useState('')
  const aiCancelRef = useRef(false)
  const { getFicheBySlug, getRoadmapBySlug } = useDemoStore()

  function detectPageContext(): AIContext | null {
    if (typeof window === 'undefined') return null
    const path = window.location.pathname

    const ficheMatch = path.match(/\/atelier\/fiches\/([^/]+)/)
    if (ficheMatch) {
      const slug = ficheMatch[1]
      const fiche = getFicheBySlug(slug)
      if (fiche) {
        return {
          type: 'fiche',
          title: fiche.title,
          summary: fiche.summary,
          tags: fiche.tags,
          category: fiche.category,
          tool: fiche.tool,
          level: fiche.level,
        }
      }
    }

    const roadmapMatch = path.match(/\/atelier\/roadmaps\/([^/]+)/)
    if (roadmapMatch) {
      const slug = roadmapMatch[1]
      const roadmap = getRoadmapBySlug(slug)
      if (roadmap) {
        return {
          type: 'roadmap',
          title: roadmap.title,
          summary: roadmap.summary,
          tags: [],
          category: roadmap.level,
          level: roadmap.level,
        }
      }
    }

    return null
  }

  function executeCommand(ctx: CanvasRenderingContext2D, bgCtx: CanvasRenderingContext2D, cmd: DrawCommand) {
    switch (cmd.action) {
      case 'setBg':
        bgCtx.fillStyle = cmd.color
        bgCtx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        break
      case 'setColor':
        ctx.strokeStyle = cmd.color
        ctx.fillStyle = cmd.color
        break
      case 'setSize':
        ctx.lineWidth = cmd.size
        break
      case 'setOpacity':
        ctx.globalAlpha = cmd.opacity
        break
      case 'clear':
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        break
      case 'line':
        ctx.beginPath()
        ctx.moveTo(cmd.x1, cmd.y1)
        ctx.lineTo(cmd.x2, cmd.y2)
        ctx.stroke()
        break
      case 'circle':
        ctx.beginPath()
        ctx.ellipse(cmd.cx, cmd.cy, cmd.r, cmd.r, 0, 0, Math.PI * 2)
        ctx.stroke()
        break
      case 'rect':
        ctx.strokeRect(cmd.x, cmd.y, cmd.w, cmd.h)
        break
      case 'fill':
        floodFill(ctx, cmd.x, cmd.y, cmd.color)
        break
      case 'dot': {
        const r = Math.max(ctx.lineWidth, 2) / 2
        ctx.beginPath()
        ctx.ellipse(cmd.x, cmd.y, r, r, 0, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'spray': {
        const density = cmd.density ?? 20
        const radius = cmd.radius ?? 30
        for (let i = 0; i < density; i++) {
          const angle = Math.random() * Math.PI * 2
          const r = Math.sqrt(Math.random()) * radius
          ctx.fillRect(cmd.x + Math.cos(angle) * r, cmd.y + Math.sin(angle) * r, 1.5, 1.5)
        }
        break
      }
    }
  }

  async function animateAiPaint(commands: DrawCommand[]) {
    const canvas = drawCanvasRef.current
    const bgCanvas = bgCanvasRef.current
    if (!canvas || !bgCanvas) return

    const ctx = canvas.getContext('2d')
    const bgCtx = bgCanvas.getContext('2d')
    if (!ctx || !bgCtx) return

    saveCanvasState()
    setIsAiPainting(true)

    for (let i = 0; i < commands.length; i++) {
      if (aiCancelRef.current) break
      setAiStatusMessage(`L'IA dessine… ${Math.round((i / commands.length) * 100)}%`)
      executeCommand(ctx, bgCtx, commands[i])
      await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 60))
    }

    if (!aiCancelRef.current) {
      setAiStatusMessage('✨ Œuvre terminée !')
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsAiPainting(false)
    setAiStatusMessage('')
    aiCancelRef.current = false
  }

  const handleAiPaint = useCallback(async () => {
    const context = detectPageContext()
    if (!context) {
      setAiStatusMessage('ℹ️ Ouvrez une fiche pour lancer le dessin automatique')
      setIsAiPainting(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsAiPainting(false)
      setAiStatusMessage('')
      return
    }

    aiCancelRef.current = false
    setAiStatusMessage('🤔 Inspiration créative en cours…')
    setIsAiPainting(true)

    const commands = await generatePaintCommands(context)
    await animateAiPaint(commands)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const startPos = useRef<{ x: number; y: number } | null>(null)
  const snapshotRef = useRef<ImageData | null>(null)

  const undoStack = useRef<ImageData[]>([])
  const redoStack = useRef<ImageData[]>([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const saveCanvasState = useCallback(() => {
    const canvas = drawCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height)
    undoStack.current.push(currentImg)
    if (undoStack.current.length > 25) {
      undoStack.current.shift()
    }
    redoStack.current = []
    setCanUndo(true)
    setCanRedo(false)
  }, [])

  const handleUndo = useCallback(() => {
    const canvas = drawCanvasRef.current
    if (!canvas || undoStack.current.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height)
    redoStack.current.push(currentImg)
    const prevImg = undoStack.current.pop()!
    ctx.putImageData(prevImg, 0, 0)
    setCanUndo(undoStack.current.length > 0)
    setCanRedo(true)
  }, [])

  const handleRedo = useCallback(() => {
    const canvas = drawCanvasRef.current
    if (!canvas || redoStack.current.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height)
    undoStack.current.push(currentImg)
    const nextImg = redoStack.current.pop()!
    ctx.putImageData(nextImg, 0, 0)
    setCanUndo(true)
    setCanRedo(redoStack.current.length > 0)
  }, [])

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = drawCanvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function applyStroke(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.globalAlpha = opacity / 100
      ctx.lineWidth = size * 3
      ctx.strokeStyle = '#000000'
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
      ctx.globalCompositeOperation = 'source-over'
      return
    }

    ctx.strokeStyle = color
    ctx.globalAlpha = opacity / 100

    if (tool === 'pencil') {
      ctx.lineWidth = size
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    } else if (tool === 'brush') {
      ctx.lineWidth = size * 2.5
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color
      ctx.lineWidth = size * 4
      ctx.lineCap = 'square'
      ctx.lineJoin = 'miter'
      ctx.globalAlpha = (opacity / 100) * 0.3
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.stroke()
    } else if (tool === 'calligraphy') {
      ctx.lineWidth = 1.5
      const dx = to.x - from.x
      const dy = to.y - from.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.max(Math.floor(distance), 1)
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const cx = from.x + dx * t
        const cy = from.y + dy * t
        ctx.beginPath()
        const offset = size * 1.2
        ctx.moveTo(cx - offset, cy + offset)
        ctx.lineTo(cx + offset, cy - offset)
        ctx.stroke()
      }
    } else if (tool === 'spray') {
      const radius = size * 3
      const density = Math.min(size * 4, 80)
      ctx.fillStyle = color
      const dx = to.x - from.x
      const dy = to.y - from.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.max(Math.floor(distance / 5), 1)
      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const cx = from.x + dx * t
        const cy = from.y + dy * t
        for (let i = 0; i < density; i++) {
          const angle = Math.random() * Math.PI * 2
          const r = Math.sqrt(Math.random()) * radius
          const sx = cx + Math.cos(angle) * r
          const sy = cy + Math.sin(angle) * r
          ctx.fillRect(sx, sy, 1.5, 1.5)
        }
      }
    }
  }

  function drawShape(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    if (snapshotRef.current) ctx.putImageData(snapshotRef.current, 0, 0)
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.globalAlpha = opacity / 100

    if (tool === 'line') {
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    } else if (tool === 'rect') {
      ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y)
    } else if (tool === 'circle') {
      const rx = (end.x - start.x) / 2
      const ry = (end.y - start.y) / 2
      ctx.beginPath()
      ctx.ellipse(start.x + rx, start.y + ry, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2)
      ctx.stroke()
    } else if (tool === 'triangle') {
      ctx.beginPath()
      ctx.moveTo(start.x + (end.x - start.x) / 2, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.lineTo(start.x, end.y)
      ctx.closePath()
      ctx.stroke()
    }
  }

  function onDown(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault()
    const canvas = drawCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    saveCanvasState()
    const pos = getPos(e)
    if (tool === 'fill') {
      floodFill(ctx, pos.x, pos.y, color)
      return
    }
    drawing.current = true
    lastPos.current = pos
    startPos.current = pos
    if (['line', 'rect', 'circle', 'triangle'].includes(tool)) {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
    }
  }

  function onMove(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (!drawing.current) return
    const canvas = drawCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    const pos = getPos(e)
    if (['pencil', 'brush', 'eraser', 'calligraphy', 'spray', 'highlighter'].includes(tool)) {
      applyStroke(ctx, lastPos.current!, pos)
      lastPos.current = pos
    } else {
      drawShape(ctx, startPos.current!, pos)
    }
  }

  function onUp() {
    if (!drawing.current) return
    drawing.current = false
    const canvas = drawCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    const pos = lastPos.current || { x: 0, y: 0 }
    ctx.globalAlpha = opacity / 100
    if (['line', 'rect', 'circle', 'triangle'].includes(tool)) {
      drawShape(ctx, startPos.current!, pos)
    }
    ctx.globalAlpha = 1
  }

  const handleClearCanvas = useCallback(() => {
    const canvas = drawCanvasRef.current!
    const ctx = canvas.getContext('2d')!
    saveCanvasState()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [saveCanvasState])

  const handleDownload = useCallback(() => {
    const drawCanvas = drawCanvasRef.current
    const bgCanvas = bgCanvasRef.current
    if (!drawCanvas || !bgCanvas) return

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = drawCanvas.width
    tempCanvas.height = drawCanvas.height
    const tempCtx = tempCanvas.getContext('2d')!
    tempCtx.drawImage(bgCanvas, 0, 0)
    tempCtx.drawImage(drawCanvas, 0, 0)

    const link = document.createElement('a')
    link.download = 'artplastique-creation.png'
    link.href = tempCanvas.toDataURL()
    link.click()
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const drawCanvas = drawCanvasRef.current
        const bgCanvas = bgCanvasRef.current
        if (!drawCanvas || !bgCanvas) return
        const drawCtx = drawCanvas.getContext('2d')
        const bgCtx = bgCanvas.getContext('2d')
        if (!drawCtx || !bgCtx) return

        saveCanvasState()

        const canvasRatio = drawCanvas.width / drawCanvas.height
        const imgRatio = img.width / img.height
        let drawWidth = drawCanvas.width
        let drawHeight = drawCanvas.height
        let x = 0
        let y = 0
        if (imgRatio > canvasRatio) {
          drawHeight = drawCanvas.width / imgRatio
          y = (drawCanvas.height - drawHeight) / 2
        } else {
          drawWidth = drawCanvas.height * imgRatio
          x = (drawCanvas.width - drawWidth) / 2
        }
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
        bgCtx.drawImage(img, x, y, drawWidth, drawHeight)
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [saveCanvasState])

  if (mode === 'panel') {
    return (
      <div className="w-full h-full min-h-[520px]">
        <PanelContent
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          bgColor={bgColor}
          setBgColor={setBgColor}
          size={size}
          setSize={setSize}
          opacity={opacity}
          setOpacity={setOpacity}
          colorTarget={colorTarget}
          setColorTarget={setColorTarget}
          activePalette={activePalette}
          setActivePalette={setActivePalette}
          drawCanvasRef={drawCanvasRef}
          bgCanvasRef={bgCanvasRef}
          fileInputRef={fileInputRef}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          mode={mode}
          canUndo={canUndo}
          canRedo={canRedo}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleClearCanvas={handleClearCanvas}
          handleDownload={handleDownload}
          isAiPainting={isAiPainting}
          aiStatusMessage={aiStatusMessage}
          handleAiPaint={handleAiPaint}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
    )
  }

  return (
    <>
      {!isOpen && (
        <FloatingButton onClick={() => setIsOpen(true)} />
      )}

      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[300] flex items-stretch justify-end"
        >
          {/* Transparent Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-black/35"
          />

          {/* Right Sliding Panel */}
          <div 
            className="w-[min(720px,95vw)] h-full flex flex-col shadow-2xl animate-[slideIn_0.28s_cubic-bezier(0.22,1,0.36,1)]"
          >
            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to   { transform: translateX(0);    opacity: 1; }
              }
            `}</style>
            <PanelContent
              tool={tool}
              setTool={setTool}
              color={color}
              setColor={setColor}
              bgColor={bgColor}
              setBgColor={setBgColor}
              size={size}
              setSize={setSize}
              opacity={opacity}
              setOpacity={setOpacity}
              colorTarget={colorTarget}
              setColorTarget={setColorTarget}
              activePalette={activePalette}
              setActivePalette={setActivePalette}
              drawCanvasRef={drawCanvasRef}
              bgCanvasRef={bgCanvasRef}
              fileInputRef={fileInputRef}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              mode={mode}
              canUndo={canUndo}
              canRedo={canRedo}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              handleClearCanvas={handleClearCanvas}
              handleDownload={handleDownload}
              isAiPainting={isAiPainting}
              aiStatusMessage={aiStatusMessage}
              handleAiPaint={handleAiPaint}
              onMouseDown={onDown}
              onMouseMove={onMove}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onTouchStart={onDown}
              onTouchMove={onMove}
              onTouchEnd={onUp}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
