import ToastEventBus from 'primevue/toasteventbus';
import Ripple from 'primevue/ripple';
import { resolveDirective, openBlock, createBlock, createVNode, toDisplayString, withDirectives, createCommentVNode, resolveComponent, Teleport, mergeProps, TransitionGroup, withCtx, Fragment, renderList } from 'vue';
import { DomHandler } from 'primevue/utils';

var script$1 = {
    emits: ['close'],
    props: {
        message: null
    },
    closeTimeout: null,
    mounted() {
        if (this.message.life) {
            this.closeTimeout = setTimeout(() => {
                this.close();
            }, this.message.life);
        }
    },
    methods: {
        close() {
            this.$emit('close', this.message);
        },
        onCloseClick() {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
            }

            this.close();
        }
    },
    computed: {
        containerClass() {
            return ['p-toast-message', {
                'p-toast-message-info': this.message.severity === 'info',
                'p-toast-message-warn': this.message.severity === 'warn',
                'p-toast-message-error': this.message.severity === 'error',
                'p-toast-message-success': this.message.severity === 'success'
            }];
        },
        iconClass() {
            return ['p-toast-message-icon pi', {
                'pi-info-circle': this.message.severity === 'info',
                'pi-exclamation-triangle': this.message.severity === 'warn',
                'pi-times': this.message.severity === 'error',
                'pi-check': this.message.severity === 'success'
            }];
        }
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-toast-message-content" };
const _hoisted_2 = { class: "p-toast-message-text" };
const _hoisted_3 = { class: "p-toast-summary" };
const _hoisted_4 = { class: "p-toast-detail" };
const _hoisted_5 = /*#__PURE__*/createVNode("span", { class: "p-toast-icon-close-icon pi pi-times" }, null, -1);

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", {
    class: $options.containerClass,
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  }, [
    createVNode("div", _hoisted_1, [
      createVNode("span", { class: $options.iconClass }, null, 2),
      createVNode("div", _hoisted_2, [
        createVNode("span", _hoisted_3, toDisplayString($props.message.summary), 1),
        createVNode("div", _hoisted_4, toDisplayString($props.message.detail), 1)
      ]),
      ($props.message.closable !== false)
        ? withDirectives((openBlock(), createBlock("button", {
            key: 0,
            class: "p-toast-icon-close p-link",
            onClick: _cache[1] || (_cache[1] = (...args) => ($options.onCloseClick && $options.onCloseClick(...args))),
            type: "button"
          }, [
            _hoisted_5
          ], 512)), [
            [_directive_ripple]
          ])
        : createCommentVNode("", true)
    ])
  ], 2))
}

script$1.render = render$1;

var messageIdx = 0;

var script = {
    inheritAttrs: false,
    props: {
        group: {
            type: String,
            default: null
        },
        position: {
            type: String,
            default: 'top-right'
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            messages: []
        }
    },
    mounted() {
        ToastEventBus.on('add', (message) => {
            if (this.group == message.group) {
                this.add(message);
            }
        });
        ToastEventBus.on('remove-group', (group) => {
            if (this.group === group) {
                this.messages = [];
            }
        });
        ToastEventBus.on('remove-all-groups', () => {
            this.messages = [];
        });

        this.updateZIndex();
    },
    beforeUpdate() {
        this.updateZIndex();
    },
    methods: {
        add(message) {
            if (message.id == null) {
                message.id = messageIdx++;
            }

            this.messages = [...this.messages, message];
        },
        remove(message) {
            let index = -1;
            for (let i = 0; i < this.messages.length; i++) {
                if (this.messages[i] === message) {
                    index = i;
                    break;
                }
            }

            this.messages.splice(index, 1);
        },
        updateZIndex() {
            if (this.autoZIndex) {
                this.$refs.container.style.zIndex = String(this.baseZIndex + DomHandler.generateZIndex());
            }
        }
    },
    components: {
        'ToastMessage': script$1
    },
    computed: {
        containerClass() {
            return 'p-toast p-component p-toast-' + this.position;
        }
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ToastMessage = resolveComponent("ToastMessage");

  return (openBlock(), createBlock(Teleport, { to: "body" }, [
    createVNode("div", mergeProps({
      ref: "container",
      class: $options.containerClass
    }, _ctx.$attrs), [
      createVNode(TransitionGroup, {
        name: "p-toast-message",
        tag: "div"
      }, {
        default: withCtx(() => [
          (openBlock(true), createBlock(Fragment, null, renderList($data.messages, (msg) => {
            return (openBlock(), createBlock(_component_ToastMessage, {
              key: msg.id,
              message: msg,
              onClose: _cache[1] || (_cache[1] = $event => ($options.remove($event)))
            }, null, 8, ["message"]))
          }), 128))
        ]),
        _: 1
      })
    ], 16)
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

var css_248z = "\n.p-toast {\n    position: fixed;\n    width: 25rem;\n}\n.p-toast-message-content {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: start;\n        -ms-flex-align: start;\n            align-items: flex-start;\n}\n.p-toast-message-text {\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n}\n.p-toast-top-right {\n\ttop: 20px;\n\tright: 20px;\n}\n.p-toast-top-left {\n\ttop: 20px;\n\tleft: 20px;\n}\n.p-toast-bottom-left {\n\tbottom: 20px;\n\tleft: 20px;\n}\n.p-toast-bottom-right {\n\tbottom: 20px;\n\tright: 20px;\n}\n.p-toast-top-center {\n\ttop: 20px;\n    left: 50%;\n    margin-left: -10em;\n}\n.p-toast-bottom-center {\n\tbottom: 20px;\n\tleft: 50%;\n    margin-left: -10em;\n}\n.p-toast-center {\n\tleft: 50%;\n\ttop: 50%;\n    min-width: 20vw;\n    -webkit-transform: translate(-50%, -50%);\n            transform: translate(-50%, -50%);\n}\n.p-toast-icon-close {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    overflow: hidden;\n    position: relative;\n}\n.p-toast-icon-close.p-link {\n\tcursor: pointer;\n}\n\n/* Animations */\n.p-toast-message-enter-from {\n    opacity: 0;\n    -webkit-transform: translateY(50%);\n    transform: translateY(50%);\n}\n.p-toast-message-leave-from {\n    max-height: 1000px;\n}\n.p-toast .p-toast-message.p-toast-message-leave-to {\n    max-height: 0;\n    opacity: 0;\n    margin-bottom: 0;\n    overflow: hidden;\n}\n.p-toast-message-enter-active {\n    -webkit-transition: transform .3s, opacity .3s;\n    -webkit-transition: opacity .3s, -webkit-transform .3s;\n    transition: opacity .3s, -webkit-transform .3s;\n    transition: transform .3s, opacity .3s;\n    transition: transform .3s, opacity .3s, -webkit-transform .3s;\n}\n.p-toast-message-leave-active {\n    -webkit-transition: max-height .45s cubic-bezier(0, 1, 0, 1), opacity .3s, margin-bottom .3s;\n    transition: max-height .45s cubic-bezier(0, 1, 0, 1), opacity .3s, margin-bottom .3s;\n}\n";
styleInject(css_248z);

script.render = render;

export default script;
