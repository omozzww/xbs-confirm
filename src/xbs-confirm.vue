<template>
<div class="xbs-confirm">
	<xbs-dialog
		v-model="showValue"
		:dialog-class="'xbs-dialog'"
		:mask-transition="maskTransition"
		:dialog-transition="dialogTransition"
		:hide-on-blur="hideOnBlur"
		:mask-z-index="maskZIndex"
		@on-hide="$emit('on-hide')">
		<div class="xbs-dialog__hd" v-if="!!title" :class="{
			'with-no-content': !showContent
		}">
			<strong class="xbs-dialog__title">{{ title }}</strong>
		</div>

		<template v-if="showContent">
			<div class="xbs-dialog__bd" v-if="!showInput">
				<slot><div v-html="content"></div></slot>
			</div>
			<div v-else class="xbs-prompt">
				<input
					class="xbs-prompt-msgbox"
					v-bind="getInputAttrs()"
					v-model="msg"
					:placeholder="placeholder"
					@touchend="setInputFocus"
					ref="input" />
			</div>
			<div class="xbs-dialog__ft">
        <a v-if="showCancelButton" href="javascript:;" class="xbs-dialog__btn xbs-dialog__btn_default" @click="_onCancel">{{cancelText || '取消' }}</a>
        <a v-if="showConfirmButton" href="javascript:;" class="xbs-dialog__btn" :class="`xbs-dialog__btn_${confirmType}`" @click="_onConfirm">{{confirmText || '确定' }}</a>
      </div>
		</template>

	</xbs-dialog>
</div>
</template>

<script>
import XbsDialog from './xbs-dialog.vue'
export default {
	name: 'confirm',
	components: {
		XbsDialog
	},
	props: {
		value: {
			type: Boolean,
			default: false
		},
		showInput: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: ''
		},
		hideOnBlur: {
			type: Boolean,
			default: false
		},
		title: String,
		confirmText: String,
		cancelText: String,
		maskTransition: {
			type: String,
			default: 'xbs-mask'
		},
		maskZIndex: [String, Number],
		dialogTransition: {
			type: String,
			default: 'a-xbs-dialog'
		},
		content: String,
		closeOnConfirm: {
			type: Boolean,
			default: true
		},
		inputAttrs: Object,
		showContent: {
			type: Boolean,
			default: true
		},
		confirmType: {
			type: String,
			default: 'primary'
		},
		showCancelButton: {
			type: Boolean,
			default: true
		},
		showConfirmButton: {
			type: Boolean,
			default: true
		}
	},
	created () {
		this.showValue = this.show
		if (this.value) {
			this.showValue = this.value
		}
	},
	watch: {
		value (val) {
			this.showValue = val
		},
		showValue (val) {
			this.$emit('input', val)
			if (val) {
				if (this.showInput) {
					this.msg = ''
					setTimeout(() => {
						if (this.$refs.input) {
							this.setInputFocus()
						}
					}, 300)
				}
				this.$emit('on-show') // emit
			}
		}
	},
	data () {
		return {
			msg: '',
			showValue: false
		}
	},
	methods: {
		getInputAttrs () {
			return this.inputAttrs || {
				type: 'text'
			}
		},
		setInputValue (val) {
			this.msg = val
		},
		setInputFocus (evt) {
			if (evt) {
				evt.preventDefault()
			}
			this.$refs.input.focus()
		},
		_onConfirm () {
			if (!this.showValue) {
				return
			}
			if (this.closeOnConfirm) {
				this.showValue = false
			}
			this.$emit('on-confirm', this.msg)
		},
		_onCancel () {
			if (!this.showValue) {
				return
			}
			this.showValue = false
			this.$emit('on-cancel')
		}
	}
}
</script>

<style lang="less">
// @import './transition.less';
@import './mask.less';
@import './dialog.less';

.xbs-prompt {
	padding-bottom: 1.6rem;
}

.xbs-prompt-msgbox {
	width: 80%;
	border: 1px solid #dedede;
	border-radius: 5px;
	padding: 4px 5px;
	appearance: none;
	outline: none;
	font-size: 16px;
}

</style>
