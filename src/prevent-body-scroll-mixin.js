import dom from './dom'

const BODY_CLASS_NAME = 'xbs-modal-open'
const CONTAINER_CLASS_NAME = 'xbs-modal-open-for-container'
const XBS_VIEW_BOX_ELEMENT = '#xbs_view_box_body'

export default {
	methods: {
		getLayout () {
			if (typeof window !== 'undefined') {
				if (window.LBS_CONFIG && window.LBS_CONFIG.$layout === 'VIEW_BOX') {
					return 'VIEW_BOX'
				}
			}
			return ''
		},
		addModalClassName () {
      if (typeof this.shouldPreventScroll === 'function' && this.shouldPreventScroll()) {
        return
      }
      if (this.getLayout() === 'VIEW_BOX') {
        dom.addClass(document.body, BODY_CLASS_NAME)
        dom.addClass(document.querySelector(XBS_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME)
      }
    },
    removeModalClassName () {
      if (this.getLayout() === 'VIEW_BOX') {
        dom.removeClass(document.body, BODY_CLASS_NAME)
        dom.removeClass(document.querySelector(XBS_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME)
      }
    }
	},
	beforeDestroy () {
    this.removeModalClassName()
  },
  deactivated () {
    this.removeModalClassName()
  }
}
