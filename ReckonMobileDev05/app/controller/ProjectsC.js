Ext.define('RM.controller.ProjectsC', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            projects: 'projects',
            projectsList: 'projects list'
        },
        control: {
			'projects sortsearchbar': {
				sort: 'onSort',				
				search: function(val){
                    this.nameFilter = val;
                    this.setLoadTimer();
				},				
				searchclear: function(){
                    delete this.nameFilter;
                    this.loadList();
				}
			},				
			'projects list': {
				select: 'onItemSelect'			
			},			
            'projects #refresh': {
                tap: function (textField) {
                    this.loadList();
                }
            },
            'projects #back': {
                tap: 'back'
            }			
        }

    },
	
	showView: function(customerId, supplierId, cb, cbs){
		this.customerIdFilter = customerId;
        this.supplierIdFilter = supplierId;
        this.selectCb = cb;
		this.selectCbs = cbs;
        
		var view = this.getProjects();
		if(!view){
			view = {xtype:'projects'};
        }            
		RM.ViewMgr.showPanel(view);
		
		this.getProjectsList().getStore().getProxy().setUrl(RM.AppMgr.getApiUrl('Projects'));
		this.loadList();	        
		
	},
	
	onItemSelect: function(list, rec){		
		setTimeout(function(){list.deselect(rec);},500);
		this.selectCb.call(this.selectCbs, rec.data);
		RM.ViewMgr.back({ type: 'slide', direction: 'left'});
	},	
	
	onSort: function(val){
		alert(val);
	},	

    loadList: function(){
        var store = this.getProjectsList().getStore();
        store.clearFilter();
        if (RM.AppMgr.isValidGuid(this.customerIdFilter)) {
            store.filter('customerid', this.customerIdFilter);
        }
        if (this.supplierIdFilter){
            store.filter('supplierid', this.supplierIdFilter);
        }        
        if (this.nameFilter){
            store.filter('name', this.nameFilter);
        }        
        RM.AppMgr.loadStore(store);        
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    },
	
	back: function(){
		//this.detailsCb.call(this.detailsCbs, 'back');
		RM.ViewMgr.back();		
	}	

});