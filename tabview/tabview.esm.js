import { DomHandler } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveDirective, openBlock, createBlock, createVNode, Fragment, renderList, withDirectives, toDisplayString, createCommentVNode, resolveDynamicComponent, vShow } from 'vue';

var script = {
    emits: ['update:activeIndex', 'tab-change', 'tab-click'],
    props: {
        activeIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            d_activeIndex: this.activeIndex
        }
    },
    watch: {
        activeIndex(newValue) {
            this.d_activeIndex = newValue;
        }
    },
    updated() {
        this.updateInkBar();
    },
    mounted() {
        this.updateInkBar();
    },
    methods: {
        onTabClick(event, i) {
            if (!this.isTabDisabled(this.tabs[i]) && i !== this.d_activeIndex) {
                this.d_activeIndex = i;
                this.$emit('update:activeIndex', this.d_activeIndex);

                this.$emit('tab-change', {
                    originalEvent: event,
                    index: i
                });
            }

            this.$emit('tab-click', {
                originalEvent: event,
                index: i
            });
        },
        onTabKeydown(event, i) {
            if (event.which === 13) {
                this.onTabClick(event, i);
            }
        },
        updateInkBar() {
            let tabHeader = this.$refs.nav.children[this.d_activeIndex];
            this.$refs.inkbar.style.width = DomHandler.getWidth(tabHeader) + 'px';
            this.$refs.inkbar.style.left =  DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.$refs.nav).left + 'px';
        },
        getKey(tab, i) {
            return (tab.props && tab.props.header) ? tab.props.header : i;
        },
        isTabDisabled(tab) {
            return (tab.props && tab.props.disabled);
        },
        isTabPanel(child) {
            return child.type.name === 'tabpanel'
        }
    },
    computed: {
        tabs() {
            const tabs = [];
            this.$slots.default().forEach(child => {
                    if (this.isTabPanel(child)) {
                        tabs.push(child);
                    }
                    else if (child.children.length > 0) {
                        child.children.forEach(nestedChild => {
                            if (this.isTabPanel(nestedChild)) {
                                tabs.push(nestedChild);
                            }
                        });
                    }
                }
            );
            return tabs;
        },
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-tabview p-component" };
const _hoisted_2 = {
  ref: "nav",
  class: "p-tabview-nav",
  role: "tablist"
};
const _hoisted_3 = {
  key: 0,
  class: "p-tabview-title"
};
const _hoisted_4 = {
  ref: "inkbar",
  class: "p-tabview-ink-bar"
};
const _hoisted_5 = { class: "p-tabview-panels" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", _hoisted_1, [
    createVNode("ul", _hoisted_2, [
      (openBlock(true), createBlock(Fragment, null, renderList($options.tabs, (tab, i) => {
        return (openBlock(), createBlock("li", {
          role: "presentation",
          key: $options.getKey(tab,i),
          class: [{'p-highlight': ($data.d_activeIndex === i), 'p-disabled': $options.isTabDisabled(tab)}]
        }, [
          withDirectives(createVNode("a", {
            role: "tab",
            class: "p-tabview-nav-link",
            onClick: $event => ($options.onTabClick($event, i)),
            onKeydown: $event => ($options.onTabKeydown($event, i)),
            tabindex: $options.isTabDisabled(tab) ? null : '0',
            "aria-selected": $data.d_activeIndex === i
          }, [
            (tab.props && tab.props.header)
              ? (openBlock(), createBlock("span", _hoisted_3, toDisplayString(tab.props.header), 1))
              : createCommentVNode("", true),
            (tab.children && tab.children.header)
              ? (openBlock(), createBlock(resolveDynamicComponent(tab.children.header), { key: 1 }))
              : createCommentVNode("", true)
          ], 40, ["onClick", "onKeydown", "tabindex", "aria-selected"]), [
            [_directive_ripple]
          ])
        ], 2))
      }), 128)),
      createVNode("li", _hoisted_4, null, 512)
    ], 512),
    createVNode("div", _hoisted_5, [
      (openBlock(true), createBlock(Fragment, null, renderList($options.tabs, (tab, i) => {
        return withDirectives((openBlock(), createBlock("div", {
          key: $options.getKey(tab,i),
          class: "p-tabview-panel",
          role: "tabpanel"
        }, [
          (openBlock(), createBlock(resolveDynamicComponent(tab)))
        ], 512)), [
          [vShow, ($data.d_activeIndex === i)]
        ])
      }), 128))
    ])
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

var css_248z = "\n.p-tabview-nav {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n}\n.p-tabview-nav-link {\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    position: relative;\n    text-decoration: none;\n    overflow: hidden;\n}\n.p-tabview-ink-bar {\n    display: none;\n    z-index: 1;\n}\n.p-tabview-nav-link:focus {\n    z-index: 1;\n}\n.p-tabview-title {\n    line-height: 1;\n}\n";
styleInject(css_248z);

script.render = render;

export default script;
