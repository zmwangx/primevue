this.primevue = this.primevue || {};
this.primevue.dialog = (function (utils, Ripple, vue) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);

    var script = {
        inheritAttrs: false,
        emits: ['update:visible', 'show', 'hide'],
        props: {
            header: null,
            footer: null,
            visible: Boolean,
            modal: Boolean,
            contentStyle: null,
            rtl: Boolean,
            maximizable: Boolean,
            dismissableMask: Boolean,
            closable: {
                type: Boolean,
                default: true
            },
            closeOnEscape: {
                type: Boolean,
                default: true
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            baseZIndex: {
                type: Number,
                default: 0
            },
            autoZIndex: {
                type: Boolean,
                default: true
            },
            ariaCloseLabel: {
                type: String,
                default: 'close'
            },
            position: {
                type: String,
                default: 'center'
            },
            breakpoints: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                containerVisible: this.visible,
                maximized: false
            }
        },
        documentKeydownListener: null,
        container: null,
        mask: null,
        styleElement: null,
        updated() {
            if (this.visible) {
                this.containerVisible = this.visible;
            }
        },
        beforeUnmount() {
            this.unbindDocumentState();
            this.destroyStyle();
            this.container = null;
            this.mask = null;
        },
        mounted() {
            if (this.breakpoints) {
                this.createStyle();
            }
        },
        methods: {
            close() {
                this.$emit('update:visible', false);
            },
            onBeforeEnter(el) {
                if (this.autoZIndex) {
                    el.style.zIndex = String(this.baseZIndex + utils.DomHandler.generateZIndex());
                }
                
                el.setAttribute(this.attributeSelector, '');
            },
            onEnter() {
                this.mask.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);

                this.$emit('show');
                this.focus();
                this.enableDocumentSettings();
            },
            onBeforeLeave() {
                utils.DomHandler.addClass(this.mask, 'p-dialog-mask-leave');
            },
            onLeave() {
                this.$emit('hide');
            },
            onAfterLeave() {
                this.containerVisible = false;
                this.unbindDocumentState();
            },
            onMaskClick(event) {
                if (this.dismissableMask && this.closable && this.modal && this.mask === event.target) {
                    this.close();
                }
            },
            focus() {
                let focusTarget = this.container.querySelector('[autofocus]');
                if (focusTarget) {
                    focusTarget.focus();
                }
            },
            maximize() {
                this.maximized = !this.maximized;

                if (!this.modal) {
                    if (this.maximized)
                        utils.DomHandler.addClass(document.body, 'p-overflow-hidden');
                    else
                        utils.DomHandler.removeClass(document.body, 'p-overflow-hidden');
                }
            },
            enableDocumentSettings() {
                if (this.modal) {
                    utils.DomHandler.addClass(document.body, 'p-overflow-hidden');
                    this.bindDocumentKeydownListener();
                }
                else if (this.maximizable && this.maximized) {
                    utils.DomHandler.addClass(document.body, 'p-overflow-hidden');
                }
            },
            unbindDocumentState() {
                if (this.modal) {
                    utils.DomHandler.removeClass(document.body, 'p-overflow-hidden');
                    this.unbindDocumentKeydownListener();
                }
                else if (this.maximizable && this.maximized) {
                    utils.DomHandler.removeClass(document.body, 'p-overflow-hidden');
                }
            },
            onKeyDown(event) {
                if (event.which === 9) {
                    event.preventDefault();
                    let focusableElements = utils.DomHandler.getFocusableElements(this.container);
                    if (focusableElements && focusableElements.length > 0) {
                        if (!document.activeElement) {
                            focusableElements[0].focus();
                        }
                        else {
                            let focusedIndex = focusableElements.indexOf(document.activeElement);
                            if (event.shiftKey) {
                                if (focusedIndex == -1 || focusedIndex === 0)
                                    focusableElements[focusableElements.length - 1].focus();
                                else
                                    focusableElements[focusedIndex - 1].focus();
                            }
                            else {
                                if (focusedIndex == -1 || focusedIndex === (focusableElements.length - 1))
                                    focusableElements[0].focus();
                                else
                                    focusableElements[focusedIndex + 1].focus();
                            }
                        }
                    }
                } else if (event.which === 27 && this.closeOnEscape) {
                    this.close();
                }
            },
            bindDocumentKeydownListener() {
                if (!this.documentKeydownListener) {
                    this.documentKeydownListener = this.onKeyDown.bind(this);
                    window.document.addEventListener('keydown', this.documentKeydownListener);
                }
            },
            unbindDocumentKeydownListener() {
                if (this.documentKeydownListener) {
                    window.document.removeEventListener('keydown', this.documentKeydownListener);
                    this.documentKeydownListener = null;
                }
            },
            getPositionClass() {
                const positions = ['left', 'right', 'top', 'topleft', 'topright', 'bottom', 'bottomleft', 'bottomright'];
                const pos = positions.find(item => item === this.position);

                return pos ? `p-dialog-${pos}` : '';
            },
            containerRef(el) {
                this.container = el;
            },
            maskRef(el) {
                this.mask = el;
            },
            createStyle() {
    			if (!this.styleElement) {
    				this.styleElement = document.createElement('style');
    				this.styleElement.type = 'text/css';
    				document.head.appendChild(this.styleElement);

                    let innerHTML = '';
                    for (let breakpoint in this.breakpoints) {
                        innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.attributeSelector}] {
                                width: ${this.breakpoints[breakpoint]} !important;
                            }
                        }
                    `;
                    }
                    
                    this.styleElement.innerHTML = innerHTML;
    			}
    		},
            destroyStyle() {
                if (this.styleElement) {
                    document.head.removeChild(this.styleElement);
                    this.styleElement = null;
                }
            }
        },
        computed: {
            maskClass() {
                return ['p-dialog-mask', {'p-component-overlay': this.modal}, this.getPositionClass()];
            },
            dialogClass() {
                return ['p-dialog p-component', {
                    'p-dialog-rtl': this.rtl,
                    'p-dialog-maximized': this.maximizable && this.maximized
                }];
            },
            maximizeIconClass() {
                return ['p-dialog-header-maximize-icon pi', {
                    'pi-window-maximize': !this.maximized,
                    'pi-window-minimize': this.maximized
                }];
            },
            ariaId() {
                return utils.UniqueComponentId();
            },
            ariaLabelledById() {
                return this.header != null ? this.ariaId + '_header' : null;
            },
            attributeSelector() {
                return utils.UniqueComponentId();
            }
        },
        directives: {
            'ripple': Ripple__default['default']
        }
    };

    const _hoisted_1 = {
      key: 0,
      class: "p-dialog-header"
    };
    const _hoisted_2 = { class: "p-dialog-header-icons" };
    const _hoisted_3 = /*#__PURE__*/vue.createVNode("span", { class: "p-dialog-header-close-icon pi pi-times" }, null, -1);
    const _hoisted_4 = {
      key: 1,
      class: "p-dialog-footer"
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createBlock(vue.Teleport, { to: "body" }, [
        ($data.containerVisible)
          ? (vue.openBlock(), vue.createBlock("div", {
              key: 0,
              ref: $options.maskRef,
              class: $options.maskClass,
              onClick: _cache[3] || (_cache[3] = (...args) => ($options.onMaskClick && $options.onMaskClick(...args)))
            }, [
              vue.createVNode(vue.Transition, {
                name: "p-dialog",
                onBeforeEnter: $options.onBeforeEnter,
                onEnter: $options.onEnter,
                onBeforeLeave: $options.onBeforeLeave,
                onLeave: $options.onLeave,
                onAfterLeave: $options.onAfterLeave,
                appear: ""
              }, {
                default: vue.withCtx(() => [
                  ($props.visible)
                    ? (vue.openBlock(), vue.createBlock("div", vue.mergeProps({
                        key: 0,
                        ref: $options.containerRef,
                        class: $options.dialogClass
                      }, _ctx.$attrs, {
                        role: "dialog",
                        "aria-labelledby": $options.ariaLabelledById,
                        "aria-modal": $props.modal
                      }), [
                        ($props.showHeader)
                          ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
                              vue.renderSlot(_ctx.$slots, "header", {}, () => [
                                ($props.header)
                                  ? (vue.openBlock(), vue.createBlock("span", {
                                      key: 0,
                                      id: $options.ariaLabelledById,
                                      class: "p-dialog-title"
                                    }, vue.toDisplayString($props.header), 9, ["id"]))
                                  : vue.createCommentVNode("", true)
                              ]),
                              vue.createVNode("div", _hoisted_2, [
                                ($props.maximizable)
                                  ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
                                      key: 0,
                                      class: "p-dialog-header-icon p-dialog-header-maximize p-link",
                                      onClick: _cache[1] || (_cache[1] = (...args) => ($options.maximize && $options.maximize(...args))),
                                      type: "button",
                                      tabindex: "-1"
                                    }, [
                                      vue.createVNode("span", { class: $options.maximizeIconClass }, null, 2)
                                    ], 512)), [
                                      [_directive_ripple]
                                    ])
                                  : vue.createCommentVNode("", true),
                                ($props.closable)
                                  ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
                                      key: 1,
                                      class: "p-dialog-header-icon p-dialog-header-close p-link",
                                      onClick: _cache[2] || (_cache[2] = (...args) => ($options.close && $options.close(...args))),
                                      "aria-label": $props.ariaCloseLabel,
                                      type: "button",
                                      tabindex: "-1"
                                    }, [
                                      _hoisted_3
                                    ], 8, ["aria-label"])), [
                                      [_directive_ripple]
                                    ])
                                  : vue.createCommentVNode("", true)
                              ])
                            ]))
                          : vue.createCommentVNode("", true),
                        vue.createVNode("div", {
                          class: "p-dialog-content",
                          style: $props.contentStyle
                        }, [
                          vue.renderSlot(_ctx.$slots, "default")
                        ], 4),
                        ($props.footer || _ctx.$slots.footer)
                          ? (vue.openBlock(), vue.createBlock("div", _hoisted_4, [
                              vue.renderSlot(_ctx.$slots, "footer", {}, () => [
                                vue.createTextVNode(vue.toDisplayString($props.footer), 1)
                              ])
                            ]))
                          : vue.createCommentVNode("", true)
                      ], 16, ["aria-labelledby", "aria-modal"]))
                    : vue.createCommentVNode("", true)
                ]),
                _: 3
              }, 8, ["onBeforeEnter", "onEnter", "onBeforeLeave", "onLeave", "onAfterLeave"])
            ], 2))
          : vue.createCommentVNode("", true)
      ]))
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = "\n.p-dialog-mask {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    pointer-events: none;\n    background-color: transparent;\n    -webkit-transition-property: background-color;\n    transition-property: background-color;\n}\n.p-dialog-mask.p-component-overlay {\n    pointer-events: auto;\n}\n.p-dialog {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    pointer-events: auto;\n    max-height: 90%;\n    -webkit-transform: scale(1);\n            transform: scale(1);\n}\n.p-dialog-content {\n    overflow-y: auto;\n}\n.p-dialog-header {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-dialog-footer {\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-dialog .p-dialog-header-icons {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.p-dialog .p-dialog-header-icon {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n\n/* Fluid */\n.p-fluid .p-dialog-footer .p-button {\n    width: auto;\n}\n\n/* Animation */\n/* Center */\n.p-dialog-enter-active {\n    -webkit-transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n    transition: all 150ms cubic-bezier(0, 0, 0.2, 1);\n}\n.p-dialog-leave-active {\n    -webkit-transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);\n    transition: all 150ms cubic-bezier(0.4, 0.0, 0.2, 1);\n}\n.p-dialog-enter-from,\n.p-dialog-leave-to {\n    opacity: 0;\n    -webkit-transform: scale(0.7);\n            transform: scale(0.7);\n}\n.p-dialog-mask.p-dialog-mask-leave {\n    background-color: transparent;\n}\n\n/* Top, Bottom, Left, Right, Top* and Bottom* */\n.p-dialog-top .p-dialog,\n.p-dialog-bottom .p-dialog,\n.p-dialog-left .p-dialog,\n.p-dialog-right .p-dialog,\n.p-dialog-topleft .p-dialog,\n.p-dialog-topright .p-dialog,\n.p-dialog-bottomleft .p-dialog,\n.p-dialog-bottomright .p-dialog {\n    margin: .75rem;\n    -webkit-transform: translate3d(0px, 0px, 0px);\n            transform: translate3d(0px, 0px, 0px);\n}\n.p-dialog-top .p-dialog-enter-active,\n.p-dialog-top .p-dialog-leave-active,\n.p-dialog-bottom .p-dialog-enter-active,\n.p-dialog-bottom .p-dialog-leave-active,\n.p-dialog-left .p-dialog-enter-active,\n.p-dialog-left .p-dialog-leave-active,\n.p-dialog-right .p-dialog-enter-active,\n.p-dialog-right .p-dialog-leave-active,\n.p-dialog-topleft .p-dialog-enter-active,\n.p-dialog-topleft .p-dialog-leave-active,\n.p-dialog-topright .p-dialog-enter-active,\n.p-dialog-topright .p-dialog-leave-active,\n.p-dialog-bottomleft .p-dialog-enter-active,\n.p-dialog-bottomleft .p-dialog-leave-active,\n.p-dialog-bottomright .p-dialog-enter-active,\n.p-dialog-bottomright .p-dialog-leave-active {\n    -webkit-transition: all .3s ease-out;\n    transition: all .3s ease-out;\n}\n.p-dialog-top .p-dialog-enter-from,\n.p-dialog-top .p-dialog-leave-to {\n    -webkit-transform: translate3d(0px, -100%, 0px);\n            transform: translate3d(0px, -100%, 0px);\n}\n.p-dialog-bottom .p-dialog-enter-from,\n.p-dialog-bottom .p-dialog-leave-to {\n    -webkit-transform: translate3d(0px, 100%, 0px);\n            transform: translate3d(0px, 100%, 0px);\n}\n.p-dialog-left .p-dialog-enter-from,\n.p-dialog-left .p-dialog-leave-to,\n.p-dialog-topleft .p-dialog-enter-from,\n.p-dialog-topleft .p-dialog-leave-to,\n.p-dialog-bottomleft .p-dialog-enter-from,\n.p-dialog-bottomleft .p-dialog-leave-to {\n    -webkit-transform: translate3d(-100%, 0px, 0px);\n            transform: translate3d(-100%, 0px, 0px);\n}\n.p-dialog-right .p-dialog-enter-from,\n.p-dialog-right .p-dialog-leave-to,\n.p-dialog-topright .p-dialog-enter-from,\n.p-dialog-topright .p-dialog-leave-to,\n.p-dialog-bottomright .p-dialog-enter-from,\n.p-dialog-bottomright .p-dialog-leave-to {\n    -webkit-transform: translate3d(100%, 0px, 0px);\n            transform: translate3d(100%, 0px, 0px);\n}\n\n/* Maximize */\n.p-dialog-maximized {\n    -webkit-transition: none;\n    transition: none;\n    -webkit-transform: none;\n            transform: none;\n    width: 100vw !important;\n    max-height: 100%;\n    height: 100%;\n}\n.p-dialog-maximized .p-dialog-content {\n    -webkit-box-flex: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n}\n\n/* Position */\n.p-dialog-left {\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n}\n.p-dialog-right {\n    -webkit-box-pack: end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n}\n.p-dialog-top {\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n.p-dialog-topleft {\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n.p-dialog-topright {\n    -webkit-box-pack: end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n.p-dialog-bottom {\n    -webkit-box-align: end;\n        -ms-flex-align: end;\n            align-items: flex-end;\n}\n.p-dialog-bottomleft {\n    -webkit-box-pack: start;\n        -ms-flex-pack: start;\n            justify-content: flex-start;\n    -webkit-box-align: end;\n        -ms-flex-align: end;\n            align-items: flex-end;\n}\n.p-dialog-bottomright {\n    -webkit-box-pack: end;\n        -ms-flex-pack: end;\n            justify-content: flex-end;\n    -webkit-box-align: end;\n        -ms-flex-align: end;\n            align-items: flex-end;\n}\n.p-confirm-dialog .p-dialog-content {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n";
    styleInject(css_248z);

    script.render = render;

    return script;

}(primevue.utils, primevue.ripple, Vue));
