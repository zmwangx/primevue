'use strict';

var script = {
    name: 'column',
    props: {
        columnKey: {
            type: null,
            default: null
        },
        field: {
            type: String,
            default: null
        },
        sortField: {
            type: [String, Function],
            default: null
        },
        filterField: {
            type: String,
            default: null
        },
        dataType: {
            type: String,
            default: 'text'
        },
        sortable: {
            type: Boolean,
            default: false
        },
        header: {
            type: null,
            default: null
        },
        footer: {
            type: null,
            default: null
        },
        style: {
            type: null,
            default: null
        },
        class: {
            type: String,
            default: null
        },
        headerStyle: {
            type: null,
            default: null
        },
        headerClass: {
            type: String,
            default: null
        },
        bodyStyle: {
            type: null,
            default: null
        },
        bodyClass: {
            type: String,
            default: null
        },
        footerStyle: {
            type: null,
            default: null
        },
        footerClass: {
            type: String,
            default: null
        },
        showFilterMenu: {
            type: Boolean,
            default: true
        },
        showFilterOperator: {
            type: Boolean,
            default: true
        },
        showClearButton: {
            type: Boolean,
            default: true
        },
        showApplyButton: {
            type: Boolean,
            default: true
        },
        showFilterMatchModes: {
            type: Boolean,
            default: true
        },
        showAddButton: {
            type: Boolean,
            default: true
        },
        filterMatchModeOptions: {
            type: Array,
            default: null
        },
        maxConstraints: {
            type: Number,
            default: 2
        },
        excludeGlobalFilter: {
            type: Boolean,
            default: false
        },
        filterHeaderClass: {
            type: String,
            default: null
        },
        filterHeaderStyle: {
            type: null,
            default: null
        },
        filterMenuClass: {
            type: String,
            default: null
        },
        filterMenuStyle: {
            type: null,
            default: null
        },
        selectionMode: {
            type: String,
            default: null
        },
        expander: {
            type: Boolean,
            default: false
        },
        colspan: {
            type: Number,
            default: null
        },
        rowspan: {
            type: Number,
            default: null
        },
        rowReorder: {
            type: Boolean,
            default: false
        },
        rowReorderIcon: {
            type: String,
            default: 'pi pi-bars'
        },
        reorderableColumn: {
            type: Boolean,
            default: true
        },
        rowEditor: {
            type: Boolean,
            default: false
        },
        frozen: {
            type: Boolean,
            default: false
        },
        alignFrozen: {
            type: String,
            default: 'left'
        },
        exportable: {
            type: Boolean,
            default: true
        },
        filterMatchMode: {
            type: String,
            default: null
        }
    },
    render() {
        return null;
    }
};

module.exports = script;
