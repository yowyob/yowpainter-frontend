import { DemoStoreProvider } from '@/lib/atelier/context/DemoStoreContext'
import PaintCanvas from '@/components/atelier/PaintCanvas'
import FloatingQuestionWidget from '@/components/atelier/FloatingQuestionWidget'

export default function AtelierLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoStoreProvider>
      <div className="relative min-h-[calc(100vh-5rem)] pb-16 bg-background text-foreground transition-colors duration-300 canvas-grain">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          {children}
        </div>
        <PaintCanvas mode="floating" />
        <FloatingQuestionWidget />
      </div>
    </DemoStoreProvider>
  )
}
