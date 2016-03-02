Ext.define('RM.controller.BillsC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            bills: 'bills',
            billsList: 'bills list'
        },
        control: {
            'bills': {
                show: 'onShow'
            },            
			'bills sortsearchbar': {
				sort: 'onSort',				
				search: function(val){
					var store = this.getBillsList().getStore();
					store.clearFilter();
                    store.filter('search', val);
                    this.setLoadTimer();
				},				
				searchclear: function(){
                    this.getBillsList().getStore().clearFilter();
                    this.loadList();
				}
			},
            'bills #back': {
                tap: 'back'
            }
        }

    },
	
	showView: function(){

		var view = this.getBills();
		if(!view){
			view = {xtype:'bills'};
        }
		RM.ViewMgr.showPanel(view);		
		
	},	

    onShow: function(){
		this.getBillsList().getStore().getProxy().setUrl(RM.AppMgr.getApiUrl('Bills'));
		this.loadList();
    },
    
	onSort: function(sortVal){
		
 
        var billsList = this.getBillsList(),store = billsList.getStore();
        
        if(sortVal == 'duedate'){
            store.setGroupField('DuePeriodName');
            billsList.setGrouped(true);            
        }
        else if(sortVal == 'supplier'){
            store.setGroupField('SupplierName');
            billsList.setGrouped(true);
        }
        else{
            store.setGroupField(sortVal);
            billsList.setGrouped(false); 
        }

        
        this.loadList();
        
	},
	
	back: function(){
		RM.ViewMgr.back();
	},
	
    loadList: function () {
        RM.AppMgr.loadStore(this.getBillsList().getStore());
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    }


});