Ext.define('RM.controller.BudgetLineItemsC', {
    extend: 'Ext.app.Controller',
	requires: ['RM.view.budgets.LineItems'],
    config: {
        refs: {
            budgetLineItems: 'budgetlineitems',
			budgetTitle: 'budgetlineitems #title',
            budgetLineItemsList: 'budgetlineitems list',
            zeroLineItemsCheckBox: 'budgetlineitems rmcheckbox'
        },
        control: {
            'budgetlineitems': {
                show: 'onShow'
            },            
            'budgetlineitems #back': {
                tap: 'back'
            },
            'budgetlineitems rmcheckbox': {
                check: 'onZeroItemsCheck'
            }
        }

    },

	showView: function(budgetId, budgetName){
        this.budgetId = budgetId;
        this.budgetName = budgetName;
        
		var view = this.getBudgetLineItems();
		if(!view){
			view = {xtype:'budgetlineitems'};
        }
		RM.ViewMgr.showPanel(view);
	},
    
    onShow: function(){
        this.hideZeroLineItems = this.hideZeroLineItems || false;
		this.getBudgetTitle().setHtml(this.budgetName); 
        this.getZeroLineItemsCheckBox().setValue(this.hideZeroLineItems);
				
		var store = this.getBudgetLineItemsList().getStore();
		store.getProxy().setUrl(RM.AppMgr.getApiUrl('BudgetLineItems'));
		store.filter('BudgetId', this.budgetId);
		this.loadList();
    },
    
    onZeroItemsCheck: function(checked){
        this.hideZeroLineItems = checked;
        this.loadList();
    },
    
    loadList: function () {
        var store = this.getBudgetLineItemsList().getStore();
        store.removeAll();
        store.filter('IncludeZeroItems', !this.hideZeroLineItems);        
        
        RM.AppMgr.loadStore(store);
    },    
	
	back: function(){
		RM.ViewMgr.back();
	}


});