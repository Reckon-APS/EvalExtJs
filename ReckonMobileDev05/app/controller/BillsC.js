Ext.define('RM.controller.BillsC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.component.SupplierBillSummaryList', 'RM.component.BillsList'],
    config: {
        refs: {
            bills: 'bills',
            sortSearchBar: 'bills sortsearchbar'
        },
        control: {
            'bills': {
                show: 'onShow'
            },
            'bills sortsearchbar': {
                sort: 'onSort',
                search: 'onSearch',
                searchclear: 'onSearchClear'
            },
            'bills list': {
                select: 'onItemSelect'
            },
            'bills #add': {
                tap: 'add'
            }
        }

    },

    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);
        this.getApplication().addListener('rm-activeviewchanged', 'onActiveViewChanged', this);
    },

    showView: function () {

        var view = this.getBills();
        if (!view) {
            view = { xtype: 'bills' };
        }
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        if (!this.dataLoaded) {
            this.onSort('duedate');
            this.dataLoaded = true;
        }
        else {
            //this.activeList.reload();
            this.reloadOnNextActivation = true;
        }
    },

    onItemUpdated: function (itemType) {
        if (itemType == 'bill' && this.dataLoaded) {
            RM.Log.debug('bills list reload scheduled');
            this.reloadOnNextActivation = true;
        }
    },

    onActiveViewChanged: function (newView) {
        if (!this.reloadOnNextActivation) return;

        if (newView.xtype === this.getBills().xtype) {
            this.reloadOnNextActivation = false;
            this.clearSearchLoadList();
            RM.Log.debug('bills list reloaded');
        }
    },

    onSort: function (sortVal) {

        var view = this.getBills();
        view.removeAt(2);
        if (sortVal == 'supplier') {
            this.activeList = view.add({ xtype: 'supplierbillsummarylist' });
        }
        else if (sortVal == 'amount') {
            this.activeList = view.add({ xtype: 'billslist', sortVal: '', isShowSupplier: false });  //to get default sorting from server 
        }
        else {
            this.activeList = view.add({ xtype: 'billslist', sortVal: sortVal, isShowSupplier: false });
        }

    },

    onSearch: function (val) {
        this.activeList.setSearch(val);
    },

    onSearchClear: function () {
        this.activeList.clearSearch();
    },

    clearSearchLoadList: function () {
        this.getSortSearchBar().hideSearch(true);
        this.activeList.clearSearch();
    },

    add: function () {
        RM.BillsMgr.showBillDetail(true, null,
			function (closeType, data) {
			    return null;
			},
			this
		);
    }

});