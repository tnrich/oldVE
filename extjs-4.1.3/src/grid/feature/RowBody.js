/**
 * The rowbody feature enhances the grid's markup to have an additional
 * tr -> td -> div which spans the entire width of the original row.
 *
 * This is useful to to associate additional information with a particular
 * record in a grid.
 *
 * Rowbodies are initially hidden unless you override getAdditionalData.
 *
 * Will expose additional events on the gridview with the prefix of 'rowbody'.
 * For example: 'rowbodyclick', 'rowbodydblclick', 'rowbodycontextmenu'.
 *
 * # Example
 *
 *     @example
 *     Ext.define('Animal', {
 *         extend: 'Ext.data.Model',
 *         fields: ['name', 'latin', 'desc']
 *     });
 * 
 *     Ext.create('Ext.grid.Panel', {
 *         width: 400,
 *         height: 300,
 *         renderTo: Ext.getBody(),
 *         store: {
 *             model: 'Animal',
 *             data: [
 *                 {name: 'Tiger', latin: 'Panthera tigris',
 *                  desc: 'The largest cat species, weighing up to 306 kg (670 lb).'},
 *                 {name: 'Roman snail', latin: 'Helix pomatia',
 *                  desc: 'A species of large, edible, air-breathing land snail.'},
 *                 {name: 'Yellow-winged darter', latin: 'Sympetrum flaveolum',
 *                  desc: 'A dragonfly found in Europe and mid and Northern China.'},
 *                 {name: 'Superb Fairy-wren', latin: 'Malurus cyaneus',
 *                  desc: 'Common and familiar across south-eastern Australia.'}
 *             ]
 *         },
 *         columns: [{
 *             dataIndex: 'name',
 *             text: 'Common name',
 *             width: 125
 *         }, {
 *             dataIndex: 'latin',
 *             text: 'Scientific name',
 *             flex: 1
 *         }],
 *         features: [{
 *             ftype: 'rowbody',
 *             getAdditionalData: function(data, rowIndex, record, orig) {
 *                 var headerCt = this.view.headerCt,
 *                     colspan = headerCt.getColumnCount();
 *                 // Usually you would style the my-body-class in CSS file
 *                 return {
 *                     rowBody: '<div style="padding: 1em">'+record.get("desc")+'</div>',
 *                     rowBodyCls: "my-body-class",
 *                     rowBodyColspan: colspan
 *                 };
 *             }
 *         }]
 *     });
 */
Ext.define('Ext.grid.feature.RowBody', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.rowbody',
    rowBodyHiddenCls: Ext.baseCSSPrefix + 'grid-row-body-hidden',
    rowBodyTrCls: Ext.baseCSSPrefix + 'grid-rowbody-tr',
    rowBodyTdCls: Ext.baseCSSPrefix + 'grid-cell-rowbody',
    rowBodyDivCls: Ext.baseCSSPrefix + 'grid-rowbody',

    eventPrefix: 'rowbody',
    eventSelector: '.' + Ext.baseCSSPrefix + 'grid-rowbody-tr',

    init: function() {
        var me = this,
            selModel = me.view.getSelectionModel();

        me.grid.mon(me.view, {
            element: 'el',
            mousedown: me.onMouseDown,
            scope: me
        });

        if (!selModel.isCellModel) {
            me.grid.mon(selModel, {
                select: me.onSelect,
                deselect: me.onDeselect,
                scope: me
            });
        }
        me.callParent(arguments);
    },

    onMouseDown: function(e) {
        var me = this,
            tableRow = e.getTarget('tr.' + me.rowBodyTrCls);

        // If we have mousedowned on a row body TR and its previous sibling is a grid row, pass that onto the view for processing
        if (tableRow && Ext.fly(tableRow = tableRow.previousSibling).is(me.view.rowSelector)) {
            e.target = tableRow;
            me.view.handleEvent(e);
        }
    },

    onSelect: function(selModel, record, rowIndex) {
        var me = this,
            view = me.view,
            selectedRow = view.getNode(rowIndex);

        // If the selected row is followed by a row body row, add the selected class to that
        if (selectedRow) {
            selectedRow = Ext.fly(selectedRow.nextSibling);
            if (selectedRow && selectedRow.is(me.rowBodySelector)) {
                selectedRow.addCls(view.selectedItemCls);
            }
        }
    },

    onDeselect: function(selModel, record, rowIndex) {
        var me = this,
            view = me.view,
            selectedRow = view.getNode(rowIndex);

        // If the selected row is followed by a row body row, remove the selected class from that
        if (selectedRow) {
            selectedRow = Ext.fly(selectedRow.nextSibling);
            if (selectedRow && selectedRow.is(me.rowBodySelector)) {
                selectedRow.removeCls(view.selectedItemCls);
            }
        }
    },

    getRowBody: function(values) {
        return [
            '<tr class="' + this.rowBodyTrCls + ' {rowBodyCls}">',
                '<td class="' + this.rowBodyTdCls + '" colspan="{rowBodyColspan}">',
                    '<div class="' + this.rowBodyDivCls + '">{rowBody}</div>',
                '</td>',
            '</tr>'
        ].join('');
    },
    
    // injects getRowBody into the metaRowTpl.
    getMetaRowTplFragments: function() {
        return {
            getRowBody: this.getRowBody,
            rowBodyTrCls: this.rowBodyTrCls,
            rowBodyTdCls: this.rowBodyTdCls,
            rowBodyDivCls: this.rowBodyDivCls
        };
    },

    mutateMetaRowTpl: function(metaRowTpl) {
        metaRowTpl.push('{[this.getRowBody(values)]}');
    },

    /**
     * Provides additional data to the prepareData call within the grid view.
     * The rowbody feature adds 3 additional variables into the grid view's template.
     * These are rowBodyCls, rowBodyColspan, and rowBody.
     * @param {Object} data The data for this particular record.
     * @param {Number} idx The row index for this record.
     * @param {Ext.data.Model} record The record instance
     * @param {Object} orig The original result from the prepareData call to massage.
     */
    getAdditionalData: function(data, idx, record, orig) {
        var headerCt = this.view.headerCt,
            colspan  = headerCt.getColumnCount();

        return {
            rowBody: "",
            rowBodyCls: this.rowBodyCls,
            rowBodyColspan: colspan
        };
    }
}, function() {
    this.prototype.rowBodySelector = 'tr.' + this.prototype.rowBodyTrCls
});