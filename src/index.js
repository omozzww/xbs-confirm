import { mergeOptions } from './plugin-helper'
import ConfirmComponent from './xbs-confirm.vue'

let $vm
export function install (vue, options = {}) {
	if (install.installed) return
	install.installed = true

	const Confirm = vue.extend(ConfirmComponent)

	if (!$vm) {
		$vm = new Confirm({
			el: document.createElement('div'),
			propsData: {
				title: ''
			}
		})

		document.body.appendChild($vm.$el)
	}

	const confirm = {
		show (options) {
			if (typeof options === 'object') {
				mergeOptions($vm, options)
			}
			if (typeof options === 'object') {
				options.onShow && options.onShow()
			}
			this.$watcher && this.$watcher()
			this.$watcher = $vm.$watch('showValue', (val) => {
				if (!val && options && options.onHide) {
					options.onHide()
				}
			})

			$vm.$off('on-cancel')
			$vm.$off('on-confirm')

			$vm.$on('on-cancel', () => {
				options && options.onCancel && options.onCancel()
			})
			$vm.$on('on-confirm', msg => {
				options && options.onConfirm && options.onConfirm(msg)
			})
			$vm.showValue = true
		},
		hide () {
			$vm.showValue = false
		},
		isVisible () {
			return $vm.showValue
		}
	}

	if (!vue.$xbs) {
		vue.$xbs = {
			confirm
		}
	} else {
		vue.$xbs.confirm = confirm
	}

	vue.mixin({
		created: function () {
			this.$xbs = vue.$xbs
		}
	})
}

const plugin = {
	install,

	get enabled () {
		return state.enabled
	},

	set enabled (value) {
		state.enabled = value
	}
}


// Auto-install
let GlobalVue = null
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue
}

if (GlobalVue) {
	GlobalVue.use(plugin)
}

export default plugin
