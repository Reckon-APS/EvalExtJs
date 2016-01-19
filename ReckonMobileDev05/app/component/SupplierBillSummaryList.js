Ext.define('RM.component.SupplierBillSummaryList', {
    extend: 'Ext.Panel',
    requires: 'RM.component.RMList',
    xtype: 'supplierbillsummarylist',
    config: {
        layout: 'fit',
        control: {
            'list': {
                select: 'onItemSelect'
            }
        }
    },

    initialize: function () {
        this.callParent(arguments);
        this.add({
            xtype: 'rmlist',
            store: 'SupplierBills',
            loadingText: null,
            emptyText: 'No bills found.',
            grouped: true,
            itemTpl: '<div class="rm-nextgrayarrow rm-ml5 rm-mr5">{SupplierName}' + '<span class="rm-customerinvoices-invoicecount">' + ' ({BillCount}) ' + '</span>' +
                            '<tpl if=" 0< BillOverdueCount">' +
                            "<span class='rm-reddot'></span>" +
                            '</tpl>' +
                     '</div>'
        }
        );

        var store = Ext.data.StoreManager.lookup('SupplierBills');
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('SupplierBills'));

        RM.AppMgr.loadStore(store);

    },

    onItemSelect: function (list, rec) {
        // Delay the selection clear so get a flash of the selection
        setTimeout(function () { list.deselect(rec); }, 500);
        RM.BillsMgr.showSupplierBills(rec.data.SupplierName, rec.data.SupplierId, rec.data.SupplierName, 'duedate');
    },

    reload: function () {
        this.loadList();
    },

    setSearch: function (val) {
        this.search = val;
        this.setLoadTimer();
    },

    clearSearch: function () {
        delete this.search;
        this.loadList();
    },


    loadList: function () {
        var store = Ext.data.StoreManager.lookup('SupplierBills');
        store.clearFilter();

        if (this.search) {
            store.filter('search', this.search);
        }

        RM.AppMgr.loadStore(store);
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    }


});