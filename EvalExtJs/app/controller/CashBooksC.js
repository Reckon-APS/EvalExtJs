Ext.define('RM.controller.CashBooksC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            cashBooks: 'cashbooks',
            cashBooksList: 'cashbooks list',
            sortSearchBar: 'cashbooks sortsearchbar'
        },
        control: {
            'cashbooks sortsearchbar': {
                sort: 'onSort',

                search: function (val) {
                    this.setLoadTimer(val);
                },

                searchclear: function () {                   
                    this.loadList();
                }
            },
            'cashbooks list': {
                itemtap: 'onItemTap'
            }
        }

    },

    showView: function (cb, cbs) {
        this.selectCb = cb;
        this.selectCbs = cbs;
        var view = this.getCashBooks();
        if (!view){
            view = { xtype: 'cashbooks' };
        }
        else{
            this.getSortSearchBar().hideSearch(true);
            this.getCashBooksList().getStore().clearFilter();
        }
        
        //RM.ViewMgr.clearBackStack(); //don't clear it as may have come from select cashbook in slide nav
        RM.ViewMgr.showPanel(view);

        var store = this.getCashBooksList().getStore();
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('CashBooks'));
        this.loadList();

    },

    onSort: function (val) {
        this.getCashBooksList().getStore().sort(val);
        this.loadList();
    },

    onItemTap: function (list, index, target, rec) {
        setTimeout(function () { list.deselect(rec); }, 500);
        this.selectCb.call(this.selectCbs, rec.data);
    },

    loadList: function (searchFilter) {
        var store = this.getCashBooksList().getStore();
        store.clearFilter();
        if(searchFilter){
            store.filter('search', searchFilter);
        }
        
        RM.AppMgr.loadStore(
            store,
            function(recs){
                if(!searchFilter && recs.length == 0){
                    RM.AppMgr.showOkMsgBox('You do not have any books to select.', RM.AppMgr.lock, RM.AppMgr);
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