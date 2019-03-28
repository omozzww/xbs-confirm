import base from './rollup.config.base'

const config = Object.assign({}, base, {
	output: {
		file: 'dist/xbs-confirm.esm.js',
		format: 'es'
	}
})

export default config
