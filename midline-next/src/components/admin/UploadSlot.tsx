'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, ImageIcon, FileVideo, Loader2, Check, AlertCircle, Replace, Trash2, Lock } from 'lucide-react'
import type { SlotKind } from '@/lib/mediaSlots'

type Manifest = Record<string, string>

interface Props {
  slotId: string
  label: string
  kind: SlotKind
  currentUrl?: string
  fallbackUrl?: string
  onManifestChange: (manifest: Manifest) => void
  onToast?: (kind: 'success' | 'error', message: string) => void
  locked?: boolean
}

const ACCEPT_BY_KIND: Record<SlotKind, string> = {
  photo: 'image/*',
  video: 'video/*',
  'image-or-video': 'image/*,video/*',
}

const HINT_BY_KIND: Record<SlotKind, string> = {
  photo: 'JPG, PNG, WebP up to 200 MB',
  video: 'MP4, MOV, WebM up to 200 MB',
  'image-or-video': 'Image or video up to 200 MB',
}

export default function UploadSlot({ slotId, label, kind, currentUrl, fallbackUrl, onManifestChange, onToast, locked }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [justSucceeded, setJustSucceeded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = currentUrl ?? fallbackUrl
  const previewIsVideo = !!previewUrl && /\.(mp4|mov|webm|m4v)$/i.test(previewUrl)
  const hasOverride = !!currentUrl

  const acceptableForKind = useCallback(
    (file: File): boolean => {
      if (kind === 'photo') return file.type.startsWith('image/')
      if (kind === 'video') return file.type.startsWith('video/')
      return file.type.startsWith('image/') || file.type.startsWith('video/')
    },
    [kind],
  )

  const performUpload = useCallback(
    (file: File) => {
      if (locked) return
      if (!acceptableForKind(file)) {
        const msg =
          kind === 'photo' ? 'Please choose an image file.'
          : kind === 'video' ? 'Please choose a video file.'
          : 'Please choose an image or video.'
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
            setJustSucceeded(true)
            setTimeout(() => setJustSucceeded(false), 1400)
            onToast?.('success', `Uploaded "${truncate(file.name, 32)}" → ${label}`)
          } else {
            const msg = json.error ?? `HTTP ${xhr.status}`
            setError(msg)
            onToast?.('error', `${label}: ${msg}`)
          }
        } catch {
          setError(`HTTP ${xhr.status}`)
          onToast?.('error', `${label}: HTTP ${xhr.status}`)
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
    [acceptableForKind, kind, label, locked, onManifestChange, onToast, slotId],
  )

  async function handleReset() {
    if (locked) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/upload?slotId=${encodeURIComponent(slotId)}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      onManifestChange(json.manifest)
      onToast?.('success', `${label}: reset to default`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      onToast?.('error', `${label}: ${msg}`)
    } finally {
      setBusy(false)
    }
  }

  function onDragEnter(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (busy || locked) return
    if (Array.from(e.dataTransfer.items ?? []).some((i) => i.kind === 'file')) {
      setDragActive(true)
    }
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (busy || locked) return
    setDragActive(true)
    e.dataTransfer.dropEffect = 'copy'
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (busy || locked) return
    const file = e.dataTransfer.files?.[0]
    if (file) performUpload(file)
  }

  const KindIcon = kind === 'video' ? FileVideo : ImageIcon
  const showFilled = hasOverride && !busy
  const showProgressLabel = busy && progress > 0 && progress < 1

  return (
    <div
      className={`group relative rounded-2xl border bg-white transition-all duration-200 ${
        locked
          ? 'border-[#053F6E]/15 opacity-90'
          : dragActive
          ? 'border-[#053F6E] ring-4 ring-[#053F6E]/15 shadow-md'
          : hasOverride
          ? 'border-[#053F6E]/20 shadow-sm hover:border-[#053F6E]/40 hover:shadow-md'
          : 'border-dashed border-[#053F6E]/25 hover:border-[#053F6E]/50 hover:bg-[#F0FAFF]/40'
      }`}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_BY_KIND[kind]}
        className="hidden"
        disabled={busy}
        aria-label={`Upload file for ${label}`}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) performUpload(f)
          e.target.value = ''
        }}
      />

      <div className="p-3 flex gap-3">
        {/* Thumbnail */}
        <button
          type="button"
          onClick={() => !busy && !locked && inputRef.current?.click()}
          disabled={busy || locked}
          className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#F0FAFF] to-[#E1F1FB] border border-[#053F6E]/10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2 transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label={locked ? `${label} — locked` : hasOverride ? `Replace media for ${label}` : `Upload media for ${label}`}
        >
          {previewUrl ? (
            previewIsVideo ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-[#053F6E]/50">
              <KindIcon className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-wider">empty</span>
            </div>
          )}

          {/* Overlay: video badge */}
          {previewIsVideo && previewUrl && (
            <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
              <FileVideo className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
              video
            </span>
          )}

          {/* Overlay: override marker */}
          {hasOverride && !busy && (
            <span className="absolute bottom-1.5 right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white" aria-label="Active override">
              <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
            </span>
          )}

          {/* Overlay: hover hint */}
          {!locked && (
            <div className={`absolute inset-0 flex items-center justify-center bg-[#053F6E]/85 text-white text-[11px] font-medium uppercase tracking-wider transition-opacity duration-200 ${busy ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`} aria-hidden="true">
              {hasOverride ? <Replace className="w-5 h-5" strokeWidth={1.75} /> : <Upload className="w-5 h-5" strokeWidth={1.75} />}
            </div>
          )}

          {/* Lock badge */}
          {locked && (
            <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#053F6E]/85 text-white shadow-md ring-2 ring-white" aria-label="Locked">
              <Lock className="w-2.5 h-2.5" strokeWidth={2.5} aria-hidden="true" />
            </span>
          )}
        </button>

        {/* Body */}
        <div className="flex-1 min-w-0 flex flex-col" title={slotId}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-[#053F6E] leading-snug" style={{ fontFamily: 'var(--font-body)' }}>
                {label}
              </p>
              <p className="mt-0.5 text-[11px] text-[#053F6E]/55 leading-tight">
                {kind === 'video' ? 'Video clip' : kind === 'photo' ? 'Single image' : 'Image or video'}
              </p>
            </div>
            {hasOverride && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700 border border-emerald-200">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" /> Replaced
              </span>
            )}
          </div>

          <div className="mt-auto pt-3">
            {busy ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-[#053F6E] animate-spin" strokeWidth={2.25} aria-hidden="true" />
                <div className="flex-1 h-1.5 rounded-full bg-[#053F6E]/10 overflow-hidden">
                  <div
                    className="h-full bg-[#053F6E] transition-[width] duration-150"
                    style={{ width: showProgressLabel ? `${Math.round(progress * 100)}%` : '40%' }}
                  />
                </div>
                <span className="text-[10px] tabular-nums text-[#053F6E]/70 w-9 text-right">
                  {showProgressLabel ? `${Math.round(progress * 100)}%` : '…'}
                </span>
              </div>
            ) : locked ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#053F6E]/65">
                <Lock className="w-3 h-3" strokeWidth={2.25} aria-hidden="true" /> Locked — unlock to edit
              </span>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2 ${
                    showFilled
                      ? 'bg-white border border-[#053F6E]/20 text-[#053F6E] hover:bg-[#F0FAFF]'
                      : 'bg-[#053F6E] text-white hover:bg-[#0A63A8]'
                  }`}
                >
                  {showFilled ? (
                    <>
                      <Replace className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> Replace
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> Upload
                    </>
                  )}
                </button>
                {hasOverride && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                    aria-label={`Delete uploaded media for ${label}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> Delete
                  </button>
                )}
                {!hasOverride && (
                  <span className="text-[10.5px] text-[#053F6E]/55" style={{ fontFamily: 'var(--font-body)' }}>
                    or drop a file — {HINT_BY_KIND[kind]}
                  </span>
                )}
              </div>
            )}

            {error && (
              <p className="mt-1.5 inline-flex items-start gap-1 text-[11px] text-rose-700">
                <AlertCircle className="w-3 h-3 mt-[1px]" strokeWidth={2.25} aria-hidden="true" />
                <span className="break-words">{error}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Drag-active scrim — pointer-events-none so the underlying drop handler stays active */}
      {dragActive && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[#053F6E]/5 flex items-center justify-center">
          <div className="rounded-full bg-[#053F6E] text-white text-xs font-medium uppercase tracking-wider px-3 py-1.5 inline-flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" strokeWidth={2.25} aria-hidden="true" /> Drop to upload
          </div>
        </div>
      )}

      {/* Just-succeeded flash */}
      {justSucceeded && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-400 animate-[pulse_1.2s_ease-out]" aria-hidden="true" />
      )}
    </div>
  )
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : s.slice(0, max - 1) + '…'
}
