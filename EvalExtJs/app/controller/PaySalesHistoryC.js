Ext.define('RM.controller.PaySalesHistoryC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            paySalesHistory: 'paysaleshistory',
            paySalesHistoryList: 'paysaleshistory list',
            sortSearchBar: 'paysaleshistory sortsearchbar'
        },
        control: {
            'paysaleshistory': {
                show: 'onShow'
            },
            'paysaleshistory sortsearchbar': {
                sort: 'onSort',

                search: function (val) {
                    this.setLoadTimer(val);
                },

                searchclear: function () {                   
                    this.loadList();
                }
            },
            'paysaleshistory list': {
                //itemtap: 'onItemTap',
                select: 'onItemSelect'		
            }
        }

    },

    onShow: function () {
        var store = this.getPaySalesHistoryList().getStore();
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('PayTransaction'));
        
        this.onSort('TransactionDate');
    },
    
    /*showView: function (cb, cbs) {
        this.selectCb = cb;
        this.selectCbs = cbs;
        
        var view = this.getPaySalesHistory();
        if (!view){
            view = { xtype: 'paysaleshistory' };
        }
        else{
            this.getSortSearchBar().hideSearch(true);
            this.getPaySalesHistoryList().getStore().clearFilter();
        }
        
        var store = this.getPaySalesHistoryList().getStore();
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('PayTransaction'));
        this.loadList();
    },*/

    onSort: function (val) {
        this.getPaySalesHistoryList().getStore().sort(val);
        this.loadList();
    },

    /*onItemTap: function (list, index, target, rec) {
        setTimeout(function () { list.deselect(rec); }, 500);
        this.selectCb.call(this.selectCbs, rec.data);
    },*/

    onItemSelect: function(list, rec){
		// Delay the selection clear so get a flash of the selection
		setTimeout(function(){list.deselect(rec);},500);
        
		RM.PayMgr.getTransaction(rec.data.Id,
			function(){
				var payTransDetailsC = RM.AppMgr.getAppControllerInstance('RM.controller.PayTransDetailsC');
        		payTransDetailsC.showView(rec.data, null, this);                
			}, 
			this
		);
    },
    
    loadList: function (searchFilter) {
        var store = this.getPaySalesHistoryList().getStore();
        store.clearFilter();
        if(searchFilter){
            store.filter('search', searchFilter);
        }
        
        RM.AppMgr.loadStore(
            store,
            function(recs){
                if(!searchFilter && recs.length == 0){
                    RM.AppMgr.showOkMsgBox('You do not have any transactions to select.', RM.AppMgr.lock, RM.AppMgr);
                }
            },
            this
        );
    },

    setLoadTimer: function (searchFilter) {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this, [searchFilter]);
    }

});