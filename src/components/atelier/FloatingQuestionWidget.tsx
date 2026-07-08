'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useDemoStore } from '@/lib/atelier/context/DemoStoreContext'

export default function FloatingQuestionWidget() {
  const { askQuestion } = useDemoStore()
  const [isOpen, setIsOpen] = useState(false)
  
  // Position & size state
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [size, setSize] = useState({ width: 360, height: 380 })
  
  // Dragging & resizing state
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  
  // Form state
  const [questionText, setQuestionText] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Refs for tracking mouse offsets
  const dragStart = useRef({ x: 0, y: 0 })
  const initialPos = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ x: 0, y: 0 })
  const initialSize = useRef({ width: 0, height: 0 })

  // Initialize position to right corner when opened
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setPosition({
        x: window.innerWidth - size.width - 40,
        y: window.innerHeight - size.height - 120,
      })
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mouse move / up handlers for drag and resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        setPosition({
          x: Math.max(10, Math.min(window.innerWidth - size.width - 10, initialPos.current.x + dx)),
          y: Math.max(10, Math.min(window.innerHeight - size.height - 10, initialPos.current.y + dy)),
        })
      } else if (isResizing) {
        const dx = e.clientX - resizeStart.current.x
        const dy = e.clientY - resizeStart.current.y
        setSize({
          width: Math.max(300, Math.min(700, initialSize.current.width + dx)),
          height: Math.max(280, Math.min(500, initialSize.current.height + dy)),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, size])

  function handleQuestionSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!questionText.trim()) return

    try {
      askQuestion(questionText, visitorName)
      setQuestionText('')
      setVisitorName('')
      setFormMessage({ type: 'success', text: 'Votre question a été enregistrée !' })
      setTimeout(() => setFormMessage(null), 4000)
    } catch {
      setFormMessage({ type: 'error', text: 'Erreur lors de la soumission.' })
    }
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLButtonElement
    ) {
      return
    }
    
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    initialPos.current = { ...position }
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    resizeStart.current = { x: e.clientX, y: e.clientY }
    initialSize.current = { ...size }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Poser une question aux peintres"
          className="fixed bottom-24 right-6 z-[190] w-14 h-14 rounded-full bg-accent text-accent-foreground cursor-pointer flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 border border-accent/20"
        >
          ❓
        </button>
      )}

      {/* Floating Widget Window */}
      {isOpen && (
        <div
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: `${size.height}px`,
          }}
          className={`fixed z-[400] bg-popover text-popover-foreground border border-foreground/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md ${
            isDragging ? 'select-none' : 'select-auto'
          }`}
        >
          {/* Draggable Titlebar */}
          <div
            onMouseDown={handleDragStart}
            className="px-4 py-3 bg-[#2a2019] text-[#d6b189] flex items-center justify-between cursor-move border-b border-white/10"
          >
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span>❓</span>
              <span className="font-serif">Poser une question</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              title="Fermer"
              className="text-white/60 hover:text-white text-base cursor-pointer px-1 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3">
            <form onSubmit={handleQuestionSubmit} className="flex flex-col gap-3 h-full">
              <label className="flex flex-col gap-1 text-xs font-bold text-foreground">
                <span>Votre question *</span>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Comment préparer un support en bois ?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 border border-foreground/15 rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 resize-none text-sm outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
                />
              </label>
              
              <label className="flex flex-col gap-1 text-xs font-bold text-foreground">
                <span>Votre nom (optionnel)</span>
                <input
                  type="text"
                  placeholder="Ex: Léonard"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 border border-foreground/15 rounded-lg bg-background text-foreground placeholder:text-muted-foreground/60 text-sm outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
                />
              </label>

              <button
                type="submit"
                className="mt-auto w-full py-2.5 bg-accent hover:bg-accent/95 text-accent-foreground font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Envoyer ma question
              </button>

              {formMessage && (
                <div
                  className={`p-2.5 text-xs rounded-lg border text-center ${
                    formMessage.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}
                >
                  {formMessage.text}
                </div>
              )}
            </form>
          </div>

          {/* Resize handle in bottom right corner */}
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 opacity-40 hover:opacity-80 transition-opacity"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" className="fill-foreground">
              <path d="M6 0 L8 0 L8 8 L0 8 L0 6 L4 6 L4 4 L6 4 Z" />
            </svg>
          </div>
        </div>
      )}
    </>
  )
}
