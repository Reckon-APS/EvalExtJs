Ext.define('RM.controller.AccountsC', {
    extend: 'Ext.app.Controller',
    requires: 'RM.view.Accounts',
    config: {
        refs: {
            accounts: 'accounts',
            accountsList: 'accounts list'
        },
        control: {
            'accounts #back': {
                tap: 'back'
            },
            'accounts sortsearchbar': {
                search: function (val) {
                    this.nameFilter = val;
                    this.setLoadTimer();
                },

                searchclear: function () {
                    delete this.nameFilter;
                    this.loadList();
                }
            },						
            'accounts list': {
                select: 'onItemSelect'
            }
        }

    },
    
    showView: function (selectDetails, cb, cbs) {           
        this.selectDetails = selectDetails;
        this.selectCb = cb;
        this.selectCbs = cbs;        
        var view = { xtype: 'accounts', selectDetails: selectDetails}; //create a new view each time as we want selectDetails to be effective
        RM.ViewMgr.showPanel(view); 
        if(this.nameFilter) delete this.nameFilter;
        this.loadList();        
    },

    onItemSelect: function (list, rec) {
        setTimeout(function () { list.deselect(rec); }, 500);
        var item = rec.data;
        if(this.selectDetails){
    		RM.Selectors.showItemDetail(this.showItemTax, item,
    			function(closeType, data){
    				this.selectCb.call(this.selectCbs, [data]);                    
    				RM.ViewMgr.back({ type: 'slide', direction: 'left' });
    			},
    			this
    		);
       }
       else{
			this.selectCb.call(this.selectCbs, [item]);
			RM.ViewMgr.back({ type: 'slide', direction: 'left' });
       }    
    },
    
    back: function () {
        RM.ViewMgr.back();
    },

    loadList: function () {
        var store = this.getAccountsList().getStore();
        store.clearFilter();
        if (this.nameFilter){
            store.filter('Name', this.nameFilter);
        }
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    }
});