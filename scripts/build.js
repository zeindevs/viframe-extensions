import { existsSync } from 'node:fs'
import { mkdir, readFile } from 'node:fs/promises'
import { zip } from 'zip-a-folder'

const build = async () => {
  const manifest = JSON.parse(await readFile('manifest.json'))
  const outdir = 'build'
  const outfile = `build/viframe-extensions-v${manifest.version}.zip`
  if (!existsSync(outdir)) await mkdir(outdir)
  await zip('dist', outfile)
  console.log('build:zip successful:', outfile)
}

build()
