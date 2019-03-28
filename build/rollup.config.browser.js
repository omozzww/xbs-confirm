import base from './rollup.config.base'
import { uglify } from 'rollup-plugin-uglify'
import { terser } from "rollup-plugin-terser"
import { minify } from 'uglify-es'

const config = Object.assign({}, base, {
	exports: 'named',
	output: {
		file: 'dist/xbs-confirm.min.js',
		format: 'iife',
		name: 'XbsConfirm'
	},
	name: 'XbsConfirm',
})

config.plugins.push(terser({}, minify))

export default config
