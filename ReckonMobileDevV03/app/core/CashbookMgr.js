Ext.define('RM.core.CashbookMgr', {
    alternateClassName: 'RM.CashbookMgr',
    singleton: true,
    requires: ['RM.core.PermissionsMgr', 'RM.core.EventMgr', 'RM.core.ViewMgr', 'RM.core.Selectors'],    
    
    config: {
        cashbookId: null,
        currentCashbook: null
    },
    
    getTaxPreferences: function() {
        return this.getCurrentCashbook().TaxPreference;
    },
    
    getSalesPreferences: function() {
        return this.getCurrentCashbook().SalesPreferences;
    },
    
    hasLockOffDate: function() {
        return this.getCurrentCashbook().LockoffDate !== null;
    },
    
    getLockOffDate: function() {
        return new Date(this.getCurrentCashbook().LockoffDate);
    },
    
    loadLastCashbook: function(callback) {
        if(this.getCashbookId()){
            this.setCashbook(this.getCashbookId());
            if (callback) { callback(); }            
        }
    },
    
    unloadCashbook: function(){
        this.cashbookId = null;
    },
        
    selectCashBook: function() {

        RM.Selectors.showCashBooks(
			function (data) {
                this.setCashbookId(data.CashBookId);			    
                RM.EventMgr.logEvent(RM.Consts.Events.OP, 2, 'cm.sc.1', 'CashBook=' + data.CashBookId);
                this.setCashbook(data.CashBookId,
                    function(){
                        RM.ViewMgr.showMainNavContainer(localStorage.getItem('RmDisplayName'), data.BookName);
                        var dashboardC = RM.AppMgr.getAppControllerInstance('RM.controller.DashboardC');
                        dashboardC.showView(this._currentCashbook.Dashboard);
        	            RM.ViewMgr.showDashboard();                        
                    },
                    this
                );
			},
			this
		);
        
    },    
    
    setCashbook: function(cashbookId, cb, cbs){
	    RM.AppMgr.saveServerRec('CashBookSelect', false, { CashBookId: cashbookId },
	        function (recs) {
                this.setCashbookId(cashbookId);  
                this.setCurrentCashbook(recs[0]);
                
	            Ext.data.StoreManager.lookup('GSTCodes').setData(recs[0].GSTCodes);
                Ext.data.StoreManager.lookup('AccountingCategories').setData(recs[0].AccountingCategories);
                
                Ext.data.StoreManager.lookup('TaxStatuses').setData(recs[0].AmountTaxStatuses);
                Ext.data.StoreManager.lookup('ItemTypes').setData(recs[0].ItemTypes);
                
                RM.PermissionsMgr.setPermissions(this.getCurrentCashbook().Permissions, this.getCurrentCashbook().Access);
                              
                if(cb){
                    cb.call(cbs);
                }
	        },
            this,
            null,
            'Loading book...'
	    );        
    }
});