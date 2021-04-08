'use strict';

var vue = require('vue');

var script = {
    emits: ['remove'],
    props: {
        label: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            default: null
        },
        image: {
            type: String,
            default: null
        },
        removable: {
            type: Boolean,
            default: false
        },
        removeIcon: {
            type: String,
            default: 'pi pi-times-circle'
        }
    },
    data() {
        return {
            visible: true
        }
    },
    methods: {
        close(event) {
            this.visible = false;
            this.$emit('remove', event);
        }
    },
    computed: {
        containerClass() {
            return ['p-chip p-component', {
                'p-chip-image': this.image != null
            }];
        },
        iconClass() {
            return ['p-chip-icon', this.icon];
        },
        removeIconClass() {
            return ['pi-chip-remove-icon', this.removeIcon];
        }
    }
};

const _hoisted_1 = {
  key: 2,
  class: "p-chip-text"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return ($data.visible)
    ? (vue.openBlock(), vue.createBlock("div", {
        key: 0,
        class: $options.containerClass
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          ($props.image)
            ? (vue.openBlock(), vue.createBlock("img", {
                key: 0,
                src: $props.image
              }, null, 8, ["src"]))
            : ($props.icon)
              ? (vue.openBlock(), vue.createBlock("span", {
                  key: 1,
                  class: $options.iconClass
                }, null, 2))
              : vue.createCommentVNode("", true),
          ($props.label)
            ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, vue.toDisplayString($props.label), 1))
            : vue.createCommentVNode("", true),
          ($props.removable)
            ? (vue.openBlock(), vue.createBlock("span", {
                key: 3,
                tabindex: "0",
                class: $options.removeIconClass,
                onClick: _cache[1] || (_cache[1] = (...args) => ($options.close && $options.close(...args))),
                onKeydown: _cache[2] || (_cache[2] = vue.withKeys((...args) => ($options.close && $options.close(...args)), ["enter"]))
              }, null, 34))
            : vue.createCommentVNode("", true)
        ])
      ], 2))
    : vue.createCommentVNode("", true)
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

var css_248z = "\n.p-chip {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n}\n.p-chip-text {\n    line-height: 1.5;\n}\n.p-chip-icon.pi {\n    line-height: 1.5;\n}\n.pi-chip-remove-icon {\n    line-height: 1.5;\n    cursor: pointer;\n}\n.p-chip img {\n    border-radius: 50%;\n}\n";
styleInject(css_248z);

script.render = render;

module.exports = script;
