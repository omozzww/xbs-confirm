import base from './rollup.config.base'

const config = Object.assign({}, base, {
	exports: 'name',
	output: {
		file: 'dist/xbs-confirm.umd.js',
		format: 'umd',
		name: 'XbsConfirm',
	},
})

export default config
