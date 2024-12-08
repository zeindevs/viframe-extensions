import { existsSync, mkdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { zip } from 'zip-a-folder'

const build = async () => {
  const manifest = JSON.parse(await readFile('manifest.json'))
  if (!existsSync('build')) {
    mkdirSync('build')
  }
  const outfile = `build/viframe-extensions-v${manifest.version}.zip`
  await zip('dist', outfile)
  console.log('build:zip successful:', outfile)
}

build()
