import { Suspense } from 'react'
import FichesClient from './FichesClient'

export default function FichesPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm">Chargement de l'Atelier...</p>
        </div>
      }
    >
      <FichesClient />
    </Suspense>
  )
}
