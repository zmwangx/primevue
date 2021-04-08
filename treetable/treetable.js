this.primevue = this.primevue || {};
this.primevue.treetable = (function (utils, api, Ripple, vue, Paginator) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Ripple__default = /*#__PURE__*/_interopDefaultLegacy(Ripple);
    var Paginator__default = /*#__PURE__*/_interopDefaultLegacy(Paginator);

    var script$1 = {
        name: 'sub-ttnode',
        emits: ['node-click', 'node-toggle', 'checkbox-change','nodeClick', 'nodeToggle', 'checkboxChange'],
        props: {
            node: {
                type: null,
                default: null
            },
            parentNode: {
                type: null,
                default: null
            },
            columns: {
                type: null,
                default: null
            },
            expandedKeys: {
                type: null,
                default: null
            },
            selectionKeys: {
                type: null,
                default: null
            },
            selectionMode: {
                type: String,
                default: null
            },
            level: {
                type: Number,
                default: 0
            },
            indentation: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
                checkboxFocused: false
            }
        },
        nodeTouched: false,
        methods: {
            columnProp(col, prop) {
                return col.props ? ((col.type.props[prop].type === Boolean && col.props[prop] === '') ? true : col.props[prop]) : null;
            },
            resolveFieldData(rowData, field) {
                return utils.ObjectUtils.resolveFieldData(rowData, field);
            },
            toggle() {
                this.$emit('node-toggle', this.node);
            },
            onClick(event) {
                if (utils.DomHandler.isClickable(event.target) ||
                    utils.DomHandler.hasClass(event.target, 'p-treetable-toggler') || utils.DomHandler.hasClass(event.target.parentElement, 'p-treetable-toggler')) {
                    return;
                }

                this.$emit('node-click', {
                        originalEvent: event,
                        nodeTouched: this.nodeTouched,
                        node: this.node
                    });

                this.nodeTouched = false;
            },
            onTouchEnd() {
                this.nodeTouched = true;
            },
            onKeyDown(event) {
                if (event.target === this.$el) {
                    const rowElement = this.$el;

                    switch (event.which) {
                        //down arrow
                        case 40: {
                            const nextRow = rowElement.nextElementSibling;
                            if (nextRow) {
                                nextRow.focus();
                            }

                            event.preventDefault();
                            break;
                        }

                        //up arrow
                        case 38: {
                            const previousRow = rowElement.previousElementSibling;
                            if (previousRow) {
                                previousRow.focus();
                            }

                            event.preventDefault();
                            break;
                        }

                        //right-left arrows
                        case 37:
                        case 39: {
                            if (!this.leaf) {
                                this.$emit('node-toggle', this.node);
                                event.preventDefault();
                            }
                            break;
                        }

                        //enter
                        case 13: {
                            this.onClick(event);
                            event.preventDefault();
                            break;
                        }
                    }
                }
            },
            toggleCheckbox() {
                let _selectionKeys = this.selectionKeys ? {...this.selectionKeys} : {};
                const _check = !this.checked;

                this.propagateDown(this.node, _check, _selectionKeys);

                this.$emit('checkbox-change', {
                    node: this.node,
                    check: _check,
                    selectionKeys: _selectionKeys
                });
            },
            propagateDown(node, check, selectionKeys) {
                if (check)
                    selectionKeys[node.key] = {checked: true, partialChecked: false};
                else
                    delete selectionKeys[node.key];

                if (node.children && node.children.length) {
                    for (let child of node.children) {
                        this.propagateDown(child, check, selectionKeys);
                    }
                }
            },
            propagateUp(event) {
                let check = event.check;
                let _selectionKeys = {...event.selectionKeys};
                let checkedChildCount = 0;
                let childPartialSelected = false;

                for(let child of this.node.children) {
                    if(_selectionKeys[child.key] && _selectionKeys[child.key].checked)
                        checkedChildCount++;
                    else if(_selectionKeys[child.key] && _selectionKeys[child.key].partialChecked)
                        childPartialSelected = true;
                }

                if(check && checkedChildCount === this.node.children.length) {
                    _selectionKeys[this.node.key] = {checked: true, partialChecked: false};
                }
                else {
                    if (!check) {
                        delete _selectionKeys[this.node.key];
                    }

                    if(childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== this.node.children.length))
                        _selectionKeys[this.node.key] = {checked: false, partialChecked: true};
                    else
                        _selectionKeys[this.node.key] = {checked: false, partialChecked: false};
                }

                this.$emit('checkbox-change', {
                    node: event.node,
                    check: event.check,
                    selectionKeys: _selectionKeys
                });
            },
            onCheckboxFocus() {
               this.checkboxFocused = true;
            },
            onCheckboxBlur() {
                this.checkboxFocused = false;
            },
            onCheckboxChange(event) {
                let check = event.check;
                let _selectionKeys = {...event.selectionKeys};
                let checkedChildCount = 0;
                let childPartialSelected = false;

                for(let child of this.node.children) {
                    if(_selectionKeys[child.key] && _selectionKeys[child.key].checked)
                        checkedChildCount++;
                    else if(_selectionKeys[child.key] && _selectionKeys[child.key].partialChecked)
                        childPartialSelected = true;
                }

                if(check && checkedChildCount === this.node.children.length) {
                    _selectionKeys[this.node.key] = {checked: true, partialChecked: false};
                }
                else {
                    if (!check) {
                        delete _selectionKeys[this.node.key];
                    }

                    if(childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== this.node.children.length))
                        _selectionKeys[this.node.key] = {checked: false, partialChecked: true};
                    else
                        _selectionKeys[this.node.key] = {checked: false, partialChecked: false};
                }

                this.$emit('checkbox-change', {
                    node: event.node,
                    check: event.check,
                    selectionKeys: _selectionKeys
                });
            }
        },
        computed: {
            containerClass() {
                return [this.node.styleClass, {
                    'p-highlight': this.selected
                }]
            },
            hasChildren() {
                return this.node.children && this.node.children.length > 0;
            },
            expanded() {
                return this.expandedKeys && this.expandedKeys[this.node.key] === true;
            },
            leaf() {
                return this.node.leaf === false ? false : !(this.node.children && this.node.children.length);
            },
            selected() {
                return (this.selectionMode && this.selectionKeys) ? this.selectionKeys[this.node.key] === true : false;
            },
            togglerIcon() {
                return ['p-treetable-toggler-icon pi', {'pi-chevron-right': !this.expanded, 'pi-chevron-down': this.expanded}];
            },
            togglerStyle() {
                return {
                    marginLeft: this.level * this.indentation + 'rem',
                    visibility: this.leaf ? 'hidden' : 'visible'
                };
            },
            childLevel() {
                return this.level + 1;
            },
            checkboxSelectionMode() {
                return this.selectionMode === 'checkbox';
            },
            checkboxClass() {
                return ['p-checkbox-box', {'p-highlight': this.checked, 'p-focus': this.checkboxFocused, 'p-indeterminate': this.partialChecked}];
            },
            checkboxIcon() {
                return ['p-checkbox-icon', {'pi pi-check': this.checked, 'pi pi-minus': this.partialChecked}];
            },
            checked() {
                return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].checked: false;
            },
            partialChecked() {
                return this.selectionKeys ? this.selectionKeys[this.node.key] && this.selectionKeys[this.node.key].partialChecked: false;
            }
        },
        directives: {
            'ripple': Ripple__default['default']
        }
    };

    const _hoisted_1$1 = { class: "p-hidden-accessible" };
    const _hoisted_2$1 = { key: 3 };

    function render$1(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_sub_ttnode = vue.resolveComponent("sub-ttnode");
      const _directive_ripple = vue.resolveDirective("ripple");

      return (vue.openBlock(), vue.createBlock(vue.Fragment, null, [
        vue.createVNode("tr", {
          class: $options.containerClass,
          onClick: _cache[5] || (_cache[5] = (...args) => ($options.onClick && $options.onClick(...args))),
          onKeydown: _cache[6] || (_cache[6] = (...args) => ($options.onKeyDown && $options.onKeyDown(...args))),
          onTouchend: _cache[7] || (_cache[7] = (...args) => ($options.onTouchEnd && $options.onTouchEnd(...args))),
          style: $props.node.style,
          tabindex: "0"
        }, [
          (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($props.columns, (col, i) => {
            return (vue.openBlock(), vue.createBlock("td", {
              key: $options.columnProp(col, 'columnKey')||$options.columnProp(col, 'field')||i,
              style: $options.columnProp(col, 'bodyStyle'),
              class: $options.columnProp(col, 'bodyClass')
            }, [
              ($options.columnProp(col, 'expander'))
                ? vue.withDirectives((vue.openBlock(), vue.createBlock("button", {
                    key: 0,
                    type: "button",
                    class: "p-treetable-toggler p-link",
                    onClick: _cache[1] || (_cache[1] = (...args) => ($options.toggle && $options.toggle(...args))),
                    style: $options.togglerStyle,
                    tabindex: "-1"
                  }, [
                    vue.createVNode("i", { class: $options.togglerIcon }, null, 2)
                  ], 4)), [
                    [_directive_ripple]
                  ])
                : vue.createCommentVNode("", true),
              ($options.checkboxSelectionMode && $options.columnProp(col, 'expander'))
                ? (vue.openBlock(), vue.createBlock("div", {
                    key: 1,
                    class: "p-checkbox p-treetable-checkbox p-component",
                    onClick: _cache[4] || (_cache[4] = (...args) => ($options.toggleCheckbox && $options.toggleCheckbox(...args))),
                    role: "checkbox",
                    "aria-checked": $options.checked
                  }, [
                    vue.createVNode("div", _hoisted_1$1, [
                      vue.createVNode("input", {
                        type: "checkbox",
                        onFocus: _cache[2] || (_cache[2] = (...args) => ($options.onCheckboxFocus && $options.onCheckboxFocus(...args))),
                        onBlur: _cache[3] || (_cache[3] = (...args) => ($options.onCheckboxBlur && $options.onCheckboxBlur(...args)))
                      }, null, 32)
                    ]),
                    vue.createVNode("div", {
                      ref: "checkboxEl",
                      class: $options.checkboxClass
                    }, [
                      vue.createVNode("span", { class: $options.checkboxIcon }, null, 2)
                    ], 2)
                  ], 8, ["aria-checked"]))
                : vue.createCommentVNode("", true),
              (col.children && col.children.body)
                ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(col.children.body), {
                    key: 2,
                    node: $props.node,
                    column: col
                  }, null, 8, ["node", "column"]))
                : (vue.openBlock(), vue.createBlock("span", _hoisted_2$1, vue.toDisplayString($options.resolveFieldData($props.node.data, $options.columnProp(col, 'field'))), 1))
            ], 6))
          }), 128))
        ], 38),
        ($options.expanded && $props.node.children && $props.node.children.length)
          ? (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 0 }, vue.renderList($props.node.children, (childNode) => {
              return (vue.openBlock(), vue.createBlock(_component_sub_ttnode, {
                key: childNode.key,
                columns: $props.columns,
                node: childNode,
                parentNode: $props.node,
                level: $props.level + 1,
                expandedKeys: $props.expandedKeys,
                selectionMode: $props.selectionMode,
                selectionKeys: $props.selectionKeys,
                indentation: $props.indentation,
                onNodeToggle: _cache[8] || (_cache[8] = $event => (_ctx.$emit('node-toggle', $event))),
                onNodeClick: _cache[9] || (_cache[9] = $event => (_ctx.$emit('node-click', $event))),
                onCheckboxChange: $options.onCheckboxChange
              }, null, 8, ["columns", "node", "parentNode", "level", "expandedKeys", "selectionMode", "selectionKeys", "indentation", "onCheckboxChange"]))
            }), 128))
          : vue.createCommentVNode("", true)
      ], 64))
    }

    script$1.render = render$1;

    var script = {
        emits: ['node-expand', 'node-collapse', 'update:expandedKeys', 'update:selectionKeys', 'node-select', 'node-unselect', 
            'update:first', 'update:rows', 'page', 'update:sortField', 'update:sortOrder', 'update:multiSortMeta', 'sort', 'filter', 'column-resize-end'],
        props: {
            value: {
                type: null,
                default: null
            },
            expandedKeys: {
                type: null,
                default: null
            },
            selectionKeys: {
                type: null,
                default: null
            },
            selectionMode: {
                type: String,
                default: null
            },
            metaKeySelection: {
                type: Boolean,
                default: true
            },
            rows: {
                type: Number,
                default: 0
            },
            first: {
                type: Number,
                default: 0
            },
            totalRecords: {
                type: Number,
                default: 0
            },
            paginator: {
                type: Boolean,
                default: false
            },
            paginatorPosition: {
                type: String,
                default: 'bottom'
            },
            alwaysShowPaginator: {
                type: Boolean,
                default: true
            },
            paginatorTemplate: {
                type: String,
                default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
            },
            pageLinkSize: {
                type: Number,
                default: 5
            },
            rowsPerPageOptions: {
                type: Array,
                default: null
            },
            currentPageReportTemplate: {
                type: String,
                default: '({currentPage} of {totalPages})'
            },
            lazy: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: false
            },
            loadingIcon: {
                type: String,
                default: 'pi pi-spinner'
            },
            rowHover: {
                type: Boolean,
                default: false
            },
            autoLayout: {
                type: Boolean,
                default: false
            },
            sortField: {
                type: [String, Function],
                default: null
            },
            sortOrder: {
                type: Number,
                default: null
            },
            defaultSortOrder: {
                type: Number,
                default: 1
            },
            multiSortMeta: {
                type: Array,
                default: null
            },
            sortMode: {
                type: String,
                default: 'single'
            },
            removableSort: {
                type: Boolean,
                default: false
            },
            filters: {
                type: Object,
                default: null
            },
            filterMode: {
                type: String,
                default: 'lenient'
            },
            filterLocale: {
                type: String,
                default: undefined
            },
            resizableColumns: {
                type: Boolean,
                default: false
            },
            columnResizeMode: {
                type: String,
                default: 'fit'
            },
            indentation: {
                type: Number,
                default: 1
            },
            showGridlines: {
                type: Boolean,
                default: false
            }
        },
        documentColumnResizeListener: null,
        documentColumnResizeEndListener: null,
        lastResizeHelperX: null,
        resizeColumnElement: null,
        data() {
            return {
                d_expandedKeys: this.expandedKeys || {},
                d_first: this.first,
                d_rows: this.rows,
                d_sortField: this.sortField,
                d_sortOrder: this.sortOrder,
                d_multiSortMeta: this.multiSortMeta ? [...this.multiSortMeta] : [],
            }
        },
        watch: {
            expandedKeys(newValue) {
                this.d_expandedKeys = newValue;
            },
            first(newValue) {
                this.d_first = newValue;
            },
            rows(newValue) {
                this.d_rows = newValue;
            },
            sortField(newValue) {
                this.d_sortField = newValue;
            },
            sortOrder(newValue) {
                this.d_sortOrder = newValue;
            },
            multiSortMeta(newValue) {
                this.d_multiSortMeta = newValue;
            }
        },
        methods: {
            columnProp(col, prop) {
                return col.props ? ((col.type.props[prop].type === Boolean && col.props[prop] === '') ? true : col.props[prop]) : null;
            },
            onNodeToggle(node) {
                const key = node.key;

                if (this.d_expandedKeys[key]) {
                    delete this.d_expandedKeys[key];
                    this.$emit('node-collapse', node);
                }
                else {
                    this.d_expandedKeys[key] = true;
                    this.$emit('node-expand', node);
                }

                this.d_expandedKeys = {...this.d_expandedKeys};
                this.$emit('update:expandedKeys', this.d_expandedKeys);
            },
            onNodeClick(event) {
                if (this.rowSelectionMode && event.node.selectable !== false) {
                    const metaSelection = event.nodeTouched ? false : this.metaKeySelection;
                    const _selectionKeys = metaSelection ? this.handleSelectionWithMetaKey(event) : this.handleSelectionWithoutMetaKey(event);

                    this.$emit('update:selectionKeys', _selectionKeys);
                }
            },
            handleSelectionWithMetaKey(event) {
                const originalEvent = event.originalEvent;
                const node = event.node;
                const metaKey = (originalEvent.metaKey||originalEvent.ctrlKey);
                const selected = this.isNodeSelected(node);
                let _selectionKeys;

                if (selected && metaKey) {
                    if (this.isSingleSelectionMode()) {
                        _selectionKeys = {};
                    }
                    else {
                        _selectionKeys = {...this.selectionKeys};
                        delete _selectionKeys[node.key];
                    }

                    this.$emit('node-unselect', node);
                }
                else {
                    if (this.isSingleSelectionMode()) {
                        _selectionKeys = {};
                    }
                    else if (this.isMultipleSelectionMode()) {
                        _selectionKeys = !metaKey ? {} : (this.selectionKeys ? {...this.selectionKeys} : {});
                    }

                    _selectionKeys[node.key] = true;
                    this.$emit('node-select', node);
                }

                return _selectionKeys;
            },
            handleSelectionWithoutMetaKey(event) {
                const node = event.node;
                const selected = this.isNodeSelected(node);
                let _selectionKeys;

                if (this.isSingleSelectionMode()) {
                    if (selected) {
                        _selectionKeys = {};
                        this.$emit('node-unselect', node);
                    }
                    else {
                        _selectionKeys = {};
                        _selectionKeys[node.key] = true;
                        this.$emit('node-select', node);
                    }
                }
                else {
                    if (selected) {
                        _selectionKeys = {...this.selectionKeys};
                        delete _selectionKeys[node.key];

                        this.$emit('node-unselect', node);
                    }
                    else {
                        _selectionKeys = this.selectionKeys ? {...this.selectionKeys} : {};
                        _selectionKeys[node.key] = true;

                        this.$emit('node-select', node);
                    }
                }

                return _selectionKeys;
            },
            onCheckboxChange(event) {
                this.$emit('update:selectionKeys', event.selectionKeys);

                if (event.check)
                    this.$emit('node-select', event.node);
                else
                    this.$emit('node-unselect', event.node);
            },
            isSingleSelectionMode() {
                return this.selectionMode === 'single';
            },
            isMultipleSelectionMode() {
                return this.selectionMode === 'multiple';
            },
            onPage(event) {
                this.d_first = event.first;
                this.d_rows = event.rows;

                let pageEvent = this.createLazyLoadEvent(event);
                pageEvent.pageCount = event.pageCount;
                pageEvent.page = event.page;

                this.$emit('update:first', this.d_first);
                this.$emit('update:rows', this.d_rows);
                this.$emit('page', pageEvent);
            },
            resetPage() {
                this.d_first = 0;
                this.$emit('update:first', this.d_first);
            },
            isMultiSorted(column) {
                return this.columnProp(column, 'sortable') && this.getMultiSortMetaIndex(column) > -1
            },
            isColumnSorted(column) {
                if (this.columnProp(column, 'sortable')) {
                    return this.sortMode === 'single' ? (this.d_sortField === (this.columnProp(column, 'field') || this.columnProp(column, 'sortField'))) : this.getMultiSortMetaIndex(column) > -1;
                }

                return false;
            },
            getColumnHeaderClass(column) {
                return [this.columnProp(column, 'headerClass'),
                        {'p-sortable-column': this.columnProp(column, 'sortable')},
                        {'p-resizable-column': this.resizableColumns},
                        {'p-highlight': this.isColumnSorted(column)}
                ];
            },
            getFilterColumnHeaderClass(column) {
                return ['p-filter-column', this.columnProp(column, 'filterHeaderClass')];
            },
            getSortableColumnIcon(column) {
                let sorted = false;
                let sortOrder = null;

                if (this.sortMode === 'single') {
                    sorted =  this.d_sortField === (this.columnProp(column, 'field')|| this.columnProp(column, 'sortField'));
                    sortOrder = sorted ? this.d_sortOrder: 0;
                }
                else if (this.sortMode === 'multiple') {
                    let metaIndex = this.getMultiSortMetaIndex(column);
                    if (metaIndex > -1) {
                        sorted = true;
                        sortOrder = this.d_multiSortMeta[metaIndex].order;
                    }
                }

                return [
                    'p-sortable-column-icon pi pi-fw', {
                        'pi-sort-alt': !sorted,
                        'pi-sort-amount-up-alt': sorted && sortOrder > 0,
                        'pi-sort-amount-down': sorted && sortOrder < 0
                    }
                ];
            },
            getMultiSortMetaIndex(column) {
                let index = -1;

                for (let i = 0; i < this.d_multiSortMeta.length; i++) {
                    let meta = this.d_multiSortMeta[i];
                    if (meta.field === (this.columnProp(column, 'field')|| this.columnProp(column, 'sortField'))) {
                        index = i;
                        break;
                    }
                }

                return index;
            },
            onColumnHeaderClick(event, column) {
                if (this.columnProp(column, 'sortable')) {
                    const targetNode = event.target;
                    const columnField = this.columnProp(column, 'sortField') || this.columnProp(column, 'field');

                    if (utils.DomHandler.hasClass(targetNode, 'p-sortable-column') || utils.DomHandler.hasClass(targetNode, 'p-column-title')
                        || utils.DomHandler.hasClass(targetNode, 'p-sortable-column-icon') || utils.DomHandler.hasClass(targetNode.parentElement, 'p-sortable-column-icon')) {
                        utils.DomHandler.clearSelection();

                        if (this.sortMode === 'single') {
                            if (this.d_sortField === columnField) {
                                if (this.removableSort && (this.d_sortOrder * -1 === this.defaultSortOrder)) {
                                    this.d_sortOrder = null;
                                    this.d_sortField = null;
                                }
                                else {
                                    this.d_sortOrder = this.d_sortOrder * -1;
                                }
                            }
                            else {
                                this.d_sortOrder = this.defaultSortOrder;
                                this.d_sortField = columnField;
                            }

                            this.$emit('update:sortField', this.d_sortField);
                            this.$emit('update:sortOrder', this.d_sortOrder);
                            this.resetPage();
                        }
                        else if (this.sortMode === 'multiple') {
                            let metaKey = event.metaKey || event.ctrlKey;
                            if (!metaKey) {
                                this.d_multiSortMeta =  this.d_multiSortMeta.filter(meta => meta.field === columnField);
                            }

                            this.addMultiSortField(columnField);
                            this.$emit('update:multiSortMeta', this.d_multiSortMeta);
                        }

                        this.$emit('sort', this.createLazyLoadEvent(event));
                    }
                }
            },
            addMultiSortField(field) {
                let index =  this.d_multiSortMeta.findIndex(meta => meta.field === field);

                if (index >= 0) {
                    if (this.removableSort && (this.d_multiSortMeta[index].order * -1 === this.defaultSortOrder))
                        this.d_multiSortMeta.splice(index, 1);
                    else
                        this.d_multiSortMeta[index] = {field: field, order: this.d_multiSortMeta[index].order * -1};
                }
                else {
                    this.d_multiSortMeta.push({field: field, order: this.defaultSortOrder});
                }

                this.d_multiSortMeta = [...this.d_multiSortMeta];
            },
            sortSingle(nodes) {
                return this.sortNodesSingle(nodes);
            },
            sortNodesSingle(nodes) {
                let _nodes = [...nodes];

                _nodes.sort((node1, node2) => {
                    const value1 = utils.ObjectUtils.resolveFieldData(node1.data, this.d_sortField);
                    const value2 = utils.ObjectUtils.resolveFieldData(node2.data, this.d_sortField);
                    let result = null;

                    if (value1 == null && value2 != null)
                        result = -1;
                    else if (value1 != null && value2 == null)
                        result = 1;
                    else if (value1 == null && value2 == null)
                        result = 0;
                    else if (typeof value1 === 'string' && typeof value2 === 'string')
                        result = value1.localeCompare(value2, undefined, { numeric: true });
                    else
                        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

                    return (this.d_sortOrder * result);
                });

                return _nodes;
            },
            sortMultiple(nodes) {
                return this.sortNodesMultiple(nodes);
            },
            sortNodesMultiple(nodes) {
                let _nodes = [...nodes];
                _nodes.sort((node1, node2) => {
                    return this.multisortField(node1, node2, 0);
                });

                return _nodes;
            },
            multisortField(node1, node2, index) {
                const value1 = utils.ObjectUtils.resolveFieldData(node1.data, this.d_multiSortMeta[index].field);
                const value2 = utils.ObjectUtils.resolveFieldData(node2.data, this.d_multiSortMeta[index].field);
                let result = null;

                if (value1 == null && value2 != null)
                    result = -1;
                else if (value1 != null && value2 == null)
                    result = 1;
                else if (value1 == null && value2 == null)
                    result = 0;
                else {
                    if (value1 === value2)  {
                        return (this.d_multiSortMeta.length - 1) > (index) ? (this.multisortField(node1, node2, index + 1)) : 0;
                    }
                    else {
                        if ((typeof value1 === 'string' || value1 instanceof String) && (typeof value2 === 'string' || value2 instanceof String))
                            return (this.d_multiSortMeta[index].order * value1.localeCompare(value2, undefined, { numeric: true }));
                        else
                            result = (value1 < value2) ? -1 : 1;
                    }
                }

                return (this.d_multiSortMeta[index].order * result);
            },
            filter(value) {
                let filteredNodes = [];
                const strict = this.filterMode === 'strict';

                for (let node of value) {
                    let copyNode = {...node};
                    let localMatch = true;
                    let globalMatch = false;

                    for (let j = 0; j < this.columns.length; j++) {
                        let col = this.columns[j];
                        let filterField = this.columnProp(col, 'field');

                        //local
                        if (Object.prototype.hasOwnProperty.call(this.filters, this.columnProp(col, 'field'))) {
                            let filterMatchMode = this.columnProp(col, 'filterMatchMode') || 'startsWith';
                            let filterValue = this.filters[this.columnProp(col, 'field')];
                            let filterConstraint = api.FilterService.filters[filterMatchMode];
                            let paramsWithoutNode = {filterField, filterValue, filterConstraint, strict};

                            if ((strict && !(this.findFilteredNodes(copyNode, paramsWithoutNode) || this.isFilterMatched(copyNode, paramsWithoutNode))) ||
                                (!strict && !(this.isFilterMatched(copyNode, paramsWithoutNode) || this.findFilteredNodes(copyNode, paramsWithoutNode)))) {
                                    localMatch = false;
                            }

                            if (!localMatch) {
                                break;
                            }
                        }

                        //global
                        if (this.hasGlobalFilter() && !globalMatch) {
                            let copyNodeForGlobal = {...copyNode};
                            let filterValue = this.filters['global'];
                            let filterConstraint = api.FilterService.filters['contains'];
                            let globalFilterParamsWithoutNode = {filterField, filterValue, filterConstraint, strict};

                            if ((strict && (this.findFilteredNodes(copyNodeForGlobal, globalFilterParamsWithoutNode) || this.isFilterMatched(copyNodeForGlobal, globalFilterParamsWithoutNode))) ||
                                (!strict && (this.isFilterMatched(copyNodeForGlobal, globalFilterParamsWithoutNode) || this.findFilteredNodes(copyNodeForGlobal, globalFilterParamsWithoutNode)))) {
                                    globalMatch = true;
                                    copyNode = copyNodeForGlobal;
                            }
                        }
                    }

                    let matches = localMatch;
                    if (this.hasGlobalFilter()) {
                        matches = localMatch && globalMatch;
                    }

                    if (matches) {
                        filteredNodes.push(copyNode);
                    }
                }

                let filterEvent = this.createLazyLoadEvent(event);
                filterEvent.filteredValue = filteredNodes;
                this.$emit('filter', filterEvent);

                return filteredNodes;
            },
            findFilteredNodes(node, paramsWithoutNode) {
                if (node) {
                    let matched = false;
                    if (node.children) {
                        let childNodes = [...node.children];
                        node.children = [];
                        for (let childNode of childNodes) {
                            let copyChildNode = {...childNode};
                            if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                                matched = true;
                                node.children.push(copyChildNode);
                            }
                        }
                    }

                    if (matched) {
                        return true;
                    }
                }
            },
            isFilterMatched(node, {filterField, filterValue, filterConstraint, strict}) {
                let matched = false;
                let dataFieldValue = utils.ObjectUtils.resolveFieldData(node.data, filterField);
                if (filterConstraint(dataFieldValue, filterValue, this.filterLocale)) {
                    matched = true;
                }

                if (!matched || (strict && !this.isNodeLeaf(node))) {
                    matched = this.findFilteredNodes(node, {filterField, filterValue, filterConstraint, strict}) || matched;
                }

                return matched;
            },
            isNodeSelected(node) {
                return (this.selectionMode && this.selectionKeys) ? this.selectionKeys[node.key] === true : false;
            },
            isNodeLeaf(node) {
                return node.leaf === false ? false : !(node.children && node.children.length);
            },
            createLazyLoadEvent(event) {
                let filterMatchModes;
                if (this.hasFilters()) {
                    filterMatchModes = {};
                    this.columns.forEach(col => {
                        if (this.columnProp(col, 'field')) {
                            filterMatchModes[col.props.field] = this.columnProp(col, 'filterMatchMode');
                        }
                    });
                }

                return {
                    originalEvent: event,
                    first: this.d_first,
                    rows: this.d_rows,
                    sortField: this.d_sortField,
                    sortOrder: this.d_sortOrder,
                    multiSortMeta: this.d_multiSortMeta,
                    filters: this.filters,
                    filterMatchModes: filterMatchModes
                };
            },
            onColumnResizeStart(event) {
                let containerLeft = utils.DomHandler.getOffset(this.$el).left;
                this.resizeColumnElement = event.target.parentElement;
                this.columnResizing = true;
                this.lastResizeHelperX = (event.pageX - containerLeft + this.$el.scrollLeft);

                this.bindColumnResizeEvents();
            },
            onColumnResize(event) {
                let containerLeft = utils.DomHandler.getOffset(this.$el).left;
                utils.DomHandler.addClass(this.$el, 'p-unselectable-text');
                this.$refs.resizeHelper.style.height = this.$el.offsetHeight + 'px';
                this.$refs.resizeHelper.style.top = 0 + 'px';
                this.$refs.resizeHelper.style.left = (event.pageX - containerLeft + this.$el.scrollLeft) + 'px';

                this.$refs.resizeHelper.style.display = 'block';
            },
            onColumnResizeEnd() {
                let delta = this.$refs.resizeHelper.offsetLeft - this.lastResizeHelperX;
                let columnWidth = this.resizeColumnElement.offsetWidth;
                let newColumnWidth = columnWidth + delta;
                let minWidth = this.resizeColumnElement.style.minWidth||15;

                if(columnWidth + delta > parseInt(minWidth, 10)) {
                    if(this.columnResizeMode === 'fit') {
                        let nextColumn = this.resizeColumnElement.nextElementSibling;
                        let nextColumnWidth = nextColumn.offsetWidth - delta;

                        if(newColumnWidth > 15 && nextColumnWidth > 15) {
                            this.resizeColumnElement.style.width = newColumnWidth + 'px';
                            if(nextColumn) {
                                nextColumn.style.width = nextColumnWidth + 'px';
                            }
                        }
                    }
                    else if(this.columnResizeMode === 'expand') {
                        this.$refs.table.style.width = this.$refs.table.offsetWidth + delta + 'px';
                        this.resizeColumnElement.style.width = newColumnWidth + 'px';
                    }

                    this.$emit('column-resize-end', {
                        element: this.resizeColumnElement,
                        delta: delta
                    });
                }

                this.$refs.resizeHelper.style.display = 'none';
                this.resizeColumn = null;
                utils.DomHandler.removeClass(this.$el, 'p-unselectable-text');

                this.unbindColumnResizeEvents();
            },
            bindColumnResizeEvents() {
                if (!this.documentColumnResizeListener) {
                    this.documentColumnResizeListener = document.addEventListener('mousemove', () => {
                        if(this.columnResizing) {
                            this.onColumnResize(event);
                        }
                    });
                }

                if (!this.documentColumnResizeEndListener) {
                    this.documentColumnResizeEndListener = document.addEventListener('mouseup', () => {
                        if(this.columnResizing) {
                            this.columnResizing = false;
                            this.onColumnResizeEnd();
                        }
                    });
                }

            },
            unbindColumnResizeEvents() {
                if (this.documentColumnResizeListener) {
                    document.removeEventListener('document', this.documentColumnResizeListener);
                    this.documentColumnResizeListener = null;
                }

                if (this.documentColumnResizeEndListener) {
                    document.removeEventListener('document', this.documentColumnResizeEndListener);
                     this.documentColumnResizeEndListener = null;
                }
            },
            onColumnKeyDown(event, col) {
                if (event.which === 13 && event.currentTarget.nodeName === 'TH' && utils.DomHandler.hasClass(event.currentTarget, 'p-sortable-column')) {
                    this.onColumnHeaderClick(event, col);
                }
            },
            getAriaSort(column) {
                if (this.columnProp(column, 'sortable')) {
                    const sortIcon = this.getSortableColumnIcon(column);
                    if (sortIcon[1]['pi-sort-amount-down'])
                        return 'descending';
                    else if (sortIcon[1]['pi-sort-amount-up-alt'])
                        return 'ascending';
                    else
                        return 'none';
                }
                else {
                    return null;
                }
            },
            hasColumnFilter() {
                if (this.columns) {
                    for (let col of this.columns) {
                        if (col.children && col.children.filter) {
                            return true;
                        }
                    }
                }

                return false;
            },
            hasFilters() {
                return this.filters && Object.keys(this.filters).length > 0 && this.filters.constructor === Object;
            },
            hasGlobalFilter() {
                return this.filters && Object.prototype.hasOwnProperty.call(this.filters, 'global');
            }
        },
        computed: {
            containerClass() {
                return ['p-treetable p-component', {
                    'p-treetable-hoverable-rows': (this.rowHover || this.rowSelectionMode),
                    'p-treetable-auto-layout': this.autoLayout,
                    'p-treetable-resizable': this.resizableColumns,
                    'p-treetable-resizable-fit': this.resizableColumns && this.columnResizeMode === 'fit',
                    'p-treetable-gridlines': this.showGridlines
                }];
            },
            columns() {
                let cols = [];
                let children = this.$slots.default();

                children.forEach(child => {
                    if (child.dynamicChildren)
                        cols = [...cols, ...child.children];
                    else if (child.type.name === 'column')
                        cols.push(child);
                });

                return cols;
            },
            processedData() {
                if (this.lazy) {
                    return this.value;
                }
                else {
                    if (this.value && this.value.length) {
                        let data = this.value;

                        if (this.sorted) {
                            if(this.sortMode === 'single')
                                data = this.sortSingle(data);
                            else if(this.sortMode === 'multiple')
                                data = this.sortMultiple(data);
                        }

                        if (this.hasFilters()) {
                            data = this.filter(data);
                        }

                        return data;
                    }
                    else {
                        return null;
                    }
                }
            },
            dataToRender() {
                const data = this.processedData;

                if (this.paginator) {
                    const first = this.lazy ? 0 : this.d_first;
                    return data.slice(first, first + this.d_rows);
                }
                else {
                    return data;
                }
            },
            empty() {
                const data = this.processedData;
                return (!data || data.length === 0);
            },
            sorted() {
                return this.d_sortField || (this.d_multiSortMeta && this.d_multiSortMeta.length > 0);
            },
            hasFooter() {
                let hasFooter = false;

                for (let col of this.columns) {
                    if (this.columnProp(col, 'footer')|| (col.children && col.children.footer)) {
                        hasFooter = true;
                        break;
                    }
                }

                return hasFooter;
            },
            paginatorTop() {
                return this.paginator && (this.paginatorPosition !== 'bottom' || this.paginatorPosition === 'both');
            },
            paginatorBottom() {
                return this.paginator && (this.paginatorPosition !== 'top' || this.paginatorPosition === 'both');
            },
            singleSelectionMode() {
                return this.selectionMode && this.selectionMode === 'single';
            },
            multipleSelectionMode() {
                return this.selectionMode && this.selectionMode === 'multiple';
            },
            rowSelectionMode() {
                return this.singleSelectionMode || this.multipleSelectionMode;
            },
            totalRecordsLength() {
                if (this.lazy) {
                    return this.totalRecords;
                }
                else {
                    const data = this.processedData;
                    return data ? data.length : 0;
                }
            },
            loadingIconClass() {
                return ['p-treetable-loading-icon pi-spin', this.loadingIcon];
            }
        },
        components: {
            'TTRow': script$1,
            'TTPaginator': Paginator__default['default'],
        }
    };

    const _hoisted_1 = {
      key: 0,
      class: "p-treetable-loading"
    };
    const _hoisted_2 = { class: "p-treetable-loading-overlay p-component-overlay" };
    const _hoisted_3 = {
      key: 1,
      class: "p-treetable-header"
    };
    const _hoisted_4 = { class: "p-treetable-wrapper" };
    const _hoisted_5 = { ref: "table" };
    const _hoisted_6 = { class: "p-treetable-thead" };
    const _hoisted_7 = {
      key: 2,
      class: "p-column-title"
    };
    const _hoisted_8 = {
      key: 4,
      class: "p-sortable-column-badge"
    };
    const _hoisted_9 = { key: 0 };
    const _hoisted_10 = {
      key: 0,
      class: "p-treetable-tfoot"
    };
    const _hoisted_11 = { class: "p-treetable-tbody" };
    const _hoisted_12 = {
      key: 1,
      class: "p-treetable-emptymessage"
    };
    const _hoisted_13 = {
      key: 4,
      class: "p-treetable-footer"
    };
    const _hoisted_14 = {
      ref: "resizeHelper",
      class: "p-column-resizer-helper p-highlight",
      style: {"display":"none"}
    };

    function render(_ctx, _cache, $props, $setup, $data, $options) {
      const _component_TTPaginator = vue.resolveComponent("TTPaginator");
      const _component_TTRow = vue.resolveComponent("TTRow");

      return (vue.openBlock(), vue.createBlock("div", {
        class: $options.containerClass,
        "data-scrollselectors": ".p-treetable-scrollable-body"
      }, [
        ($props.loading)
          ? (vue.openBlock(), vue.createBlock("div", _hoisted_1, [
              vue.createVNode("div", _hoisted_2, [
                vue.createVNode("i", { class: $options.loadingIconClass }, null, 2)
              ])
            ]))
          : vue.createCommentVNode("", true),
        (_ctx.$slots.header)
          ? (vue.openBlock(), vue.createBlock("div", _hoisted_3, [
              vue.renderSlot(_ctx.$slots, "header")
            ]))
          : vue.createCommentVNode("", true),
        ($options.paginatorTop)
          ? (vue.openBlock(), vue.createBlock(_component_TTPaginator, {
              key: 2,
              rows: $data.d_rows,
              first: $data.d_first,
              totalRecords: $options.totalRecordsLength,
              pageLinkSize: $props.pageLinkSize,
              template: $props.paginatorTemplate,
              rowsPerPageOptions: $props.rowsPerPageOptions,
              currentPageReportTemplate: $props.currentPageReportTemplate,
              class: "p-paginator-top",
              onPage: _cache[1] || (_cache[1] = $event => ($options.onPage($event))),
              alwaysShow: $props.alwaysShowPaginator
            }, vue.createSlots({ _: 2 }, [
              (_ctx.$slots.paginatorLeft)
                ? {
                    name: "left",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "paginatorLeft")
                    ])
                  }
                : undefined,
              (_ctx.$slots.paginatorRight)
                ? {
                    name: "right",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "paginatorRight")
                    ])
                  }
                : undefined
            ]), 1032, ["rows", "first", "totalRecords", "pageLinkSize", "template", "rowsPerPageOptions", "currentPageReportTemplate", "alwaysShow"]))
          : vue.createCommentVNode("", true),
        vue.createVNode("div", _hoisted_4, [
          vue.createVNode("table", _hoisted_5, [
            vue.createVNode("thead", _hoisted_6, [
              vue.createVNode("tr", null, [
                (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.columns, (col, i) => {
                  return (vue.openBlock(), vue.createBlock("th", {
                    key: $options.columnProp(col, 'columnKey')||$options.columnProp(col, 'field')||i,
                    style: $options.columnProp(col, 'headerStyle'),
                    class: $options.getColumnHeaderClass(col),
                    onClick: $event => ($options.onColumnHeaderClick($event, col)),
                    tabindex: $options.columnProp(col, 'sortable') ? '0' : null,
                    "aria-sort": $options.getAriaSort(col),
                    onKeydown: $event => ($options.onColumnKeyDown($event, col))
                  }, [
                    ($props.resizableColumns)
                      ? (vue.openBlock(), vue.createBlock("span", {
                          key: 0,
                          class: "p-column-resizer",
                          onMousedown: _cache[2] || (_cache[2] = (...args) => ($options.onColumnResizeStart && $options.onColumnResizeStart(...args)))
                        }, null, 32))
                      : vue.createCommentVNode("", true),
                    (col.children && col.children.header)
                      ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(col.children.header), {
                          key: 1,
                          column: col
                        }, null, 8, ["column"]))
                      : vue.createCommentVNode("", true),
                    ($options.columnProp(col, 'header'))
                      ? (vue.openBlock(), vue.createBlock("span", _hoisted_7, vue.toDisplayString($options.columnProp(col, 'header')), 1))
                      : vue.createCommentVNode("", true),
                    ($options.columnProp(col, 'sortable'))
                      ? (vue.openBlock(), vue.createBlock("span", {
                          key: 3,
                          class: $options.getSortableColumnIcon(col)
                        }, null, 2))
                      : vue.createCommentVNode("", true),
                    ($options.isMultiSorted(col))
                      ? (vue.openBlock(), vue.createBlock("span", _hoisted_8, vue.toDisplayString($options.getMultiSortMetaIndex(col) + 1), 1))
                      : vue.createCommentVNode("", true)
                  ], 46, ["onClick", "tabindex", "aria-sort", "onKeydown"]))
                }), 128))
              ]),
              ($options.hasColumnFilter())
                ? (vue.openBlock(), vue.createBlock("tr", _hoisted_9, [
                    (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.columns, (col, i) => {
                      return (vue.openBlock(), vue.createBlock("th", {
                        key: $options.columnProp(col, 'columnKey')||$options.columnProp(col, 'field')||i,
                        class: $options.getFilterColumnHeaderClass(col),
                        style: $options.columnProp(col, 'filterHeaderStyle')
                      }, [
                        (col.children && col.children.filter)
                          ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(col.children.filter), {
                              key: 0,
                              column: col
                            }, null, 8, ["column"]))
                          : vue.createCommentVNode("", true)
                      ], 6))
                    }), 128))
                  ]))
                : vue.createCommentVNode("", true)
            ]),
            ($options.hasFooter)
              ? (vue.openBlock(), vue.createBlock("tfoot", _hoisted_10, [
                  vue.createVNode("tr", null, [
                    (vue.openBlock(true), vue.createBlock(vue.Fragment, null, vue.renderList($options.columns, (col, i) => {
                      return (vue.openBlock(), vue.createBlock("td", {
                        key: $options.columnProp(col, 'columnKey')||$options.columnProp(col, 'field')||i,
                        style: $options.columnProp(col, 'footerStyle'),
                        class: $options.columnProp(col, 'footerClass')
                      }, [
                        (col.children && col.children.footer)
                          ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(col.children.footer), {
                              key: 0,
                              column: col
                            }, null, 8, ["column"]))
                          : vue.createCommentVNode("", true),
                        vue.createTextVNode(" " + vue.toDisplayString($options.columnProp(col, 'footer')), 1)
                      ], 6))
                    }), 128))
                  ])
                ]))
              : vue.createCommentVNode("", true),
            vue.createVNode("tbody", _hoisted_11, [
              (!$options.empty)
                ? (vue.openBlock(true), vue.createBlock(vue.Fragment, { key: 0 }, vue.renderList($options.dataToRender, (node) => {
                    return (vue.openBlock(), vue.createBlock(_component_TTRow, {
                      key: node.key,
                      columns: $options.columns,
                      node: node,
                      level: 0,
                      expandedKeys: $data.d_expandedKeys,
                      onNodeToggle: $options.onNodeToggle,
                      indentation: $props.indentation,
                      selectionMode: $props.selectionMode,
                      selectionKeys: $props.selectionKeys,
                      onNodeClick: $options.onNodeClick,
                      onCheckboxChange: $options.onCheckboxChange
                    }, null, 8, ["columns", "node", "expandedKeys", "onNodeToggle", "indentation", "selectionMode", "selectionKeys", "onNodeClick", "onCheckboxChange"]))
                  }), 128))
                : (vue.openBlock(), vue.createBlock("tr", _hoisted_12, [
                    vue.createVNode("td", {
                      colspan: $options.columns.length
                    }, [
                      vue.renderSlot(_ctx.$slots, "empty")
                    ], 8, ["colspan"])
                  ]))
            ])
          ], 512)
        ]),
        ($options.paginatorBottom)
          ? (vue.openBlock(), vue.createBlock(_component_TTPaginator, {
              key: 3,
              rows: $data.d_rows,
              first: $data.d_first,
              totalRecords: $options.totalRecordsLength,
              pageLinkSize: $props.pageLinkSize,
              template: $props.paginatorTemplate,
              rowsPerPageOptions: $props.rowsPerPageOptions,
              currentPageReportTemplate: $props.currentPageReportTemplate,
              class: "p-paginator-bottom",
              onPage: _cache[3] || (_cache[3] = $event => ($options.onPage($event))),
              alwaysShow: $props.alwaysShowPaginator
            }, vue.createSlots({ _: 2 }, [
              (_ctx.$slots.paginatorLeft)
                ? {
                    name: "left",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "paginatorLeft")
                    ])
                  }
                : undefined,
              (_ctx.$slots.paginatorRight)
                ? {
                    name: "right",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "paginatorRight")
                    ])
                  }
                : undefined
            ]), 1032, ["rows", "first", "totalRecords", "pageLinkSize", "template", "rowsPerPageOptions", "currentPageReportTemplate", "alwaysShow"]))
          : vue.createCommentVNode("", true),
        (_ctx.$slots.footer)
          ? (vue.openBlock(), vue.createBlock("div", _hoisted_13, [
              vue.renderSlot(_ctx.$slots, "footer")
            ]))
          : vue.createCommentVNode("", true),
        vue.createVNode("div", _hoisted_14, null, 512)
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

    var css_248z = "\n.p-treetable {\n    position: relative;\n}\n.p-treetable table {\n    border-collapse: collapse;\n    width: 100%;\n    table-layout: fixed;\n}\n.p-treetable .p-sortable-column {\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n}\n.p-treetable-auto-layout > .p-treetable-wrapper {\n    overflow-x: auto;\n}\n.p-treetable-auto-layout > .p-treetable-wrapper > table {\n    table-layout: auto;\n}\n.p-treetable-hoverable-rows .p-treetable-tbody > tr {\n    cursor: pointer;\n}\n.p-treetable-toggler {\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    display: -webkit-inline-box;\n    display: -ms-inline-flexbox;\n    display: inline-flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    vertical-align: middle;\n    overflow: hidden;\n    position: relative;\n}\n.p-treetable-toggler + .p-checkbox {\n    vertical-align: middle;\n}\n.p-treetable-toggler + .p-checkbox + span {\n    vertical-align: middle;\n}\n\n/* Resizable */\n.p-treetable-resizable > .p-treetable-wrapper {\n    overflow-x: auto;\n}\n.p-treetable-resizable .p-treetable-thead > tr > th,\n.p-treetable-resizable .p-treetable-tfoot > tr > td,\n.p-treetable-resizable .p-treetable-tbody > tr > td {\n    overflow: hidden;\n}\n.p-treetable-resizable .p-resizable-column {\n    background-clip: padding-box;\n    position: relative;\n}\n.p-treetable-resizable-fit .p-resizable-column:last-child .p-column-resizer {\n    display: none;\n}\n.p-treetable .p-column-resizer {\n    display: block;\n    position: absolute !important;\n    top: 0;\n    right: 0;\n    margin: 0;\n    width: .5rem;\n    height: 100%;\n    padding: 0px;\n    cursor:col-resize;\n    border: 1px solid transparent;\n}\n.p-treetable .p-column-resizer-helper {\n    width: 1px;\n    position: absolute;\n    z-index: 10;\n    display: none;\n}\n.p-treetable .p-treetable-loading-overlay {\n    position: absolute;\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-align: center;\n        -ms-flex-align: center;\n            align-items: center;\n    -webkit-box-pack: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    z-index: 2;\n}\n";
    styleInject(css_248z);

    script.render = render;

    return script;

}(primevue.utils, primevue.api, primevue.ripple, Vue, primevue.paginator));
