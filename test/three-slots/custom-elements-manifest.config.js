import plugin from '../../index.js'

export default {
  globs: ['**/*.ts'],
  exclude: ['**/*.js', 'node_modules'],
  outdir: '.',
  litelement: true,
  packagejson: false,
  fast: false,
  stencil: false,
  plugins: [plugin()]
}
