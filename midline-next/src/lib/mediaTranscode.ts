import 'server-only'
import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'

const FFMPEG_BIN = (ffmpegPath as unknown as string) || 'ffmpeg'

export interface TranscodeResult {
  webmAbsPath: string
  mp4AbsPath: string
  posterAbsPath: string
}

/**
 * Re-encode a freshly-uploaded video into:
 *   <basename>.webm   — VP9, CRF 32, no audio (smallest)
 *   <basename>.mp4    — H.264, CRF 24, +faststart, no audio (universal fallback)
 *   <basename>.jpg    — single frame at 1s, decent quality (poster)
 *
 * The original input file is read from `inputAbsPath` and is NOT touched —
 * the caller is responsible for unlinking the original after this resolves
 * (so a re-upload to a slot whose previous file extension matched one of
 * our outputs doesn't leave orphans).
 *
 * Runs the three jobs in parallel; on a typical Mac M-series this finishes
 * a 30 MB hero video in ~20–60 seconds.
 */
export async function transcodeVideo(
  inputAbsPath: string,
  outputDir: string,
  basename: string,
): Promise<TranscodeResult> {
  await fs.mkdir(outputDir, { recursive: true })

  const webmAbsPath = path.join(outputDir, `${basename}.webm`)
  const mp4AbsPath = path.join(outputDir, `${basename}.mp4`)
  const posterAbsPath = path.join(outputDir, `${basename}.jpg`)

  await Promise.all([
    runFfmpeg([
      '-i', inputAbsPath,
      '-c:v', 'libvpx-vp9',
      '-crf', '32',
      '-b:v', '0',
      '-deadline', 'good',
      '-cpu-used', '2',
      '-row-mt', '1',
      '-an',
      '-y', webmAbsPath,
    ]),
    runFfmpeg([
      '-i', inputAbsPath,
      '-c:v', 'libx264',
      '-crf', '24',
      '-preset', 'medium',
      '-movflags', '+faststart',
      '-pix_fmt', 'yuv420p',
      '-an',
      '-y', mp4AbsPath,
    ]),
    runFfmpeg([
      '-i', inputAbsPath,
      '-ss', '1',
      '-frames:v', '1',
      '-q:v', '4',
      '-y', posterAbsPath,
    ]),
  ])

  return { webmAbsPath, mp4AbsPath, posterAbsPath }
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(FFMPEG_BIN, args, { stdio: ['ignore', 'ignore', 'pipe'] })
    let stderr = ''
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
      // Cap retained stderr so a chatty progress log doesn't blow up memory
      if (stderr.length > 10000) stderr = stderr.slice(-10000)
    })
    child.on('error', (err) => reject(err))
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg exited with code ${code}\n${stderr.trim().split('\n').slice(-5).join('\n')}`))
    })
  })
}
