// src/routes/map/index.tsx
import Header from '@/components/header'
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

// csak kliensen húzzuk be a Leaflet CSS-t
const MapView = lazy(async () => {
  if (!import.meta.env.SSR) {
    await import('leaflet/dist/leaflet.css')
  }
  return import('./MapView')   // itt a tényleges térkép komponensed
})

function MapRoute() {
  return (
    <div className='h-dvh overflow-hidden'>
    <Suspense fallback={<div>Térkép betöltése…</div>}>
      <Header/>
      <MapView/>
    </Suspense>
    </div>
  )
}

export const Route = createFileRoute('/map/')({
  component: MapRoute,
})
