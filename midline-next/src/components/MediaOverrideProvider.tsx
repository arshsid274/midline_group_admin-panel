'use client'

import { createContext, useContext, useMemo } from 'react'

type Manifest = Record<string, string>

const Ctx = createContext<Manifest>({})

interface ProviderProps {
  initialManifest?: Manifest
  children: React.ReactNode
}

export function MediaOverrideProvider({ initialManifest, children }: ProviderProps) {
  const value = useMemo(() => initialManifest ?? {}, [initialManifest])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useMediaSrc(slotId: string, fallback: string): string
export function useMediaSrc(slotId: string, fallback: undefined): string | undefined
export function useMediaSrc(slotId: string, fallback: string | undefined): string | undefined
export function useMediaSrc(slotId: string, fallback: string | undefined): string | undefined {
  const overrides = useContext(Ctx)
  return overrides[slotId] ?? fallback
}

export function useMediaOverrides(): Manifest {
  return useContext(Ctx)
}
