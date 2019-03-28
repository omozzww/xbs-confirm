(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.XbsConfirm = {}));
}(this, function (exports) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  var mergeOptions = function mergeOptions($vm, options) {
    var defaults = {};

    for (var i in $vm.$options.props) {
      if (i !== 'value') {
        defaults[i] = $vm.$options.props[i].default;
      }
    }

    var _options = objectAssign({}, defaults, options);

    for (var _i in _options) {
      $vm[_i] = _options[_i];
    }
  };

  var dom = {
    hasClass: function hasClass(el, token) {
      return new RegExp('(\\s|^)' + token + '(\\s|$)').test(el.className);
    },
    addClass: function addClass(el, token) {
      if (!el) {
        return;
      }

      if (el.classList) {
        el.classList.add(token);
      } else if (!this.hasClass(el, token)) {
        el.className += '' + token;
      }
    },
    removeClass: function removeClass(el, token) {
      if (!el) {
        return;
      }

      if (el.classList) {
        el.classList.remove(token);
      } else if (this.hasClass(el, token)) {
        el.className = el.className.replace(new RegExp('(\\s|^)' + token + '(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
      }
    }
  };

  var BODY_CLASS_NAME = 'xbs-modal-open';
  var CONTAINER_CLASS_NAME = 'xbs-modal-open-for-container';
  var XBS_VIEW_BOX_ELEMENT = '#xbs_view_box_body';
  var preventBodyScrollMixin = {
    methods: {
      getLayout: function getLayout() {
        if (typeof window !== 'undefined') {
          if (window.LBS_CONFIG && window.LBS_CONFIG.$layout === 'VIEW_BOX') {
            return 'VIEW_BOX';
          }
        }

        return '';
      },
      addModalClassName: function addModalClassName() {
        if (typeof this.shouldPreventScroll === 'function' && this.shouldPreventScroll()) {
          return;
        }

        if (this.getLayout() === 'VIEW_BOX') {
          dom.addClass(document.body, BODY_CLASS_NAME);
          dom.addClass(document.querySelector(XBS_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME);
        }
      },
      removeModalClassName: function removeModalClassName() {
        if (this.getLayout() === 'VIEW_BOX') {
          dom.removeClass(document.body, BODY_CLASS_NAME);
          dom.removeClass(document.querySelector(XBS_VIEW_BOX_ELEMENT), CONTAINER_CLASS_NAME);
        }
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.removeModalClassName();
    },
    deactivated: function deactivated() {
      this.removeModalClassName();
    }
  };

  //
  var script = {
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
        default: 'xbs-dialog'
      },
      hideOnBlur: Boolean,
      dialogStyle: Object,
      scroll: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      maskStyle: function maskStyle() {
        if (typeof this.maskZIndex !== 'undefined') {
          return {
            zIndex: this.maskZIndex
          };
        }
      }
    },
    mounted: function mounted() {
      if (typeof window !== 'undefined') {
        if (window.XBS_CONFIG && window.XBS_CONFIG.$layout === 'VIEW_BOX') {
          this.layout = 'VIEW_BOX';
        }
      }
    },
    watch: {
      show: function show(val) {
        this.$emit('update:show', val);
        this.$emit(val ? 'on-show' : 'on-hide');

        if (val) {
          this.addModalClassName();
        } else {
          this.removeModalClassName();
        }
      }
    },
    methods: {
      shouldPreventScroll: function shouldPreventScroll() {
        // hard to get focus on iOS device with fixed position, so just ignore it
        var iOS = /iPad|iPhone|iPod/i.test(window.navigator.userAgent);
        var hasInput = this.$el.querySelector('input') || this.$el.querySelector('textarea');

        if (iOS && hasInput) {
          return true;
        }
      },
      hide: function hide() {
        if (this.hideOnBlur) {
          this.$emit('update:show', false);
          this.$emit('change', false);
          this.$emit('on-click-mask');
        }
      }
    },
    data: function data() {
      return {
        layout: ''
      };
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD = document.head || document.getElementsByTagName('head')[0];
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);
        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  var browser = createInjector;

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        staticClass: "xbs-dialog",
        class: { "xbs-dialog-absolute": _vm.layout === "VIEW_BOX" }
      },
      [
        _c("transition", { attrs: { name: _vm.maskTransition } }, [
          _c("div", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.show,
                expression: "show"
              }
            ],
            staticClass: "xbs-mask",
            style: _vm.maskStyle,
            on: { click: _vm.hide }
          })
        ]),
        _vm._v(" "),
        _c("transition", { attrs: { name: _vm.dialogTransition } }, [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.show,
                  expression: "show"
                }
              ],
              class: _vm.dialogClass,
              style: _vm.dialogStyle
            },
            [_vm._t("default")],
            2
          )
        ])
      ],
      1
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-f522f54e_0", { source: ".xbs-dialog-absolute .t-xbs-dialog {\n  position: absolute;\n}\n", map: {"version":3,"sources":["xbs-dialog.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;AACpB","file":"xbs-dialog.vue","sourcesContent":[".xbs-dialog-absolute .t-xbs-dialog {\n  position: absolute;\n}\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = undefined;
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var XbsDialog = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  //
  var script$1 = {
    name: 'confirm',
    components: {
      XbsDialog: XbsDialog
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
        default: 'xbs-fade'
      },
      maskZIndex: [String, Number],
      dialogTransition: {
        type: String,
        default: 'xbs-dialog'
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
    created: function created() {
      this.showValue = this.show;

      if (this.value) {
        this.showValue = this.value;
      }
    },
    watch: {
      value: function value(val) {
        this.showValue = val;
      },
      showValue: function showValue(val) {
        var _this = this;

        this.$emit('input', val);

        if (val) {
          if (this.showInput) {
            this.msg = '';
            setTimeout(function () {
              if (_this.$refs.input) {
                _this.setInputFocus();
              }
            }, 300);
          }

          this.$emit('on-show'); // emit
        }
      }
    },
    data: function data() {
      return {
        msg: '',
        showValue: false
      };
    },
    methods: {
      getInputAttrs: function getInputAttrs() {
        return this.inputAttrs || {
          type: 'text'
        };
      },
      setInputValue: function setInputValue(val) {
        this.msg = val;
      },
      setInputFocus: function setInputFocus(evt) {
        if (evt) {
          evt.preventDefault();
        }

        this.$refs.input.focus();
      },
      _onConfirm: function _onConfirm() {
        if (!this.showValue) {
          return;
        }

        if (this.closeOnConfirm) {
          this.showValue = false;
        }

        this.$emit('on-confirm', this.msg);
      },
      _onCancel: function _onCancel() {
        if (!this.showValue) {
          return;
        }

        this.showValue = false;
        this.$emit('on-cancel');
      }
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { staticClass: "xbs-confirm" },
      [
        _c(
          "xbs-dialog",
          {
            attrs: {
              "dialog-class": "xbs-dialog",
              "mask-transition": _vm.maskTransition,
              "dialog-transition": "xbs-fade",
              "hide-on-blur": _vm.hideOnBlur,
              "mask-z-index": _vm.maskZIndex
            },
            on: {
              "on-hide": function($event) {
                return _vm.$emit("on-hide")
              }
            },
            model: {
              value: _vm.showValue,
              callback: function($$v) {
                _vm.showValue = $$v;
              },
              expression: "showValue"
            }
          },
          [
            !!_vm.title
              ? _c(
                  "div",
                  {
                    staticClass: "xbs-dialog__hd",
                    class: {
                      "with-no-content": !_vm.showContent
                    }
                  },
                  [
                    _c("strong", { staticClass: "xbs-dialog__title" }, [
                      _vm._v(_vm._s(_vm.title))
                    ])
                  ]
                )
              : _vm._e(),
            _vm._v(" "),
            _vm.showContent
              ? [
                  !_vm.showInput
                    ? _c(
                        "div",
                        { staticClass: "xbs-dialog__bd" },
                        [
                          _vm._t("default", [
                            _c("div", {
                              domProps: { innerHTML: _vm._s(_vm.content) }
                            })
                          ])
                        ],
                        2
                      )
                    : _c("div", { staticClass: "xbs-prompt" }, [
                        _vm.getInputAttrs().type === "checkbox"
                          ? _c(
                              "input",
                              _vm._b(
                                {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.msg,
                                      expression: "msg"
                                    }
                                  ],
                                  ref: "input",
                                  staticClass: "xbs-prompt-msgbox",
                                  attrs: {
                                    placeholder: _vm.placeholder,
                                    type: "checkbox"
                                  },
                                  domProps: {
                                    checked: Array.isArray(_vm.msg)
                                      ? _vm._i(_vm.msg, null) > -1
                                      : _vm.msg
                                  },
                                  on: {
                                    touchend: _vm.setInputFocus,
                                    change: function($event) {
                                      var $$a = _vm.msg,
                                        $$el = $event.target,
                                        $$c = $$el.checked ? true : false;
                                      if (Array.isArray($$a)) {
                                        var $$v = null,
                                          $$i = _vm._i($$a, $$v);
                                        if ($$el.checked) {
                                          $$i < 0 && (_vm.msg = $$a.concat([$$v]));
                                        } else {
                                          $$i > -1 &&
                                            (_vm.msg = $$a
                                              .slice(0, $$i)
                                              .concat($$a.slice($$i + 1)));
                                        }
                                      } else {
                                        _vm.msg = $$c;
                                      }
                                    }
                                  }
                                },
                                "input",
                                _vm.getInputAttrs(),
                                false
                              )
                            )
                          : _vm.getInputAttrs().type === "radio"
                          ? _c(
                              "input",
                              _vm._b(
                                {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.msg,
                                      expression: "msg"
                                    }
                                  ],
                                  ref: "input",
                                  staticClass: "xbs-prompt-msgbox",
                                  attrs: {
                                    placeholder: _vm.placeholder,
                                    type: "radio"
                                  },
                                  domProps: { checked: _vm._q(_vm.msg, null) },
                                  on: {
                                    touchend: _vm.setInputFocus,
                                    change: function($event) {
                                      _vm.msg = null;
                                    }
                                  }
                                },
                                "input",
                                _vm.getInputAttrs(),
                                false
                              )
                            )
                          : _c(
                              "input",
                              _vm._b(
                                {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.msg,
                                      expression: "msg"
                                    }
                                  ],
                                  ref: "input",
                                  staticClass: "xbs-prompt-msgbox",
                                  attrs: {
                                    placeholder: _vm.placeholder,
                                    type: _vm.getInputAttrs().type
                                  },
                                  domProps: { value: _vm.msg },
                                  on: {
                                    touchend: _vm.setInputFocus,
                                    input: function($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.msg = $event.target.value;
                                    }
                                  }
                                },
                                "input",
                                _vm.getInputAttrs(),
                                false
                              )
                            )
                      ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "xbs-dialog__ft" }, [
                    _vm.showCancelButton
                      ? _c(
                          "a",
                          {
                            staticClass:
                              "xbs-dialog__btn xbs-dialog__btn_default",
                            attrs: { href: "javascript:;" },
                            on: { click: _vm._onCancel }
                          },
                          [_vm._v(_vm._s(_vm.cancelText || "取消"))]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.showConfirmButton
                      ? _c(
                          "a",
                          {
                            staticClass: "xbs-dialog__btn",
                            class: "xbs-dialog__btn_" + _vm.confirmType,
                            attrs: { href: "javascript:;" },
                            on: { click: _vm._onConfirm }
                          },
                          [_vm._v(_vm._s(_vm.confirmText || "确定"))]
                        )
                      : _vm._e()
                  ])
                ]
              : _vm._e()
          ],
          2
        )
      ],
      1
    )
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-83ccc2c6_0", { source: ".xbs-mask {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.xbs-mask_transparent {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n}\n/**\n* dialog\n*/\n.xbs-dialog {\n  position: fixed;\n  display: table;\n  z-index: 5000;\n  width: 80%;\n  max-width: 300px;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  background-color: #FFFFFF;\n  text-align: center;\n  border-radius: 3px;\n  overflow: hidden;\n}\n.xbs-dialog__hd {\n  padding: 1.3em 1.6em 0.5em;\n}\n.xbs-dialog__hd.with-no-content {\n  padding: 1.7em 1.6em;\n}\n.xbs-dialog__title {\n  font-weight: 400;\n  font-size: 18px;\n}\n.xbs-dialog__bd {\n  padding: 0 1.6em 0.8em;\n  min-height: 40px;\n  font-size: 15px;\n  line-height: 1.3;\n  word-wrap: break-word;\n  word-break: break-all;\n  color: #999999;\n}\n.xbs-dialog__bd:first-child {\n  padding: 2.7em 20px 1.7em;\n  color: #353535;\n}\n.xbs-dialog__ft {\n  position: relative;\n  line-height: 48px;\n  font-size: 18px;\n  display: flex;\n}\n.xbs-dialog__ft:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 1px;\n  border-top: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  transform-origin: 0 0;\n  transform: scaleY(0.5);\n}\n.xbs-dialog__btn {\n  display: block;\n  flex: 1;\n  color: #3CC51F;\n  text-decoration: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  position: relative;\n}\n.xbs-dialog__btn:active {\n  background-color: #EEEEEE;\n}\n.xbs-dialog__btn:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 1px;\n  bottom: 0;\n  border-left: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  transform-origin: 0 0;\n  transform: scaleX(0.5);\n}\n.xbs-dialog__btn:first-child:after {\n  display: none;\n}\n.xbs-dialog__btn_default {\n  color: #353535;\n}\n.xbs-dialog__btn_primary {\n  color: #0BB20C;\n}\n.xbs-dialog__btn_warn {\n  color: #E64340;\n}\n.xbs-skin_android .xbs-dialog {\n  text-align: left;\n  box-shadow: 0 6px 30px 0 rgba(0, 0, 0, 0.1);\n}\n.xbs-skin_android .xbs-dialog__title {\n  font-size: 21px;\n}\n.xbs-skin_android .xbs-dialog__hd {\n  text-align: left;\n}\n.xbs-skin_android .xbs-dialog__bd {\n  color: #999999;\n  padding: 0.25em 1.6em 2em;\n  font-size: 17px;\n  text-align: left;\n}\n.xbs-skin_android .xbs-dialog__bd:first-child {\n  padding: 1.6em 1.6em 2em;\n  color: #353535;\n}\n.xbs-skin_android .xbs-dialog__ft {\n  display: block;\n  text-align: right;\n  line-height: 42px;\n  font-size: 16px;\n  padding: 0 1.6em 0.7em;\n}\n.xbs-skin_android .xbs-dialog__ft:after {\n  display: none;\n}\n.xbs-skin_android .xbs-dialog__btn {\n  display: inline-block;\n  vertical-align: top;\n  padding: 0 0.8em;\n}\n.xbs-skin_android .xbs-dialog__btn:after {\n  display: none;\n}\n.xbs-skin_android .xbs-dialog__btn:active {\n  background-color: rgba(0, 0, 0, 0.06);\n}\n.xbs-skin_android .xbs-dialog__btn:visited {\n  background-color: rgba(0, 0, 0, 0.06);\n}\n.xbs-skin_android .xbs-dialog__btn:last-child {\n  margin-right: -0.8em;\n}\n.xbs-skin_android .xbs-dialog__btn_default {\n  color: #808080;\n}\n@media screen and (min-width: 1024px) {\n.xbs-dialog {\n    width: 35%;\n}\n}\n.xbs-prompt {\n  padding-bottom: 1.6rem;\n}\n.xbs-prompt-msgbox {\n  width: 80%;\n  border: 1px solid #dedede;\n  border-radius: 5px;\n  padding: 4px 5px;\n  appearance: none;\n  outline: none;\n  font-size: 16px;\n}\n", map: {"version":3,"sources":["xbs-confirm.vue","/Users/ppd-03020174/workspace/components/vue/xbs-confirm/src/xbs-confirm.vue"],"names":[],"mappings":"AAAA;EACE,eAAe;EACf,aAAa;EACb,MAAM;EACN,QAAQ;EACR,OAAO;EACP,SAAS;EACT,8BAA8B;AAChC;AACA;EACE,eAAe;EACf,aAAa;EACb,MAAM;EACN,QAAQ;EACR,OAAO;EACP,SAAS;AACX;AACA;;CAEC;AACD;EACE,eAAe;EACf,cAAc;EACd,aAAa;EACb,UAAU;EACV,gBAAgB;EAChB,MAAM;EACN,QAAQ;EACR,SAAS;EACT,OAAO;EACP,YAAY;EACZ,yBAAyB;EACzB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,0BAA0B;AAC5B;AACA;EACE,oBAAoB;AACtB;AACA;EACE,gBAAgB;EAChB,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,gBAAgB;EAChB,eAAe;EACf,gBAAgB;EAChB,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;AAChB;AACA;EACE,yBAAyB;EACzB,cAAc;AAChB;AACA;EACE,kBAAkB;EAClB,iBAAiB;EACjB,eAAe;EACf,aAAa;AACf;AACA;EACE,YAAY;EACZ,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,WAAW;EACX,6BAA6B;EAC7B,cAAc;EACd,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,cAAc;EACd,OAAO;EACP,cAAc;EACd,qBAAqB;EACrB,6CAA6C;EAC7C,kBAAkB;AACpB;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,YAAY;EACZ,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,UAAU;EACV,SAAS;EACT,8BAA8B;EAC9B,cAAc;EACd,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,aAAa;AACf;AACA;EACE,cAAc;AAChB;AACA;EACE,cAAc;AAChB;AACA;EACE,cAAc;AAChB;AACA;EACE,gBAAgB;EAChB,2CAA2C;AAC7C;AACA;EACE,eAAe;AACjB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,cAAc;EACd,yBAAyB;EACzB,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,wBAAwB;EACxB,cAAc;AAChB;AACA;EACE,cAAc;EACd,iBAAiB;EACjB,iBAAiB;EACjB,eAAe;EACf,sBAAsB;AACxB;AACA;EACE,aAAa;AACf;AACA;EACE,qBAAqB;EACrB,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,aAAa;AACf;AACA;EACE,qCAAqC;AACvC;AACA;EACE,qCAAqC;AACvC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,cAAc;AAChB;AACA;AACE;IACE,UAAU;ACCd;AACA;AACA;EDCE,sBAAsB;ACCxB;AACA;EACA,UAAA;EDCE,yBAAyB;ECC3B,kBAAA;EACA,gBAAA;EACA,gBAAA;EACA,aAAA;EACA,eAAA;AACA","file":"xbs-confirm.vue","sourcesContent":[".xbs-mask {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.6);\n}\n.xbs-mask_transparent {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n}\n/**\n* dialog\n*/\n.xbs-dialog {\n  position: fixed;\n  display: table;\n  z-index: 5000;\n  width: 80%;\n  max-width: 300px;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  background-color: #FFFFFF;\n  text-align: center;\n  border-radius: 3px;\n  overflow: hidden;\n}\n.xbs-dialog__hd {\n  padding: 1.3em 1.6em 0.5em;\n}\n.xbs-dialog__hd.with-no-content {\n  padding: 1.7em 1.6em;\n}\n.xbs-dialog__title {\n  font-weight: 400;\n  font-size: 18px;\n}\n.xbs-dialog__bd {\n  padding: 0 1.6em 0.8em;\n  min-height: 40px;\n  font-size: 15px;\n  line-height: 1.3;\n  word-wrap: break-word;\n  word-break: break-all;\n  color: #999999;\n}\n.xbs-dialog__bd:first-child {\n  padding: 2.7em 20px 1.7em;\n  color: #353535;\n}\n.xbs-dialog__ft {\n  position: relative;\n  line-height: 48px;\n  font-size: 18px;\n  display: flex;\n}\n.xbs-dialog__ft:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 1px;\n  border-top: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  transform-origin: 0 0;\n  transform: scaleY(0.5);\n}\n.xbs-dialog__btn {\n  display: block;\n  flex: 1;\n  color: #3CC51F;\n  text-decoration: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  position: relative;\n}\n.xbs-dialog__btn:active {\n  background-color: #EEEEEE;\n}\n.xbs-dialog__btn:after {\n  content: \" \";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 1px;\n  bottom: 0;\n  border-left: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  transform-origin: 0 0;\n  transform: scaleX(0.5);\n}\n.xbs-dialog__btn:first-child:after {\n  display: none;\n}\n.xbs-dialog__btn_default {\n  color: #353535;\n}\n.xbs-dialog__btn_primary {\n  color: #0BB20C;\n}\n.xbs-dialog__btn_warn {\n  color: #E64340;\n}\n.xbs-skin_android .xbs-dialog {\n  text-align: left;\n  box-shadow: 0 6px 30px 0 rgba(0, 0, 0, 0.1);\n}\n.xbs-skin_android .xbs-dialog__title {\n  font-size: 21px;\n}\n.xbs-skin_android .xbs-dialog__hd {\n  text-align: left;\n}\n.xbs-skin_android .xbs-dialog__bd {\n  color: #999999;\n  padding: 0.25em 1.6em 2em;\n  font-size: 17px;\n  text-align: left;\n}\n.xbs-skin_android .xbs-dialog__bd:first-child {\n  padding: 1.6em 1.6em 2em;\n  color: #353535;\n}\n.xbs-skin_android .xbs-dialog__ft {\n  display: block;\n  text-align: right;\n  line-height: 42px;\n  font-size: 16px;\n  padding: 0 1.6em 0.7em;\n}\n.xbs-skin_android .xbs-dialog__ft:after {\n  display: none;\n}\n.xbs-skin_android .xbs-dialog__btn {\n  display: inline-block;\n  vertical-align: top;\n  padding: 0 0.8em;\n}\n.xbs-skin_android .xbs-dialog__btn:after {\n  display: none;\n}\n.xbs-skin_android .xbs-dialog__btn:active {\n  background-color: rgba(0, 0, 0, 0.06);\n}\n.xbs-skin_android .xbs-dialog__btn:visited {\n  background-color: rgba(0, 0, 0, 0.06);\n}\n.xbs-skin_android .xbs-dialog__btn:last-child {\n  margin-right: -0.8em;\n}\n.xbs-skin_android .xbs-dialog__btn_default {\n  color: #808080;\n}\n@media screen and (min-width: 1024px) {\n  .xbs-dialog {\n    width: 35%;\n  }\n}\n.xbs-prompt {\n  padding-bottom: 1.6rem;\n}\n.xbs-prompt-msgbox {\n  width: 80%;\n  border: 1px solid #dedede;\n  border-radius: 5px;\n  padding: 4px 5px;\n  appearance: none;\n  outline: none;\n  font-size: 16px;\n}\n","<template>\n<div class=\"xbs-confirm\">\n\t<xbs-dialog\n\t\tv-model=\"showValue\"\n\t\t:dialog-class=\"'xbs-dialog'\"\n\t\t:mask-transition=\"maskTransition\"\n\t\t:dialog-transition=\"'xbs-fade'\"\n\t\t:hide-on-blur=\"hideOnBlur\"\n\t\t:mask-z-index=\"maskZIndex\"\n\t\t@on-hide=\"$emit('on-hide')\">\n\t\t<div class=\"xbs-dialog__hd\" v-if=\"!!title\" :class=\"{\n\t\t\t'with-no-content': !showContent\n\t\t}\">\n\t\t\t<strong class=\"xbs-dialog__title\">{{ title }}</strong>\n\t\t</div>\n\n\t\t<template v-if=\"showContent\">\n\t\t\t<div class=\"xbs-dialog__bd\" v-if=\"!showInput\">\n\t\t\t\t<slot><div v-html=\"content\"></div></slot>\n\t\t\t</div>\n\t\t\t<div v-else class=\"xbs-prompt\">\n\t\t\t\t<input\n\t\t\t\t\tclass=\"xbs-prompt-msgbox\"\n\t\t\t\t\tv-bind=\"getInputAttrs()\"\n\t\t\t\t\tv-model=\"msg\"\n\t\t\t\t\t:placeholder=\"placeholder\"\n\t\t\t\t\t@touchend=\"setInputFocus\"\n\t\t\t\t\tref=\"input\" />\n\t\t\t</div>\n\t\t\t<div class=\"xbs-dialog__ft\">\n        <a v-if=\"showCancelButton\" href=\"javascript:;\" class=\"xbs-dialog__btn xbs-dialog__btn_default\" @click=\"_onCancel\">{{cancelText || '取消' }}</a>\n        <a v-if=\"showConfirmButton\" href=\"javascript:;\" class=\"xbs-dialog__btn\" :class=\"`xbs-dialog__btn_${confirmType}`\" @click=\"_onConfirm\">{{confirmText || '确定' }}</a>\n      </div>\n\t\t</template>\n\n\t</xbs-dialog>\n</div>\n</template>\n\n<script>\nimport XbsDialog from './xbs-dialog.vue'\nexport default {\n\tname: 'confirm',\n\tcomponents: {\n\t\tXbsDialog\n\t},\n\tprops: {\n\t\tvalue: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: false\n\t\t},\n\t\tshowInput: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: false\n\t\t},\n\t\tplaceholder: {\n\t\t\ttype: String,\n\t\t\tdefault: ''\n\t\t},\n\t\thideOnBlur: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: false\n\t\t},\n\t\ttitle: String,\n\t\tconfirmText: String,\n\t\tcancelText: String,\n\t\tmaskTransition: {\n\t\t\ttype: String,\n\t\t\tdefault: 'xbs-fade'\n\t\t},\n\t\tmaskZIndex: [String, Number],\n\t\tdialogTransition: {\n\t\t\ttype: String,\n\t\t\tdefault: 'xbs-dialog'\n\t\t},\n\t\tcontent: String,\n\t\tcloseOnConfirm: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: true\n\t\t},\n\t\tinputAttrs: Object,\n\t\tshowContent: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: true\n\t\t},\n\t\tconfirmType: {\n\t\t\ttype: String,\n\t\t\tdefault: 'primary'\n\t\t},\n\t\tshowCancelButton: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: true\n\t\t},\n\t\tshowConfirmButton: {\n\t\t\ttype: Boolean,\n\t\t\tdefault: true\n\t\t}\n\t},\n\tcreated () {\n\t\tthis.showValue = this.show\n\t\tif (this.value) {\n\t\t\tthis.showValue = this.value\n\t\t}\n\t},\n\twatch: {\n\t\tvalue (val) {\n\t\t\tthis.showValue = val\n\t\t},\n\t\tshowValue (val) {\n\t\t\tthis.$emit('input', val)\n\t\t\tif (val) {\n\t\t\t\tif (this.showInput) {\n\t\t\t\t\tthis.msg = ''\n\t\t\t\t\tsetTimeout(() => {\n\t\t\t\t\t\tif (this.$refs.input) {\n\t\t\t\t\t\t\tthis.setInputFocus()\n\t\t\t\t\t\t}\n\t\t\t\t\t}, 300)\n\t\t\t\t}\n\t\t\t\tthis.$emit('on-show') // emit\n\t\t\t}\n\t\t}\n\t},\n\tdata () {\n\t\treturn {\n\t\t\tmsg: '',\n\t\t\tshowValue: false\n\t\t}\n\t},\n\tmethods: {\n\t\tgetInputAttrs () {\n\t\t\treturn this.inputAttrs || {\n\t\t\t\ttype: 'text'\n\t\t\t}\n\t\t},\n\t\tsetInputValue (val) {\n\t\t\tthis.msg = val\n\t\t},\n\t\tsetInputFocus (evt) {\n\t\t\tif (evt) {\n\t\t\t\tevt.preventDefault()\n\t\t\t}\n\t\t\tthis.$refs.input.focus()\n\t\t},\n\t\t_onConfirm () {\n\t\t\tif (!this.showValue) {\n\t\t\t\treturn\n\t\t\t}\n\t\t\tif (this.closeOnConfirm) {\n\t\t\t\tthis.showValue = false\n\t\t\t}\n\t\t\tthis.$emit('on-confirm', this.msg)\n\t\t},\n\t\t_onCancel () {\n\t\t\tif (!this.showValue) {\n\t\t\t\treturn\n\t\t\t}\n\t\t\tthis.showValue = false\n\t\t\tthis.$emit('on-cancel')\n\t\t}\n\t}\n}\n</script>\n\n<style lang=\"less\">\n@import './transition.less';\n@import './mask.less';\n@import './dialog.less';\n\n.xbs-prompt {\n\tpadding-bottom: 1.6rem;\n}\n\n.xbs-prompt-msgbox {\n\twidth: 80%;\n\tborder: 1px solid #dedede;\n\tborder-radius: 5px;\n\tpadding: 4px 5px;\n\tappearance: none;\n\toutline: none;\n\tfont-size: 16px;\n}\n\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = undefined;
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    

    
    var ConfirmComponent = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      browser,
      undefined
    );

  var $vm;
  function install(vue) {
    if (install.installed) return;
    install.installed = true;
    var Confirm = vue.extend(ConfirmComponent);

    if (!$vm) {
      $vm = new Confirm({
        el: document.createElement('div'),
        propsData: {
          title: ''
        }
      });
      document.body.appendChild($vm.$el);
    }

    var confirm = {
      show: function show(options) {
        if (_typeof(options) === 'object') {
          mergeOptions($vm, options);
        }

        if (_typeof(options) === 'object') {
          options.onShow && options.onShow();
        }

        this.$watcher && this.$watcher();
        this.$watcher = $vm.$watch('showValue', function (val) {
          if (!val && options && options.onHide) {
            options.onHide();
          }
        });
        $vm.$off('on-cancel');
        $vm.$off('on-confirm');
        $vm.$on('on-cancel', function () {
          options && options.onCancel && options.onCancel();
        });
        $vm.$on('on-confirm', function (msg) {
          options && options.onConfirm && options.onConfirm(msg);
        });
        $vm.showValue = true;
      },
      hide: function hide() {
        $vm.showValue = false;
      },
      isVisible: function isVisible() {
        return $vm.showValue;
      }
    };

    if (!vue.$xbs) {
      vue.$xbs = {
        confirm: confirm
      };
    } else {
      vue.$xbs.confirm = confirm;
    }

    vue.mixin({
      created: function created() {
        this.$xbs = vue.$xbs;
      }
    });
  }
  var plugin = {
    install: install,

    get enabled() {
      return state.enabled;
    },

    set enabled(value) {
      state.enabled = value;
    }

  }; // Auto-install

  var GlobalVue = null;

  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
  }

  if (GlobalVue) {
    GlobalVue.use(plugin);
  }

  exports.default = plugin;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
