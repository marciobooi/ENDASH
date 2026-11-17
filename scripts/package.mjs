// Packages the build for delivery: the page is renamed endash.html, everything goes into dist/endash.zip, and the loose files
// are removed, so there is one small file to send. Run by `npm run build`; `npm run build:site` skips it (plain folder, for
// `npm run preview`).
import { readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { zipSync } from 'fflate'
import { dist, zipPath } from './dist.mjs'

/** Every file under `folder`, as paths relative to dist with forward slashes. */
function filesIn(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(folder, entry.name)
    return entry.isDirectory() ? filesIn(full) : [path.relative(dist, full).split(path.sep).join('/')]
  })
}

const files = filesIn(dist).filter((file) => file !== 'endash.zip')
if (!files.includes('index.html')) {
  console.error('dist/index.html not found: run `npm run build:site` first (or `npm run build`).')
  process.exit(1)
}

const entries = Object.fromEntries(
  files.map((file) => [file === 'index.html' ? 'endash.html' : file, new Uint8Array(readFileSync(path.join(dist, file)))]),
)
const bytes = zipSync(entries, { level: 9 })

for (const name of readdirSync(dist)) rmSync(path.join(dist, name), { recursive: true, force: true })
writeFileSync(zipPath, bytes)
console.log(`dist/endash.zip: ${files.length} files, ${(statSync(zipPath).size / 1024).toFixed(0)} KB (index.html is endash.html inside)`)
