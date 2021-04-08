this.primevue = this.primevue || {};
this.primevue.progressbar = (function (vue) {
    'use strict';

    var script = {
        props: {
            value: Number,
            mode: {
                type: String,
                default: 'determinate'
            },
            showValue: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            containerClass() {
                return [
                    'p-progressbar p-component',
                    {
                        'p-progressbar-determinate': this.determinate,
                        'p-progressbar-indeterminate': this.indeterminate
                    }
                ];
            },
            progressStyle() {
                return {
                    width: this.value + '%',
                    display: 'block'
                };
            },
            indeterminate() {
                return this.mode === 'indeterminate';
            },
            determinate() {
                return this.mode === 'determinate';
            }
        }
    };

    const _hoisted_1 = {
      key: 1,
      class: "p-progressbar-label"
    };
    const _hoisted_2 = {
      key: 2,
      class: "p-progressbar-indeterminate-container"
    };
    const _hoisted_3 = /*#__PURE__*/vue.createVNode("div", { class: "p-progressbar-value p-progressbar-value-animate" }, null, -1);

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      return (vue.openBlock(), vue.createBlock("div", {
        role: "progressbar",
        class: $options.containerClass,
        "aria-valuemin": "0",
        "aria-valuenow": $props.value,
        "aria-valuemax": "100"
      }, [
        ($options.determinate)
          ? (vue.openBlock(), vue.createBlock("div", {
              key: 0,
              class: "p-progressbar-value p-progressbar-value-animate",
              style: $options.progressStyle
            }, null, 4))
          : vue.createCommentVNode("", true),
        ($options.determinate && $props.value && $props.showValue)
          ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                vue.createTextVNode(vue.toDisplayString($props.value + '%'), 1)
              ])
            ]))
          : vue.createCommentVNode("", true),
        ($options.indeterminate)
          ? (vue.openBlock(), vue.createBlock("div", _hoisted_2, [
              _hoisted_3
            ]))
          : vue.createCommentVNode("", true)
      ], 10, ["aria-valuenow"]))
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

    var css_248z = "\n.p-progressbar {\n    position: relative;\n    overflow: hidden;\n}\n.p-progressbar-determinate .p-progressbar-value {\n    height: 100%;\n    width: 0%;\n    position: absolute;\n    display: none;\n    border: 0 none;\n}\n.p-progressbar-determinate .p-progressbar-value-animate {\n    -webkit-transition: width 1s ease-in-out;\n    transition: width 1s ease-in-out;\n}\n.p-progressbar-determinate .p-progressbar-label {\n    text-align: center;\n    height: 100%;\n    width: 100%;\n    position: absolute;\n    font-weight: bold;\n}\n.p-progressbar-indeterminate .p-progressbar-value::before {\n      content: '';\n      position: absolute;\n      background-color: inherit;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      will-change: left, right;\n      -webkit-animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n              animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n}\n.p-progressbar-indeterminate .p-progressbar-value::after {\n    content: '';\n    position: absolute;\n    background-color: inherit;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    will-change: left, right;\n    -webkit-animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n            animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n    -webkit-animation-delay: 1.15s;\n            animation-delay: 1.15s;\n}\n@-webkit-keyframes p-progressbar-indeterminate-anim {\n0% {\n    left: -35%;\n    right: 100%;\n}\n60% {\n    left: 100%;\n    right: -90%;\n}\n100% {\n    left: 100%;\n    right: -90%;\n}\n}\n@keyframes p-progressbar-indeterminate-anim {\n0% {\n    left: -35%;\n    right: 100%;\n}\n60% {\n    left: 100%;\n    right: -90%;\n}\n100% {\n    left: 100%;\n    right: -90%;\n}\n}\n@-webkit-keyframes p-progressbar-indeterminate-anim-short {\n0% {\n    left: -200%;\n    right: 100%;\n}\n60% {\n    left: 107%;\n    right: -8%;\n}\n100% {\n    left: 107%;\n    right: -8%;\n}\n}\n@keyframes p-progressbar-indeterminate-anim-short {\n0% {\n    left: -200%;\n    right: 100%;\n}\n60% {\n    left: 107%;\n    right: -8%;\n}\n100% {\n    left: 107%;\n    right: -8%;\n}\n}\n";
    styleInject(css_248z);

    script.render = render;

    return script;

}(Vue));
