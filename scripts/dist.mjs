// Reads a file of the build: from dist/ when the build is a plain folder, or from dist/endash.zip once `npm run build` has
// packaged it. In the zip the page is called endash.html (the name it is served under), here it is still asked for as
// index.html.
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { unzipSync } from 'fflate'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const dist = path.join(root, 'dist')
export const zipPath = path.join(dist, 'endash.zip')

let zipped
function zipFiles() {
  if (zipped === undefined) zipped = existsSync(zipPath) ? unzipSync(new Uint8Array(readFileSync(zipPath))) : null
  return zipped
}

/** The content of a file of the build (`index.html`, `images/shareico.jpg`), or null when there is none. */
export function readDistFile(relative) {
  const onDisk = path.join(dist, relative)
  if (existsSync(onDisk)) return readFileSync(onDisk)
  const files = zipFiles()
  const inZip = files?.[relative === 'index.html' ? 'endash.html' : relative]
  return inZip ? Buffer.from(inZip) : null
}
