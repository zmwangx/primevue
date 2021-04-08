import { DomHandler } from 'primevue/utils';
import Ripple from 'primevue/ripple';
import { resolveComponent, resolveDirective, openBlock, createBlock, Transition, withCtx, Fragment, renderList, withDirectives, createVNode, toDisplayString, createCommentVNode, Teleport, mergeProps } from 'vue';

var script$1 = {
    emits: ['leaf-click'],
    name: 'sub-menu',
    props: {
        model: {
            type: Array,
            default: null
        },
        root: {
            type: Boolean,
            default: false
        },
        parentActive: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        parentActive(newValue) {
            if (!newValue) {
                this.activeItem = null;
            }
        }
    },
    data() {
        return {
            activeItem: null
        }
    },
    methods: {
        onItemMouseEnter(event, item) {
            if (item.disabled) {
                event.preventDefault();
                return;
            }

            this.activeItem = item;
        },
        onItemClick(event, item, navigate) {
            if (item.disabled) {
                event.preventDefault();
                return;
            }

            if (item.command) {
                item.command({
                    originalEvent: event,
                    item: item
                });
            }

            if (item.items) {
                if (this.activeItem && item === this.activeItem)
                    this.activeItem = null;
                else
                   this.activeItem = item;
            }

            if (!item.items) {
                this.onLeafClick();
            }

            if (item.to && navigate) {
                navigate(event);
            }
        },
        onLeafClick() {
            this.activeItem = null;
            this.$emit('leaf-click');
        },
        onEnter() {
            this.position();
        },
        position() {
            const parentItem = this.$refs.container.parentElement;
            const containerOffset = DomHandler.getOffset(this.$refs.container.parentElement);
            const viewport = DomHandler.getViewport();
            const sublistWidth = this.$refs.container.offsetParent ? this.$refs.container.offsetWidth : DomHandler.getHiddenElementOuterWidth(this.$refs.container);
            const itemOuterWidth = DomHandler.getOuterWidth(parentItem.children[0]);

            this.$refs.container.style.top = '0px';

            if ((parseInt(containerOffset.left, 10) + itemOuterWidth + sublistWidth) > (viewport.width - DomHandler.calculateScrollbarWidth())) {
                this.$refs.container.style.left = -1 * sublistWidth + 'px';
            }
            else {
                this.$refs.container.style.left = itemOuterWidth + 'px';
            }
        },
        getItemClass(item) {
            return [
                'p-menuitem', item.class, {
                    'p-menuitem-active': this.activeItem === item
                }
            ]
        },
        getLinkClass(item) {
            return ['p-menuitem-link', {'p-disabled': item.disabled}];
        },
        visible(item) {
            return (typeof item.visible === 'function' ? item.visible() : item.visible !== false);
        }
    },
    computed: {
        containerClass() {
            return {'p-submenu-list': !this.root};
        }
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-menuitem-text" };
const _hoisted_2 = { class: "p-menuitem-text" };
const _hoisted_3 = {
  key: 0,
  class: "p-submenu-icon pi pi-angle-right"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  const _component_sub_menu = resolveComponent("sub-menu");
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock(Transition, {
    name: "p-contextmenusub",
    onEnter: $options.onEnter
  }, {
    default: withCtx(() => [
      ($props.root ? true : $props.parentActive)
        ? (openBlock(), createBlock("ul", {
            key: 0,
            ref: "container",
            class: $options.containerClass,
            role: "menu"
          }, [
            (openBlock(true), createBlock(Fragment, null, renderList($props.model, (item, i) => {
              return (openBlock(), createBlock(Fragment, {
                key: item.label + i.toString()
              }, [
                ($options.visible(item) && !item.separator)
                  ? (openBlock(), createBlock("li", {
                      key: 0,
                      role: "none",
                      class: $options.getItemClass(item),
                      style: item.style,
                      onMouseenter: $event => ($options.onItemMouseEnter($event, item))
                    }, [
                      (item.to && !item.disabled)
                        ? (openBlock(), createBlock(_component_router_link, {
                            key: 0,
                            to: item.to,
                            custom: ""
                          }, {
                            default: withCtx(({navigate, href}) => [
                              withDirectives(createVNode("a", {
                                href: href,
                                onClick: $event => ($options.onItemClick($event, item, navigate)),
                                class: $options.getLinkClass(item),
                                role: "menuitem"
                              }, [
                                createVNode("span", {
                                  class: ['p-menuitem-icon', item.icon]
                                }, null, 2),
                                createVNode("span", _hoisted_1, toDisplayString(item.label), 1)
                              ], 10, ["href", "onClick"]), [
                                [_directive_ripple]
                              ])
                            ]),
                            _: 2
                          }, 1032, ["to"]))
                        : withDirectives((openBlock(), createBlock("a", {
                            key: 1,
                            href: item.url,
                            class: $options.getLinkClass(item),
                            target: item.target,
                            onClick: $event => ($options.onItemClick($event, item)),
                            "aria-haspopup": item.items != null,
                            "aria-expanded": item === $data.activeItem,
                            role: "menuitem",
                            tabindex: item.disabled ? null : '0'
                          }, [
                            createVNode("span", {
                              class: ['p-menuitem-icon', item.icon]
                            }, null, 2),
                            createVNode("span", _hoisted_2, toDisplayString(item.label), 1),
                            (item.items)
                              ? (openBlock(), createBlock("span", _hoisted_3))
                              : createCommentVNode("", true)
                          ], 10, ["href", "target", "onClick", "aria-haspopup", "aria-expanded", "tabindex"])), [
                            [_directive_ripple]
                          ]),
                      ($options.visible(item) && item.items)
                        ? (openBlock(), createBlock(_component_sub_menu, {
                            model: item.items,
                            key: item.label + '_sub_',
                            onLeafClick: $options.onLeafClick,
                            parentActive: item === $data.activeItem
                          }, null, 8, ["model", "onLeafClick", "parentActive"]))
                        : createCommentVNode("", true)
                    ], 46, ["onMouseenter"]))
                  : createCommentVNode("", true),
                ($options.visible(item) && item.separator)
                  ? (openBlock(), createBlock("li", {
                      class: ['p-menu-separator', item.class],
                      style: item.style,
                      key: 'separator' + i.toString(),
                      role: "separator"
                    }, null, 6))
                  : createCommentVNode("", true)
              ], 64))
            }), 128))
          ], 2))
        : createCommentVNode("", true)
    ]),
    _: 1
  }, 8, ["onEnter"]))
}

script$1.render = render$1;

var script = {
    inheritAttrs: false,
    props: {
		model: {
            type: Array,
            default: null
        },
        appendTo: {
            type: String,
            default: 'body'
        },
        autoZIndex: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 0
        },
        global: {
            type: Boolean,
            default: false
        }
    },
    target: null,
    outsideClickListener: null,
    resizeListener: null,
    documentContextMenuListener: null,
    pageX: null,
    pageY: null,
    container: null,
    data() {
        return {
            visible: false
        };
    },
    beforeUnmount() {
        this.unbindResizeListener();
        this.unbindOutsideClickListener();
        this.unbindDocumentContextMenuListener();
        this.container = null;
    },
    mounted() {
        if (this.global) {
            this.bindDocumentContextMenuListener();
        }
    },
    methods: {
        itemClick(event) {
            const item = event.item;
            if (item.command) {
                item.command(event);
                event.originalEvent.preventDefault();
            }
            this.hide();
        },
        toggle(event) {
            if (this.visible)
                this.hide();
            else
                this.show(event);
        },
        onLeafClick() {
            this.hide();
        },
        show(event) {
            this.pageX = event.pageX;
            this.pageY = event.pageY;

            if (this.visible)
                this.position();
            else
                this.visible = true;

            event.stopPropagation();
            event.preventDefault();
        },
        hide() {
            this.visible = false;
        },
        onEnter() {
            this.position();
            this.bindOutsideClickListener();
            this.bindResizeListener();

            if (this.autoZIndex) {
                this.container.style.zIndex = String(this.baseZIndex + DomHandler.generateZIndex());
            }
        },
        onLeave() {
            this.unbindOutsideClickListener();
            this.unbindResizeListener();
        },
        position() {
            let left = this.pageX + 1;
            let top = this.pageY + 1;
            let width = this.container.offsetParent ? this.container.offsetWidth : DomHandler.getHiddenElementOuterWidth(this.container);
            let height = this.container.offsetParent ? this.container.offsetHeight : DomHandler.getHiddenElementOuterHeight(this.container);
            let viewport = DomHandler.getViewport();

            //flip
            if (left + width - document.body.scrollLeft > viewport.width) {
                left -= width;
            }

            //flip
            if (top + height - document.body.scrollTop > viewport.height) {
                top -= height;
            }

            //fit
            if (left < document.body.scrollLeft) {
                left = document.body.scrollLeft;
            }

            //fit
            if (top < document.body.scrollTop) {
                top = document.body.scrollTop;
            }

            this.container.style.left = left + 'px';
            this.container.style.top = top + 'px';
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.visible && this.container && !this.container.contains(event.target) && !event.ctrlKey) {
                        this.hide();
                    }
                };
                document.addEventListener('click', this.outsideClickListener);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener) {
                document.removeEventListener('click', this.outsideClickListener);
                this.outsideClickListener = null;
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.visible) {
                        this.hide();
                    }
                };
                window.addEventListener('resize', this.resizeListener);
            }
        },
        unbindResizeListener() {
            if (this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                this.resizeListener = null;
            }
        },
        bindDocumentContextMenuListener() {
            if (!this.documentContextMenuListener) {
                this.documentContextMenuListener = (event) => {
                    this.show(event);
                };

                document.addEventListener('contextmenu', this.documentContextMenuListener);
            }
        },
        unbindDocumentContextMenuListener() {
            if(this.documentContextMenuListener) {
                document.removeEventListener('contextmenu', this.documentContextMenuListener);
                this.documentContextMenuListener = null;
            }
        },
        containerRef(el) {
            this.container = el;
        }
    },
    components: {
        'ContextMenuSub': script$1
    }
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ContextMenuSub = resolveComponent("ContextMenuSub");

  return (openBlock(), createBlock(Teleport, { to: $props.appendTo }, [
    createVNode(Transition, {
      name: "p-contextmenu",
      onEnter: $options.onEnter,
      onLeave: $options.onLeave
    }, {
      default: withCtx(() => [
        ($data.visible)
          ? (openBlock(), createBlock("div", mergeProps({
              key: 0,
              ref: $options.containerRef,
              class: "p-contextmenu p-component"
            }, _ctx.$attrs), [
              createVNode(_component_ContextMenuSub, {
                model: $props.model,
                root: true,
                onLeafClick: $options.onLeafClick
              }, null, 8, ["model", "onLeafClick"])
            ], 16))
          : createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["onEnter", "onLeave"])
  ], 8, ["to"]))
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

var css_248z = "\n.p-contextmenu {\n    position: absolute;\n}\n.p-contextmenu ul {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n.p-contextmenu .p-submenu-list {\n    position: absolute;\n    min-width: 100%;\n    z-index: 1;\n}\n.p-contextmenu .p-menuitem-link {\n    cursor: pointer;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    text-decoration: none;\n    overflow: hidden;\n    position: relative;\n}\n.p-contextmenu .p-menuitem-text {\n    line-height: 1;\n}\n.p-contextmenu .p-menuitem {\n    position: relative;\n}\n.p-contextmenu .p-menuitem-link .p-submenu-icon {\n    margin-left: auto;\n}\n.p-contextmenu-enter-from {\n    opacity: 0;\n}\n.p-contextmenu-enter-active {\n    -webkit-transition: opacity 250ms;\n    transition: opacity 250ms;\n}\n";
styleInject(css_248z);

script.render = render;

export default script;
