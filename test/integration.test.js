import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { glob, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'

import { test } from 'uvu'
import * as assert from 'uvu/assert'

// Processes the web component defined in the `name` test sub-directory.
// Asserts that the generated custom-elements.json is as expected.
function process(name) {
  const child_cwd = join(cwd(), 'test', name)
  const child = spawn('cem', ['analyze', '--quiet'], {cwd: child_cwd})
  const stdout = ''
  child.stdout.on('data', data => stdout += data)
  return once(child, 'close').then(async ([exitcode]) => {
    const actual = await readFile(join(child_cwd, 'custom-elements.json'))
    const expected =
        await readFile(join(child_cwd, 'expected-custom-elements.json'))

    assert.equal(actual, expected)
  })
}

const dirs = await Array.fromAsync(glob('test/*', {exclude: ['**/*.js']}))
dirs.map(d => d.substring(5)).map(d => test(d, async () => process(d)))

test.run()
