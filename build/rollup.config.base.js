import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue'
import cjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'

const config = require('../package.json')

export default {
	input: 'src/index.js',
	name: 'xbs-confirm',
	plugins: [
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		cjs({
			include: 'node_modules/**'
		}),
		vue({
			css(style) {
			},
		}),
		babel({
			exclude: 'node_modules/**',
			'plugins': [
				'@babel/plugin-external-helpers'
			]
		}),
		replace({
			VERSION: JSON.stringify(config.version)
		})
	],
	watch: {
		include: 'src/**',
	}
}
