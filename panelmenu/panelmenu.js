this.primevue = this.primevue || {};
this.primevue.panelmenu = (function (vue, utils) {
    'use strict';

    var script$1 = {
        name: 'sub-panelmenu',
        props: {
    		model: {
                type: null,
                default: null
            }
        },
        data() {
            return {
                activeItem: null
            }
        },
        methods: {
            onItemClick($event, item, navigate) {
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

                if (this.activeItem && this.activeItem === item)
                    this.activeItem = null;
                else
                    this.activeItem = item;

                if (item.to && navigate) {
                    navigate(event);
                }
            },
            getItemClass(item) {
                return ['p-menuitem', item.className];
            },
            getLinkClass(item) {
                return ['p-menuitem-link', {'p-disabled': item.disabled}];
            },
            isActive(item) {
                return item === this.activeItem;
            },
            getSubmenuIcon(item) {
                const active = this.isActive(item);
                return ['p-panelmenu-icon pi pi-fw', {'pi-angle-right': !active, 'pi-angle-down': active}];
            },
            visible(item) {
                return (typeof item.visible === 'function' ? item.visible() : item.visible !== false);
            }
        }
    };

    const _hoisted_1$1 = {
      class: "p-submenu-list",
      role: "tree"
    };
    const _hoisted_2$1 = { class: "p-menuitem-text" };
    const _hoisted_3$1 = { class: "p-menuitem-text" };
    const _hoisted_4 = { class: "p-toggleable-content" };

    function render$1(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_router_link = vue.resolveComponent("router-link");
      const _component_sub_panelmenu = vue.resolveComponent("sub-panelmenu");

      return (vue.openBlock(), vue.createBlock("ul", _hoisted_1$1, [
        (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.model, (item, i) => {
          return (vue.openBlock(), vue.createBlock(vue.Fragment, {
            key: item.label + i.toString()
          }, [
            ($options.visible(item) && !item.separator)
              ? (vue.openBlock(), vue.createBlock("li", {
                  key: 0,
                  role: "none",
                  class: $options.getItemClass(item),
                  style: item.style
                }, [
                  (item.to && !item.disabled)
                    ? (vue.openBlock(), vue.createBlock(_component_router_link, {
                        key: 0,
                        to: item.to,
                        custom: ""
                      }, {
                        default: vue.withCtx(({navigate, href}) => [
                          vue.createVNode("a", {
                            href: href,
                            class: $options.getLinkClass(item),
                            onClick: $event => ($options.onItemClick($event, item, navigate)),
                            role: "treeitem",
                            "aria-expanded": $options.isActive(item)
                          }, [
                            vue.createVNode("span", {
                              class: ['p-menuitem-icon', item.icon]
                            }, null, 2),
                            vue.createVNode("span", _hoisted_2$1, vue.toDisplayString(item.label), 1)
                          ], 10, ["href", "onClick", "aria-expanded"])
                        ]),
                        _: 2
                      }, 1032, ["to"]))
                    : (vue.openBlock(), vue.createBlock("a", {
                        key: 1,
                        href: item.url,
                        class: $options.getLinkClass(item),
                        target: item.target,
                        onClick: $event => ($options.onItemClick($event, item)),
                        role: "treeitem",
                        "aria-expanded": $options.isActive(item),
                        tabindex: item.disabled ? null : '0'
                      }, [
                        (item.items)
                          ? (vue.openBlock(), vue.createBlock("span", {
                              key: 0,
                              class: $options.getSubmenuIcon(item)
                            }, null, 2))
                          : vue.createCommentVNode("", true),
                        vue.createVNode("span", {
                          class: ['p-menuitem-icon', item.icon]
                        }, null, 2),
                        vue.createVNode("span", _hoisted_3$1, vue.toDisplayString(item.label), 1)
                      ], 10, ["href", "target", "onClick", "aria-expanded", "tabindex"])),
                  vue.createVNode(vue.Transition, { name: "p-toggleable-content" }, {
                    default: vue.withCtx(() => [
                      vue.withDirectives(vue.createVNode("div", _hoisted_4, [
                        ($options.visible(item) && item.items)
                          ? (vue.openBlock(), vue.createBlock(_component_sub_panelmenu, {
                              model: item.items,
                              key: item.label + '_sub_'
                            }, null, 8, ["model"]))
                          : vue.createCommentVNode("", true)
                      ], 512), [
                        [vue.vShow, item === $data.activeItem]
                      ])
                    ]),
                    _: 2
                  }, 1024)
                ], 6))
              : vue.createCommentVNode("", true),
            ($options.visible(item) && item.separator)
              ? (vue.openBlock(), vue.createBlock("li", {
                  class: ['p-menu-separator', item.class],
                  style: item.style,
                  key: 'separator' + i.toString()
                }, null, 6))
              : vue.createCommentVNode("", true)
          ], 64))
        }), 128))
      ]))
    }

    script$1.render = render$1;

    var script = {
        props: {
    		model: {
                type: Array,
                default: null
            }
        },
        data() {
            return {
                activeItem: null
            }
        },
        methods: {
            onItemClick(event, item) {
                if (item.disabled) {
                    event.preventDefault();
                    return;
                }

                if (!item.url && !item.to) {
                    event.preventDefault();
                }

                if (item.command) {
                    item.command({
                        originalEvent: event,
                        item: item
                    });
                }

                if (this.activeItem && this.activeItem === item)
                    this.activeItem = null;
                else
                    this.activeItem = item;
            },
            getPanelClass(item) {
                return ['p-panelmenu-panel', item.class];
            },
            getPanelToggleIcon(item) {
                const active = item === this.activeItem;
                return ['p-panelmenu-icon pi', {'pi-chevron-right': !active,' pi-chevron-down': active}];
            },
            getPanelIcon(item) {
                return ['p-menuitem-icon', item.icon];
            },
            isActive(item) {
                return item === this.activeItem;
            },
            getHeaderClass(item) {
                return ['p-component p-panelmenu-header', {'p-highlight': this.isActive(item), 'p-disabled': item.disabled}];
            },
            visible(item) {
                return (typeof item.visible === 'function' ? item.visible() : item.visible !== false);
            }
        },
        components: {
            'PanelMenuSub': script$1
        },
        computed: {
            ariaId() {
                return utils.UniqueComponentId();
            }
        }
    };

    const _hoisted_1 = { class: "p-panelmenu p-component" };
    const _hoisted_2 = { class: "p-menuitem-text" };
    const _hoisted_3 = {
      key: 0,
      class: "p-panelmenu-content"
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_PanelMenuSub = vue.resolveComponent("PanelMenuSub");

      return (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
        (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.model, (item, index) => {
          return (vue.openBlock(), vue.createBlock(vue.Fragment, {
            key: item.label + '_' + index
          }, [
            ($options.visible(item))
              ? (vue.openBlock(), vue.createBlock("div", {
                  key: 0,
                  class: $options.getPanelClass(item),
                  style: item.style
                }, [
                  vue.createVNode("div", {
                    class: $options.getHeaderClass(item),
                    style: item.style
                  }, [
                    vue.createVNode("a", {
                      href: item.url,
                      class: "p-panelmenu-header-link",
                      onClick: $event => ($options.onItemClick($event, item)),
                      tabindex: item.disabled ? null : '0',
                      "aria-expanded": $options.isActive(item),
                      id: $options.ariaId +'_header',
                      "aria-controls": $options.ariaId +'_content'
                    }, [
                      (item.items)
                        ? (vue.openBlock(), vue.createBlock("span", {
                            key: 0,
                            class: $options.getPanelToggleIcon(item)
                          }, null, 2))
                        : vue.createCommentVNode("", true),
                      (item.icon)
                        ? (vue.openBlock(), vue.createBlock("span", {
                            key: 1,
                            class: $options.getPanelIcon(item)
                          }, null, 2))
                        : vue.createCommentVNode("", true),
                      vue.createVNode("span", _hoisted_2, vue.toDisplayString(item.label), 1)
                    ], 8, ["href", "onClick", "tabindex", "aria-expanded", "id", "aria-controls"])
                  ], 6),
                  vue.createVNode(vue.Transition, { name: "p-toggleable-content" }, {
                    default: vue.withCtx(() => [
                      vue.withDirectives(vue.createVNode("div", {
                        class: "p-toggleable-content",
                        role: "region",
                        id: $options.ariaId +'_content' ,
                        "aria-labelledby": $options.ariaId +'_header'
                      }, [
                        (item.items)
                          ? (vue.openBlock(), vue.createBlock("div", _hoisted_3, [
                              vue.createVNode(_component_PanelMenuSub, {
                                model: item.items,
                                class: "p-panelmenu-root-submenu"
                              }, null, 8, ["model"])
                            ]))
                          : vue.createCommentVNode("", true)
                      ], 8, ["id", "aria-labelledby"]), [
                        [vue.vShow, item === $data.activeItem]
                      ])
                    ]),
                    _: 2
                  }, 1024)
                ], 6))
              : vue.createCommentVNode("", true)
          ], 64))
        }), 128))
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

    var css_248z = "\n.p-panelmenu .p-panelmenu-header-link {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    cursor: pointer;\n    position: relative;\n    text-decoration: none;\n}\n.p-panelmenu .p-panelmenu-header-link:focus {\n    z-index: 1;\n}\n.p-panelmenu .p-submenu-list {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n}\n.p-panelmenu .p-menuitem-link {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    cursor: pointer;\n    text-decoration: none;\n}\n.p-panelmenu .p-menuitem-text {\n    line-height: 1;\n}\n";
    styleInject(css_248z);

    script.render = render;

    return script;

}(Vue, primevue.utils));
