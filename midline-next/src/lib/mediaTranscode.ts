import 'server-only'
import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import ffmpegPath from 'ffmpeg-static'
import sharp from 'sharp'

const FFMPEG_BIN = (ffmpegPath as unknown as string) || 'ffmpeg'

export interface TranscodeResult {
  webmAbsPath: string
  mp4AbsPath: string
  posterAbsPath: string
}

/**
 * Re-encode a freshly-uploaded video into web-optimised, low-bitrate
 * outputs sized for hero/card display:
 *   <basename>.webm   — VP9, CRF 36, no audio, capped 1280×720@30fps
 *   <basename>.mp4    — H.264, CRF 28, +faststart, no audio, capped 1280×720@30fps
 *   <basename>.jpg    — single frame at 1s, JPEG q 6 (~80–150 KB)
 *
 * Aggressive defaults so even a 4K source gets shrunk to a deploy-friendly
 * size (~1–8 MB for typical hero clips). The scale filter only ever
 * downscales — smaller inputs stay at their native size so we don't
 * upscale and waste bytes.
 *
 * The original input is read from `inputAbsPath` and is NOT touched —
 * the caller unlinks it after this resolves.
 *
 * Runs the three ffmpeg jobs in parallel.
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

  // `min(1280,iw)` clamps width down (never up). `-2` on height keeps
  // aspect ratio and forces an even number for codec compatibility.
  const scaleFilter = "scale='min(1280,iw)':-2:flags=bicubic"

  await Promise.all([
    runFfmpeg([
      '-i', inputAbsPath,
      '-vf', scaleFilter,
      '-r', '30',
      '-c:v', 'libvpx-vp9',
      '-crf', '36',
      '-b:v', '0',
      '-deadline', 'good',
      '-cpu-used', '4',
      '-row-mt', '1',
      '-tile-columns', '2',
      '-an',
      '-y', webmAbsPath,
    ]),
    runFfmpeg([
      '-i', inputAbsPath,
      '-vf', scaleFilter,
      '-r', '30',
      '-c:v', 'libx264',
      '-crf', '28',
      '-preset', 'fast',
      '-profile:v', 'main',
      '-level', '4.0',
      '-movflags', '+faststart',
      '-pix_fmt', 'yuv420p',
      '-an',
      '-y', mp4AbsPath,
    ]),
    runFfmpeg([
      '-i', inputAbsPath,
      '-ss', '1',
      '-frames:v', '1',
      '-vf', scaleFilter,
      '-q:v', '6',
      '-y', posterAbsPath,
    ]),
  ])

  return { webmAbsPath, mp4AbsPath, posterAbsPath }
}

export interface PhotoResult {
  /** Absolute path of the processed file. */
  outAbsPath: string
  /** Filename only (no directory), e.g. "abc-1234.jpg" or "abc-1234.webp". */
  outFilename: string
  /** Output extension including the dot ('.jpg' or '.webp'). */
  outExt: string
}

/**
 * Re-encode an uploaded photo into a web-ready single output file.
 *
 *   • Auto-rotates per EXIF orientation, then strips EXIF.
 *   • Caps the longest dimension at 2560 px (good for retina hero use,
 *     overkill for small thumbnails — the browser scales down for free).
 *     Smaller inputs are NOT upscaled.
 *   • Photos with no alpha channel → JPEG @ q82, mozjpeg, progressive
 *     (typically 60–85% smaller than a raw camera JPEG, no visible loss).
 *   • Photos with alpha (logos, cut-outs) → WebP @ q85 with high alpha
 *     quality (preserves transparency, ~50–70% smaller than equivalent PNG).
 *
 * The original input file is NOT touched — caller unlinks it after this
 * resolves (mirrors the transcodeVideo contract).
 */
export async function processPhoto(
  inputAbsPath: string,
  outputDir: string,
  basename: string,
): Promise<PhotoResult> {
  await fs.mkdir(outputDir, { recursive: true })

  const meta = await sharp(inputAbsPath).metadata()
  const hasAlpha = !!meta.hasAlpha

  const outExt = hasAlpha ? '.webp' : '.jpg'
  const outFilename = `${basename}${outExt}`
  const outAbsPath = path.join(outputDir, outFilename)

  let pipeline = sharp(inputAbsPath, { failOn: 'truncated' })
    .rotate() // honour EXIF orientation, then strip metadata implicitly
    .resize({
      width: 2560,
      height: 2560,
      fit: 'inside',
      withoutEnlargement: true,
    })

  if (hasAlpha) {
    pipeline = pipeline.webp({
      quality: 85,
      alphaQuality: 90,
      effort: 4,
      smartSubsample: true,
    })
  } else {
    pipeline = pipeline.jpeg({
      quality: 82,
      mozjpeg: true,
      progressive: true,
      chromaSubsampling: '4:2:0',
    })
  }

  await pipeline.toFile(outAbsPath)

  return { outAbsPath, outFilename, outExt }
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
