import { ObjectUtils, DomHandler, ConnectedOverlayScrollHandler } from 'primevue/utils';
import OverlayEventBus from 'primevue/overlayeventbus';
import { FilterService } from 'primevue/api';
import Ripple from 'primevue/ripple';
import { resolveDirective, openBlock, createBlock, createVNode, renderSlot, Fragment, createTextVNode, toDisplayString, renderList, createCommentVNode, Teleport, Transition, withCtx, withDirectives, vModelText } from 'vue';

var script = {
    emits: ['update:modelValue', 'before-show', 'before-hide', 'change', 'show', 'hide', 'filter'],
    props: {
        modelValue: null,
        options: Array,
        optionLabel: null,
        optionValue: null,
        optionDisabled: null,
        optionGroupLabel: null,
        optionGroupChildren: null,
		scrollHeight: {
			type: String,
			default: '200px'
		},
		placeholder: String,
		disabled: Boolean,
        tabindex: String,
        inputId: String,
        dataKey: null,
        filter: Boolean,
        filterPlaceholder: String,
        filterLocale: String,
        filterMatchMode: {
            type: String,
            default: 'contains'
        },
        filterFields: {
            type: Array,
            default: null
        },
        ariaLabelledBy: null,
        appendTo: {
            type: String,
            default: 'body'
        },
        emptyFilterMessage: {
            type: String,
            default: null
        },
        emptyMessage: {
            type: String,
            default: null
        },
        display: {
            type: String,
            default: 'comma'
        }
    },
    data() {
        return {
            focused: false,
            headerCheckboxFocused: false,
            filterValue: null,
            overlayVisible: false
        };
    },
    outsideClickListener: null,
    resizeListener: null,
    scrollHandler: null,
    overlay: null,
    beforeUnmount() {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();

        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        this.overlay = null;
    },
    methods: {
        getOptionLabel(option) {
            return this.optionLabel ? ObjectUtils.resolveFieldData(option, this.optionLabel) : option;
        },
        getOptionValue(option) {
            return this.optionValue ? ObjectUtils.resolveFieldData(option, this.optionValue) : option;
        },
        getOptionRenderKey(option) {
            return this.dataKey ? ObjectUtils.resolveFieldData(option, this.dataKey) : this.getOptionLabel(option);
        },
        getOptionGroupRenderKey(optionGroup) {
            return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
        },
        getOptionGroupLabel(optionGroup) {
            return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupLabel);
        },
        getOptionGroupChildren(optionGroup) {
            return ObjectUtils.resolveFieldData(optionGroup, this.optionGroupChildren);
        },
        isOptionDisabled(option) {
            return this.optionDisabled ? ObjectUtils.resolveFieldData(option, this.optionDisabled) : false;
        },
        isSelected(option) {
            let selected = false;
            let optionValue = this.getOptionValue(option);

            if (this.modelValue) {
                for (let val of this.modelValue) {
                    if (ObjectUtils.equals(val, optionValue, this.equalityKey)) {
                        selected = true;
                        break;
                    }
                }
            }

            return selected;
        },
        show() {
            this.$emit('before-show');
            this.overlayVisible = true;
        },
        hide() {
            this.$emit('before-hide');
            this.overlayVisible = false;
        },
        onFocus() {
            this.focused = true;
        },
        onBlur() {
            this.focused = false;
        },
        onHeaderCheckboxFocus() {
            this.headerCheckboxFocused = true;
        },
        onHeaderCheckboxBlur() {
            this.headerCheckboxFocused = false;
        },
        onClick(event) {
            if (!this.disabled && (!this.overlay || !this.overlay.contains(event.target)) && !DomHandler.hasClass(event.target, 'p-multiselect-close')) {
                DomHandler.hasClass(event.target, 'p-multiselect-close');
                if (this.overlayVisible)
                    this.hide();
                else
                    this.show();

                this.$refs.focusInput.focus();
            }
        },
        onCloseClick() {
            this.hide();
        },
        onKeyDown(event) {
            switch(event.which) {
                //down
                case 40:
                    if (this.visibleOptions && !this.overlayVisible && event.altKey) {
                        this.show();
                    }
                break;

                //space
                case 32:
                    if (!this.overlayVisible) {
                        this.show();
                        event.preventDefault();
                    }
                break;

                //enter and escape
                case 13:
                case 27:
                    if (this.overlayVisible) {
                        this.hide();
                        event.preventDefault();
                    }
                break;

                //tab
                case 9:
                    this.hide();
                break;
            }
        },
        onOptionSelect(event, option) {
            if (this.disabled || this.isOptionDisabled(option)) {
                return;
            }

            let selected = this.isSelected(option);
            let value = null;

            if (selected)
                value = this.modelValue.filter(val => !ObjectUtils.equals(val, this.getOptionValue(option), this.equalityKey));
            else
                value = [...this.modelValue || [], this.getOptionValue(option)];

            this.$emit('update:modelValue', value);
            this.$emit('change', {originalEvent: event, value: value});
        },
        onOptionKeyDown(event, option) {
            let listItem = event.target;

            switch(event.which) {
                //down
                case 40:
                    var nextItem = this.findNextItem(listItem);
                    if (nextItem) {
                        nextItem.focus();
                    }

                    event.preventDefault();
                break;

                //up
                case 38:
                    var prevItem = this.findPrevItem(listItem);
                    if (prevItem) {
                        prevItem.focus();
                    }

                    event.preventDefault();
                break;

                //enter
                case 13:
                    this.onOptionSelect(event, option);
                    event.preventDefault();
                break;
            }
        },
        findNextItem(item) {
            let nextItem = item.nextElementSibling;

            if (nextItem)
                return DomHandler.hasClass(nextItem, 'p-disabled') || DomHandler.hasClass(nextItem, 'p-multiselect-item-group') ? this.findNextItem(nextItem) : nextItem;
            else
                return null;
        },
        findPrevItem(item) {
            let prevItem = item.previousElementSibling;

            if (prevItem)
                return DomHandler.hasClass(prevItem, 'p-disabled') || DomHandler.hasClass(prevItem, 'p-multiselect-item-group') ? this.findPrevItem(prevItem) : prevItem;
            else
                return null;
        },
        onOverlayEnter() {
            this.overlay.style.zIndex = String(DomHandler.generateZIndex());
            this.alignOverlay();
            this.bindOutsideClickListener();
            this.bindScrollListener();
            this.bindResizeListener();
            this.$emit('show');
        },
        onOverlayLeave() {
            this.unbindOutsideClickListener();
            this.unbindScrollListener();
            this.unbindResizeListener();
            this.$emit('hide');
            this.overlay = null;
        },
        alignOverlay() {
            this.overlay.style.minWidth = DomHandler.getOuterWidth(this.$el) + 'px';
            DomHandler.absolutePosition(this.overlay, this.$el);
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener) {
                this.outsideClickListener = (event) => {
                    if (this.overlayVisible && this.isOutsideClicked(event)) {
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
        bindScrollListener() {
            if (!this.scrollHandler) {
                this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, () => {
                    if (this.overlayVisible) {
                        this.hide();
                    }
                });
            }

            this.scrollHandler.bindScrollListener();
        },
        unbindScrollListener() {
            if (this.scrollHandler) {
                this.scrollHandler.unbindScrollListener();
            }
        },
        bindResizeListener() {
            if (!this.resizeListener) {
                this.resizeListener = () => {
                    if (this.overlayVisible) {
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
        isOutsideClicked(event) {
            return !(this.$el.isSameNode(event.target) || this.$el.contains(event.target) || (this.overlay && this.overlay.contains(event.target)));
        },
        getLabelByValue(val) {
            let option;
            if (this.options) {
                if (this.optionGroupLabel) {
                    for (let optionGroup of this.options) {
                        option = this.findOptionByValue(val, this.getOptionGroupChildren(optionGroup));
                        if (option) {
                            break;
                        }
                    }
                }
                else {
                    option = this.findOptionByValue(val, this.options);
                }
            }

            return option ? this.getOptionLabel(option): null;
        },
        findOptionByValue(val, list) {
            for (let option of list) {
                let optionValue = this.getOptionValue(option);

                if(ObjectUtils.equals(optionValue, val, this.equalityKey)) {
                    return option;
                }
            }

            return null;
        },
        onToggleAll(event) {
            let value = null;

            if (this.allSelected) {
                value = [];
            }
            else if (this.visibleOptions) {
                if (this.optionGroupLabel) {
                    value = [];
                    this.visibleOptions.forEach(optionGroup => value = [...value, ...this.getOptionGroupChildren(optionGroup)]);
                }   
                else  {
                    value = this.visibleOptions.map(option => this.getOptionValue(option));
                }
            }

            this.$emit('update:modelValue', value);
            this.$emit('change', {originalEvent: event, value: value});
        },
        onFilterChange(event) {
            this.$emit('filter', {originalEvent: event, value: event.target.value});
            if (this.overlayVisible) {
                this.alignOverlay();
            }
        },
        overlayRef(el) {
            this.overlay = el;
        },
        removeChip(item) {
            let value = this.modelValue.filter(val => !ObjectUtils.equals(val, item, this.equalityKey));

            this.$emit('update:modelValue', value);
            this.$emit('change', {originalEvent: event, value: value});
        },
        onOverlayClick(event) {
            OverlayEventBus.emit('overlay-click', {
                originalEvent: event,
                target: this.$el
            });
        }
    },
    computed: {
         visibleOptions() {
            if (this.filterValue) {
                if (this.optionGroupLabel) {
                    let filteredGroups = [];
                    for (let optgroup of this.options) {
                        let filteredSubOptions = FilterService.filter(this.getOptionGroupChildren(optgroup), this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale);
                        if (filteredSubOptions && filteredSubOptions.length) {
                            filteredGroups.push({...optgroup, ...{items: filteredSubOptions}});
                        }
                    }
                    return filteredGroups
                }
                else {
                    return FilterService.filter(this.options, this.searchFields, this.filterValue, 'contains', this.filterLocale);
                }
            }
            else {
                return this.options;
            }
        },
        containerClass() {
            return [
                'p-multiselect p-component p-inputwrapper',
                {
                    'p-multiselect-chip': this.display === 'chip',
                    'p-disabled': this.disabled,
                    'p-focus': this.focused,
                    'p-inputwrapper-filled': this.modelValue && this.modelValue.length,
                    'p-inputwrapper-focus': this.focused || this.overlayVisible
                }
            ];
        },
        labelClass() {
            return [
                'p-multiselect-label',
                {
                    'p-placeholder': this.label === this.placeholder,
                    'p-multiselect-label-empty': !this.placeholder && (!this.modelValue || this.modelValue.length === 0)
                }
            ];
        },
        label() {
            let label;

            if (this.modelValue && this.modelValue.length) {
                label = '';
                for(let i = 0; i < this.modelValue.length; i++) {
                    if(i !== 0) {
                        label += ', ';
                    }

                    label += this.getLabelByValue(this.modelValue[i]);
                }
            }
            else {
                label = this.placeholder;
            }

            return label;
        },
        allSelected() {
            if (this.filterValue && this.filterValue.trim().length > 0) {
                if (this.visibleOptions.length === 0) {
                    return false;
                }

				if (this.optionGroupLabel) {
                    for (let optionGroup of this.visibleOptions) {
                        for (let option of this.getOptionGroupChildren(optionGroup)) {
                            if (!this.isSelected(option)) {
                                return false;
                            }
                        }
                    }
                }
                else {
                    for (let option of this.visibleOptions) {
                        if (!this.isSelected(option)) {
                            return false;
                        }
                    }
                }

                return true;
            }
            else {
                if (this.modelValue && this.options) {
                    let optionCount = 0;
                    if (this.optionGroupLabel)
                        this.options.forEach(optionGroup => optionCount += this.getOptionGroupChildren(optionGroup).length);
                    else
                        optionCount = this.options.length;

                    return optionCount > 0 && optionCount === this.modelValue.length;
                }
                
                return false;
            }
        },
        equalityKey() {
            return this.optionValue ? null : this.dataKey;
        },
        searchFields() {
            return this.filterFields || [this.optionLabel];
        },
        emptyFilterMessageText() {
            return this.emptyFilterMessage || this.$primevue.config.locale.emptyFilterMessage;
        },
        emptyMessageText() {
            return this.emptyMessage || this.$primevue.config.locale.emptyMessage;
        }
    },
    directives: {
        'ripple': Ripple
    }
};

const _hoisted_1 = { class: "p-hidden-accessible" };
const _hoisted_2 = { class: "p-multiselect-label-container" };
const _hoisted_3 = { class: "p-multiselect-token-label" };
const _hoisted_4 = /*#__PURE__*/createVNode("div", { class: "p-multiselect-trigger" }, [
  /*#__PURE__*/createVNode("span", { class: "p-multiselect-trigger-icon pi pi-chevron-down" })
], -1);
const _hoisted_5 = { class: "p-multiselect-header" };
const _hoisted_6 = { class: "p-hidden-accessible" };
const _hoisted_7 = {
  key: 0,
  class: "p-multiselect-filter-container"
};
const _hoisted_8 = /*#__PURE__*/createVNode("span", { class: "p-multiselect-filter-icon pi pi-search" }, null, -1);
const _hoisted_9 = /*#__PURE__*/createVNode("span", { class: "p-multiselect-close-icon pi pi-times" }, null, -1);
const _hoisted_10 = {
  class: "p-multiselect-items p-component",
  role: "listbox",
  "aria-multiselectable": "true"
};
const _hoisted_11 = { class: "p-checkbox p-component" };
const _hoisted_12 = { class: "p-multiselect-item-group" };
const _hoisted_13 = { class: "p-checkbox p-component" };
const _hoisted_14 = {
  key: 2,
  class: "p-multiselect-empty-message"
};
const _hoisted_15 = {
  key: 3,
  class: "p-multiselect-empty-message"
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_ripple = resolveDirective("ripple");

  return (openBlock(), createBlock("div", {
    ref: "container",
    class: $options.containerClass,
    onClick: _cache[11] || (_cache[11] = (...args) => ($options.onClick && $options.onClick(...args)))
  }, [
    createVNode("div", _hoisted_1, [
      createVNode("input", {
        ref: "focusInput",
        type: "text",
        role: "listbox",
        id: $props.inputId,
        readonly: "",
        disabled: $props.disabled,
        onFocus: _cache[1] || (_cache[1] = (...args) => ($options.onFocus && $options.onFocus(...args))),
        onBlur: _cache[2] || (_cache[2] = (...args) => ($options.onBlur && $options.onBlur(...args))),
        onKeydown: _cache[3] || (_cache[3] = (...args) => ($options.onKeyDown && $options.onKeyDown(...args))),
        tabindex: $props.tabindex,
        "aria-haspopup": "listbox",
        "aria-expanded": $data.overlayVisible,
        "aria-labelledby": $props.ariaLabelledBy
      }, null, 40, ["id", "disabled", "tabindex", "aria-expanded", "aria-labelledby"])
    ]),
    createVNode("div", _hoisted_2, [
      createVNode("div", { class: $options.labelClass }, [
        renderSlot(_ctx.$slots, "value", {
          value: $props.modelValue,
          placeholder: $props.placeholder
        }, () => [
          ($props.display === 'comma')
            ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                createTextVNode(toDisplayString($options.label || 'empty'), 1)
              ], 64))
            : ($props.display === 'chip')
              ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                  (openBlock(true), createBlock(Fragment, null, renderList($props.modelValue, (item) => {
                    return (openBlock(), createBlock("div", {
                      class: "p-multiselect-token",
                      key: $options.getLabelByValue(item)
                    }, [
                      createVNode("span", _hoisted_3, toDisplayString($options.getLabelByValue(item)), 1),
                      (!$props.disabled)
                        ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "p-multiselect-token-icon pi pi-times-circle",
                            onClick: $event => ($options.removeChip(item))
                          }, null, 8, ["onClick"]))
                        : createCommentVNode("", true)
                    ]))
                  }), 128)),
                  (!$props.modelValue || $props.modelValue.length === 0)
                    ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode(toDisplayString($props.placeholder || 'empty'), 1)
                      ], 64))
                    : createCommentVNode("", true)
                ], 64))
              : createCommentVNode("", true)
        ])
      ], 2)
    ]),
    _hoisted_4,
    (openBlock(), createBlock(Teleport, { to: $props.appendTo }, [
      createVNode(Transition, {
        name: "p-connected-overlay",
        onEnter: $options.onOverlayEnter,
        onLeave: $options.onOverlayLeave
      }, {
        default: withCtx(() => [
          ($data.overlayVisible)
            ? (openBlock(), createBlock("div", {
                key: 0,
                ref: $options.overlayRef,
                class: "p-multiselect-panel p-component",
                onClick: _cache[10] || (_cache[10] = (...args) => ($options.onOverlayClick && $options.onOverlayClick(...args)))
              }, [
                renderSlot(_ctx.$slots, "header", {
                  value: $props.modelValue,
                  options: $options.visibleOptions
                }),
                createVNode("div", _hoisted_5, [
                  createVNode("div", {
                    class: "p-checkbox p-component",
                    onClick: _cache[6] || (_cache[6] = (...args) => ($options.onToggleAll && $options.onToggleAll(...args))),
                    role: "checkbox",
                    "aria-checked": $options.allSelected
                  }, [
                    createVNode("div", _hoisted_6, [
                      createVNode("input", {
                        type: "checkbox",
                        readonly: "",
                        onFocus: _cache[4] || (_cache[4] = (...args) => ($options.onHeaderCheckboxFocus && $options.onHeaderCheckboxFocus(...args))),
                        onBlur: _cache[5] || (_cache[5] = (...args) => ($options.onHeaderCheckboxBlur && $options.onHeaderCheckboxBlur(...args)))
                      }, null, 32)
                    ]),
                    createVNode("div", {
                      class: ['p-checkbox-box', {'p-highlight': $options.allSelected, 'p-focus': $data.headerCheckboxFocused}],
                      role: "checkbox",
                      "aria-checked": $options.allSelected
                    }, [
                      createVNode("span", {
                        class: ['p-checkbox-icon', {'pi pi-check': $options.allSelected}]
                      }, null, 2)
                    ], 10, ["aria-checked"])
                  ], 8, ["aria-checked"]),
                  ($props.filter)
                    ? (openBlock(), createBlock("div", _hoisted_7, [
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ($data.filterValue = $event)),
                          class: "p-multiselect-filter p-inputtext p-component",
                          placeholder: $props.filterPlaceholder,
                          onInput: _cache[8] || (_cache[8] = (...args) => ($options.onFilterChange && $options.onFilterChange(...args)))
                        }, null, 40, ["placeholder"]), [
                          [vModelText, $data.filterValue]
                        ]),
                        _hoisted_8
                      ]))
                    : createCommentVNode("", true),
                  withDirectives(createVNode("button", {
                    class: "p-multiselect-close p-link",
                    onClick: _cache[9] || (_cache[9] = (...args) => ($options.onCloseClick && $options.onCloseClick(...args))),
                    type: "button"
                  }, [
                    _hoisted_9
                  ], 512), [
                    [_directive_ripple]
                  ])
                ]),
                createVNode("div", {
                  class: "p-multiselect-items-wrapper",
                  style: {'max-height': $props.scrollHeight}
                }, [
                  createVNode("ul", _hoisted_10, [
                    (!$props.optionGroupLabel)
                      ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList($options.visibleOptions, (option, i) => {
                          return withDirectives((openBlock(), createBlock("li", {
                            class: ['p-multiselect-item', {'p-highlight': $options.isSelected(option), 'p-disabled': $options.isOptionDisabled(option)}],
                            role: "option",
                            "aria-selected": $options.isSelected(option),
                            key: $options.getOptionRenderKey(option),
                            onClick: $event => ($options.onOptionSelect($event, option)),
                            onKeydown: $event => ($options.onOptionKeyDown($event, option)),
                            tabindex: $props.tabindex||'0',
                            "aria-label": $options.getOptionLabel(option)
                          }, [
                            createVNode("div", _hoisted_11, [
                              createVNode("div", {
                                class: ['p-checkbox-box', {'p-highlight': $options.isSelected(option)}]
                              }, [
                                createVNode("span", {
                                  class: ['p-checkbox-icon', {'pi pi-check': $options.isSelected(option)}]
                                }, null, 2)
                              ], 2)
                            ]),
                            renderSlot(_ctx.$slots, "option", {
                              option: option,
                              index: i
                            }, () => [
                              createVNode("span", null, toDisplayString($options.getOptionLabel(option)), 1)
                            ])
                          ], 42, ["aria-selected", "onClick", "onKeydown", "tabindex", "aria-label"])), [
                            [_directive_ripple]
                          ])
                        }), 128))
                      : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList($options.visibleOptions, (optionGroup, i) => {
                          return (openBlock(), createBlock(Fragment, {
                            key: $options.getOptionGroupRenderKey(optionGroup)
                          }, [
                            createVNode("li", _hoisted_12, [
                              renderSlot(_ctx.$slots, "optiongroup", {
                                option: optionGroup,
                                index: i
                              }, () => [
                                createTextVNode(toDisplayString($options.getOptionGroupLabel(optionGroup)), 1)
                              ])
                            ]),
                            (openBlock(true), createBlock(Fragment, null, renderList($options.getOptionGroupChildren(optionGroup), (option, i) => {
                              return withDirectives((openBlock(), createBlock("li", {
                                class: ['p-multiselect-item', {'p-highlight': $options.isSelected(option), 'p-disabled': $options.isOptionDisabled(option)}],
                                role: "option",
                                "aria-selected": $options.isSelected(option),
                                key: $options.getOptionRenderKey(option),
                                onClick: $event => ($options.onOptionSelect($event, option)),
                                onKeydown: $event => ($options.onOptionKeyDown($event, option)),
                                tabindex: $props.tabindex||'0',
                                "aria-label": $options.getOptionLabel(option)
                              }, [
                                createVNode("div", _hoisted_13, [
                                  createVNode("div", {
                                    class: ['p-checkbox-box', {'p-highlight': $options.isSelected(option)}]
                                  }, [
                                    createVNode("span", {
                                      class: ['p-checkbox-icon', {'pi pi-check': $options.isSelected(option)}]
                                    }, null, 2)
                                  ], 2)
                                ]),
                                renderSlot(_ctx.$slots, "option", {
                                  option: option,
                                  index: i
                                }, () => [
                                  createVNode("span", null, toDisplayString($options.getOptionLabel(option)), 1)
                                ])
                              ], 42, ["aria-selected", "onClick", "onKeydown", "tabindex", "aria-label"])), [
                                [_directive_ripple]
                              ])
                            }), 128))
                          ], 64))
                        }), 128)),
                    ($data.filterValue && (!$options.visibleOptions || ($options.visibleOptions && $options.visibleOptions.length === 0)))
                      ? (openBlock(), createBlock("li", _hoisted_14, [
                          renderSlot(_ctx.$slots, "emptyfilter", {}, () => [
                            createTextVNode(toDisplayString($options.emptyFilterMessageText), 1)
                          ])
                        ]))
                      : ((!$props.options || ($props.options && $props.options.length === 0)))
                        ? (openBlock(), createBlock("li", _hoisted_15, [
                            renderSlot(_ctx.$slots, "empty", {}, () => [
                              createTextVNode(toDisplayString($options.emptyMessageText), 1)
                            ])
                          ]))
                        : createCommentVNode("", true)
                  ])
                ], 4),
                renderSlot(_ctx.$slots, "footer", {
                  value: $props.modelValue,
                  options: $options.visibleOptions
                })
              ], 512))
            : createCommentVNode("", true)
        ]),
        _: 3
      }, 8, ["onEnter", "onLeave"])
    ], 8, ["to"]))
  ], 2))
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

var css_248z = "\n.p-multiselect {\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    cursor: pointer;\n    position: relative;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n}\n.p-multiselect-trigger {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n}\n.p-multiselect-label-container {\n    overflow: hidden;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n    cursor: pointer;\n}\n.p-multiselect-label  {\n    display: block;\n    white-space: nowrap;\n    cursor: pointer;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n.p-multiselect-label-empty {\n    overflow: hidden;\n    visibility: hidden;\n}\n.p-multiselect-token {\n    cursor: default;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-flex: 0;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n}\n.p-multiselect-token-icon {\n    cursor: pointer;\n}\n.p-multiselect .p-multiselect-panel {\n    min-width: 100%;\n}\n.p-multiselect-panel {\n    position: absolute;\n}\n.p-multiselect-items-wrapper {\n    overflow: auto;\n}\n.p-multiselect-items {\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}\n.p-multiselect-item {\n    cursor: pointer;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    font-weight: normal;\n    white-space: nowrap;\n    position: relative;\n    overflow: hidden;\n}\n.p-multiselect-item-group {\n    cursor: auto;\n}\n.p-multiselect-header {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between;\n}\n.p-multiselect-filter-container {\n    position: relative;\n    -webkit-box-flex: 1;\n        -ms-flex: 1 1 auto;\n            flex: 1 1 auto;\n}\n.p-multiselect-filter-icon {\n    position: absolute;\n    top: 50%;\n    margin-top: -.5rem;\n}\n.p-multiselect-filter-container .p-inputtext {\n    width: 100%;\n}\n.p-multiselect-close {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -ms-flex-negative: 0;\n        flex-shrink: 0;\n    overflow: hidden;\n    position: relative;\n}\n.p-fluid .p-multiselect {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n";
styleInject(css_248z);

script.render = render;

export default script;
