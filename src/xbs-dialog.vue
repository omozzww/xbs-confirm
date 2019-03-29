<template>
		<div class="xbs-dialog-container" :class="{ 'xbs-dialog-absolute': layout === 'VIEW_BOX' }">
				<transition :name="maskTransition">
						<div class="xbs-mask" @click="hide" v-show="show" :style="maskStyle"></div>
				</transition>
				<transition :name="dialogTransition">
						<div :class="dialogClass" v-show="show" :style="dialogStyle">
								<slot></slot>
						</div>
				</transition>
		</div>
</template>
<script>
import preventBodyScrollMixin from './prevent-body-scroll-mixin'
export default {
	mixins: [preventBodyScrollMixin],
	name: 'xbs-dialog',
	model: {
			prop: 'show',
			event: 'change'
	},
	props: {
			show: {
					type: Boolean,
					default: false
			},
			maskTransition: {
					type: String,
					default: 'xbs-mask'
			},
			maskZIndex: [String, Number],
			dialogTransition: {
					type: String,
					default: 't-xbs-dialog'
			},
			dialogClass: {
					type: String,
					default: 'a-xbs-dialog'
			},
			hideOnBlur: Boolean,
			dialogStyle: Object,
			scroll: {
					type: Boolean,
					default: true
			}
	},
	computed: {
			maskStyle() {
					if (typeof this.maskZIndex !== 'undefined') {
							return {
									zIndex: this.maskZIndex
							}
					}
			}
	},
	mounted() {
			if (typeof window !== 'undefined') {
					if (window.XBS_CONFIG && window.XBS_CONFIG.$layout === 'VIEW_BOX') {
							this.layout = 'VIEW_BOX'
					}
			}
	},
	watch: {
			show(val) {
					this.$emit('update:show', val)
					this.$emit(val ? 'on-show' : 'on-hide')
					if (val) {
							this.addModalClassName()
					} else {
							this.removeModalClassName()
					}
			}
	},
	methods: {
			shouldPreventScroll() {
					// hard to get focus on iOS device with fixed position, so just ignore it
					const iOS = /iPad|iPhone|iPod/i.test(window.navigator.userAgent)
					const hasInput = this.$el.querySelector('input') || this.$el.querySelector('textarea')
					if (iOS && hasInput) {
							return true
					}
			},
			hide() {
					if (this.hideOnBlur) {
							this.$emit('update:show', false)
							this.$emit('change', false)
							this.$emit('on-click-mask')
					}
			}
	},
	data() {
			return {
					layout: ''
			}
	}
}

</script>
<style lang="less">
@import './transition.less';

.xbs-dialog-absolute .xbs-dialog {
		position: absolute;
}

</style>
