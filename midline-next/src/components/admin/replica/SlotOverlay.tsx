'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, Loader2, Check, AlertCircle, ImageIcon, FileVideo, Trash2, Lock } from 'lucide-react'
import type { SlotKind } from '@/lib/mediaSlots'

type Manifest = Record<string, string>

interface Props {
  slotId: string
  label: string
  kind: SlotKind
  currentUrl?: string
  fallbackUrl?: string
  onManifestChange: (m: Manifest) => void
  onToast?: (kind: 'success' | 'error', message: string) => void
  /** Optional small label rendered as a corner pin (e.g. "#1", "Logo"). */
  pin?: string
  /** Override the rendered preview; defaults to <img> / <video> based on URL extension. */
  children?: React.ReactNode
  className?: string
  /** Hide the corner kind badge (image/video icon top-left). */
  hideKindBadge?: boolean
  /** Make the rounded-md corners less rounded for sharper visual matches. */
  square?: boolean
  /** When true, all upload/delete interactions are blocked — slot is read-only. */
  locked?: boolean
}

export default function SlotOverlay({
  slotId,
  label,
  kind,
  currentUrl,
  fallbackUrl,
  onManifestChange,
  onToast,
  pin,
  children,
  className = '',
  hideKindBadge,
  square,
  locked,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)

  const previewUrl = currentUrl ?? fallbackUrl
  const previewIsVideo = !!previewUrl && /\.(mp4|mov|webm|m4v)$/i.test(previewUrl)
  const hasOverride = !!currentUrl

  const accept = kind === 'photo' ? 'image/*' : kind === 'video' ? 'video/*' : 'image/*,video/*'

  const acceptable = useCallback(
    (file: File) => {
      if (kind === 'photo') return file.type.startsWith('image/')
      if (kind === 'video') return file.type.startsWith('video/')
      return file.type.startsWith('image/') || file.type.startsWith('video/')
    },
    [kind],
  )

  const upload = useCallback(
    (file: File) => {
      if (locked) return
      if (!acceptable(file)) {
        const msg = kind === 'photo' ? 'Please choose an image' : kind === 'video' ? 'Please choose a video' : 'Image or video only'
        setError(msg)
        onToast?.('error', `${label}: ${msg}`)
        return
      }
      setError(null)
      setBusy(true)
      setProgress(0)

      const xhr = new XMLHttpRequest()
      const fd = new FormData()
      fd.append('slotId', slotId)
      fd.append('file', file)
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) setProgress(e.loaded / e.total)
      })
      xhr.onload = () => {
        setBusy(false)
        try {
          const json = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300) {
            onManifestChange(json.manifest)
            setFlash(true)
            setTimeout(() => setFlash(false), 1200)
            onToast?.('success', `${label}: replaced`)
          } else {
            const m = json.error ?? `HTTP ${xhr.status}`
            setError(m)
            onToast?.('error', `${label}: ${m}`)
          }
        } catch {
          setError(`HTTP ${xhr.status}`)
        }
      }
      xhr.onerror = () => {
        setBusy(false)
        setError('Network error')
        onToast?.('error', `${label}: network error`)
      }
      xhr.open('POST', '/api/admin/upload')
      xhr.send(fd)
    },
    [acceptable, kind, label, locked, onManifestChange, onToast, slotId],
  )

  async function reset(e: React.MouseEvent) {
    e.stopPropagation()
    if (busy || locked) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/upload?slotId=${encodeURIComponent(slotId)}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      onManifestChange(json.manifest)
      onToast?.('success', `${label}: reset`)
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : String(e)
      setError(m)
      onToast?.('error', `${label}: ${m}`)
    } finally {
      setBusy(false)
    }
  }

  const radius = square ? 'rounded-md' : 'rounded-xl'

  return (
    <div
      className={`group relative overflow-hidden ${radius} ${className} ${
        locked
          ? 'outline outline-1 outline-[#053F6E]/20 opacity-95'
          : drag
          ? 'ring-4 ring-[#053F6E]/30 outline outline-2 outline-[#053F6E]'
          : hasOverride
          ? 'outline outline-2 outline-emerald-400/70'
          : 'outline outline-1 outline-dashed outline-[#053F6E]/30 hover:outline-[#053F6E]/60'
      } transition-all duration-200`}
      onClick={() => !busy && !locked && inputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault(); e.stopPropagation()
        if (!busy && !locked && Array.from(e.dataTransfer.items ?? []).some((i) => i.kind === 'file')) setDrag(true)
      }}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); if (!busy && !locked) { setDrag(true); e.dataTransfer.dropEffect = 'copy' } }}
      onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDrag(false) }}
      onDrop={(e) => {
        e.preventDefault(); e.stopPropagation(); setDrag(false)
        if (busy || locked) return
        const f = e.dataTransfer.files?.[0]
        if (f) upload(f)
      }}
      role="button"
      tabIndex={locked ? -1 : 0}
      onKeyDown={(e) => {
        if (locked) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); inputRef.current?.click()
        }
      }}
      aria-label={`${label}${hasOverride ? ' (replaced)' : ''}${locked ? ' — locked' : ' — click or drop a file to upload'}`}
      title={`${label} • ${slotId}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) upload(f)
          e.target.value = ''
        }}
      />

      {/* Visual preview / placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0FAFF] to-[#DDEFFB]">
        {children
          ? children
          : previewUrl
          ? previewIsVideo
            ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={previewUrl} className="w-full h-full object-cover" muted loop playsInline autoPlay preload="metadata" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            )
          : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#053F6E]/45">
              {kind === 'video' ? <FileVideo className="w-5 h-5" strokeWidth={1.5} /> : <ImageIcon className="w-5 h-5" strokeWidth={1.5} />}
              <span className="text-[10px] uppercase tracking-wider">empty</span>
            </div>
          )}
      </div>

      {/* Kind badge */}
      {!hideKindBadge && (
        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white backdrop-blur-sm pointer-events-none">
          {kind === 'video' ? <FileVideo className="w-2.5 h-2.5" strokeWidth={2} /> : <ImageIcon className="w-2.5 h-2.5" strokeWidth={2} />}
          {kind === 'video' ? 'video' : 'photo'}
        </span>
      )}

      {/* Pin label (e.g. "#1") */}
      {pin && (
        <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-white/90 text-[10px] font-medium text-[#053F6E] shadow-sm pointer-events-none">
          {pin}
        </span>
      )}

      {/* Hover hint */}
      {!locked && (
        <div className={`absolute inset-0 flex items-center justify-center text-white text-[11px] font-medium uppercase tracking-wider bg-[#053F6E]/85 transition-opacity duration-200 ${busy || drag ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          <span className="inline-flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" strokeWidth={2} />
            {hasOverride ? 'Replace' : 'Upload'}
          </span>
        </div>
      )}

      {/* Lock badge */}
      {locked && (
        <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#053F6E]/85 text-white shadow-md ring-2 ring-white pointer-events-none">
          <Lock className="w-2.5 h-2.5" strokeWidth={2.5} aria-hidden="true" />
        </span>
      )}

      {/* Drag-active hint */}
      {drag && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#053F6E]/15 backdrop-blur-[2px]">
          <span className="rounded-full bg-[#053F6E] text-white text-[11px] font-medium uppercase tracking-wider px-3 py-1.5 inline-flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" strokeWidth={2.25} /> Drop here
          </span>
        </div>
      )}

      {/* Busy / progress */}
      {busy && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 backdrop-blur-sm">
          <Loader2 className="w-5 h-5 text-[#053F6E] animate-spin" strokeWidth={2.25} />
          <div className="w-3/4 max-w-[160px] h-1.5 rounded-full bg-[#053F6E]/10 overflow-hidden">
            <div className="h-full bg-[#053F6E] transition-[width] duration-150" style={{ width: `${Math.max(8, Math.round(progress * 100))}%` }} />
          </div>
          <span className="text-[10px] tabular-nums text-[#053F6E]/70">{Math.round(progress * 100)}%</span>
        </div>
      )}

      {/* Replaced check + delete button */}
      {hasOverride && !busy && (
        <>
          <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider shadow ring-2 ring-white pointer-events-none">
            <Check className="w-2.5 h-2.5" strokeWidth={3} /> replaced
          </span>
          {!locked && (
            <button
              type="button"
              onClick={reset}
              className="absolute bottom-1.5 right-1.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/90 hover:bg-rose-600 hover:text-white text-rose-600 shadow-sm transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              aria-label={`Delete uploaded media for ${label}`}
              title="Delete uploaded file"
            >
              <Trash2 className="w-3 h-3" strokeWidth={2.25} />
            </button>
          )}
        </>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] bg-rose-600 text-white inline-flex items-center gap-1">
          <AlertCircle className="w-3 h-3" strokeWidth={2.25} />
          <span className="truncate">{error}</span>
        </div>
      )}

      {flash && (
        <div className="pointer-events-none absolute inset-0 ring-4 ring-emerald-300 animate-[pulse_1.1s_ease-out]" />
      )}
    </div>
  )
}
