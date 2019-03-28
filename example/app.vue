<template>
<div class="my-confirm">

</div>
</template>

<script>
import Vue from 'vue'
import XbsConformPlugin from '../dist/xbs-confirm.esm.js'
Vue.use(XbsConformPlugin)

export default {
	name: 'App',
	mounted () {
		this.$xbs.show({
			onConfirm: () => {},
			onCancel: () => {}
		})
	}
}
</script>

<style lang="less">

</style>
