Ext.define('RM.controller.SuppliersC', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            suppliers: 'suppliers',
            suppliersList: 'suppliers list'
        },
        control: {
			'suppliers #back': {
				tap: 'back'			
			},			
			'suppliers sortsearchbar': {
				sort: 'onSort',				
				search: function(val){
					var store = this.getSuppliersList().getStore();
					store.clearFilter();
                    store.filter('Name', val);
                    this.setLoadTimer();
				},				
				searchclear: function(){
                    this.getSuppliersList().getStore().clearFilter();
                    this.loadList();
				}
			},				
			'suppliers list': {
				select: 'onItemSelect'			
			},				
            'suppliers #refresh': {
                tap: function (textField) {
                    this.loadList();
                }
            }
        }
    },
	
	showView: function(cb, cbs){
		this.selectCb = cb;
		this.selectCbs = cbs;
		var view = this.getSuppliers();
		if(!view){
			view = {xtype:'suppliers'};
        }            
		RM.ViewMgr.showPanel(view);
		
		this.getSuppliersList().getStore().getProxy().setUrl(RM.AppMgr.getApiUrl('Suppliers'));
		this.loadList();	        
	},	
	
	onItemSelect: function(list, rec){		
		setTimeout(function(){list.deselect(rec);},500);
		this.selectCb.call(this.selectCbs, rec.data);
		RM.ViewMgr.back({ type: 'slide', direction: 'left'});
	},		

	back: function(){
		RM.ViewMgr.back();
	},	
	
    loadList: function(){
        var store = this.getSuppliersList().getStore();
        
        if(store.isLoaded()){ //if store is not already loaded it seems to show its own loading mask
            RM.ViewMgr.showLoadingMask();
        }

        store.loadPage(1, {
            callback: function (records, operation, success) {
                RM.ViewMgr.hideLoadingMask();
            },
            scope: this
        });
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    }

});