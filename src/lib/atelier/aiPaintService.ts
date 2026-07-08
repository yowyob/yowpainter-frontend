// ─── Draw command types ────────────────────────────────────────────────
export type DrawCommand =
  | { action: 'setBg';       color: string }
  | { action: 'setColor';    color: string }
  | { action: 'setSize';     size: number }
  | { action: 'setOpacity';  opacity: number }
  | { action: 'clear' }
  | { action: 'line';        x1: number; y1: number; x2: number; y2: number }
  | { action: 'circle';      cx: number; cy: number; r: number }
  | { action: 'rect';        x: number; y: number; w: number; h: number }
  | { action: 'fill';        x: number; y: number; color: string }
  | { action: 'dot';         x: number; y: number }
  | { action: 'spray';       x: number; y: number; radius: number; density: number }

// ─── Context types ──────────────────────────────────────────────────────
export type AIContext = {
  type: 'fiche' | 'roadmap'
  title: string
  summary: string
  tags?: string[]
  category?: string
  tool?: string
  level?: string
}

// ─── Generate a random HSL color converted to hex/string ─────────────────
function randHex(): string {
  const hue = Math.floor(Math.random() * 360)
  const sat = 50 + Math.floor(Math.random() * 40) // 50-90%
  const lig = 35 + Math.floor(Math.random() * 35) // 35-70%
  return `hsl(${hue}, ${sat}%, ${lig}%)`
}

function randHexBg(): string {
  const hue = Math.floor(Math.random() * 360)
  const sat = 15 + Math.floor(Math.random() * 15) // 15-30%
  const lig = 85 + Math.floor(Math.random() * 10) // 85-95%
  return `hsl(${hue}, ${sat}%, ${lig}%)`
}

// ─── Simulation generator ────────────────────────────────────────────────
function getFallbackCommands(_ctx: AIContext): DrawCommand[] {
  const numCommands = 15 + Math.floor(Math.random() * 12) // 15-27
  const cmds: DrawCommand[] = []

  // Always start with background
  cmds.push({ action: 'setBg', color: randHexBg() })

  const actions: DrawCommand['action'][] = ['line', 'circle', 'rect', 'dot', 'spray']

  for (let i = 0; i < numCommands; i++) {
    // Randomly insert style changes
    if (Math.random() < 0.4) {
      cmds.push({ action: 'setColor', color: randHex() })
    }
    if (Math.random() < 0.3) {
      cmds.push({ action: 'setSize', size: 3 + Math.floor(Math.random() * 25) })
    }
    if (Math.random() < 0.2) {
      cmds.push({ action: 'setOpacity', opacity: 0.3 + Math.random() * 0.7 })
    }

    const action = actions[Math.floor(Math.random() * actions.length)]
    const x = Math.floor(Math.random() * 540) + 50   // 50-590
    const y = Math.floor(Math.random() * 380) + 50   // 50-430

    switch (action) {
      case 'line':
        cmds.push({
          action: 'line',
          x1: x,
          y1: y,
          x2: x + Math.floor(Math.random() * 240 - 120),
          y2: y + Math.floor(Math.random() * 240 - 120)
        })
        break
      case 'circle':
        cmds.push({ action: 'circle', cx: x, cy: y, r: 15 + Math.floor(Math.random() * 70) })
        break
      case 'rect':
        cmds.push({ action: 'rect', x: x, y: y, w: 20 + Math.floor(Math.random() * 140), h: 20 + Math.floor(Math.random() * 140) })
        break
      case 'dot':
        cmds.push({ action: 'dot', x, y })
        break
      case 'spray':
        cmds.push({ action: 'spray', x, y, radius: 15 + Math.floor(Math.random() * 60), density: 12 + Math.floor(Math.random() * 28) })
        break
    }
  }

  return cmds
}

// ─── Main export with mock delay ─────────────────────────────────────────
export async function generatePaintCommands(ctx: AIContext): Promise<DrawCommand[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  return getFallbackCommands(ctx)
}
