Ext.define('RM.controller.SupplierBillsC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.SupplierBills', 'RM.component.BillsList'],
    config: {
        refs: {
            SupplierBills: 'supplierbills',
            billsTitle: 'supplierbills #title',
            sortSearchBar: 'supplierbills sortsearchbar'
        },
        control: {
            'supplierbills #back': {
                tap: 'back'
            },
            'supplierbills': {
                show: 'onShow'
            },
            'supplierbills sortsearchbar': {
                sort: 'onSort',
                search: 'onSearch',
                searchclear: 'onSearchClear'
            },
            'supplierbills #add': {
                tap: 'add'
            }
        }

    },

    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);
    },

    showView: function (billsTitle, supplierId, supplierName, sortVal) {
        this.billsTitle = billsTitle;
        this.supplierId = supplierId;
        this.supplierName = supplierName;

        var view = this.getSupplierBills();
        if (!view) {
            view = { xtype: 'supplierbills' };
        }

        RM.ViewMgr.showPanel(view);
        this.getSortSearchBar().setSearch(sortVal);
    },

    onShow: function () {
        //This next inline style should be moved to the sass
        this.getBillsTitle().setTitle('<span style="text-shadow:none; font-weight:normal;">' + this.billsTitle + '</span>');
    },

    onItemUpdated: function (itemType) {
        if (itemType == 'bill' && this.getSupplierBills()) {
            this.activeList.reload();
        }
    },

    onSort: function (sortVal) {
        var view = this.getSupplierBills();
        view.removeAt(2);
        this.activeList = view.add({ xtype: 'billslist', sortVal: sortVal, isShowSupplier: false, supplierId: this.supplierId });
    },

    onSearch: function (val) {
        this.activeList.setSearch(val);
    },

    onSearchClear: function () {
        this.activeList.clearSearch();
    },

    add: function () {
        var data = this.supplierId ? { SupplierId: this.supplierId, SupplierName: this.supplierName } : null;
        RM.BillsMgr.showBillDetail(true, data,
			function (closeType, data) {
			    return null;
			},
			this
		);
    },

    back: function () {
        RM.ViewMgr.back();
    }
});