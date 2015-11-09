Ext.define('RM.controller.CustomersC', {
    extend: 'Ext.app.Controller',

	requires: ['RM.view.Customers'],
    config: {
        refs: {
            customers: 'customers',
            customersList: 'customers list',
            createCustomer: 'customers #createCustomer'
        },
        control: {
            'customers': {
              show: 'onShow'
            },
			'customers sortsearchbar': {
				sort: 'onSort',				
				search: function(val){
                    this.searchFilter = val;
                    this.setLoadTimer();
				},				
				searchclear: function(){
                    delete this.searchFilter;
                    this.loadList();
				}
			},				
			'customers list': {
				select: 'onItemSelect'			
			},
            'customers #createCustomer':{
                tap: 'onCreateCustomer'
            },			
            'customers #back': {
                tap: 'back'
            }			
        }
    },
	
    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);
    },
    
	showView: function(projectId, cb, cbs, filterBy){
        this.projectIdFilter = projectId;
        this.filterBy = filterBy;

		this.selectCb = cb;
		this.selectCbs = cbs;
		var view = this.getCustomers();
		if(!view){
			view = {xtype:'customers'};
        }
        
        delete this.searchFilter;
		RM.ViewMgr.showPanel(view);
		
	},
    
    onShow: function(){
        this.getCreateCustomer().setHidden(!RM.PermissionsMgr.canAddEdit('Contacts'));
        //delete this.searchFilter;
        this.getCustomersList().getStore().getProxy().setUrl(RM.AppMgr.getApiUrl('Contacts'));
        this.loadList();
    },
	
	onItemSelect: function(list, rec){		
		setTimeout(function(){list.deselect(rec);},500);
		this.selectCb.call(this.selectCbs, rec.data);
		RM.ViewMgr.back({ type: 'slide', direction: 'left'});
	},	

    onCreateCustomer: function(){
        RM.InvoicesMgr.showContactDetail(
            true,
            null,
            function (val) {
                var data = val[0];
                if (data.ContactId) {
                    this.selectCb.call(this.selectCbs, data);
                    RM.ViewMgr.back({ type: 'slide', direction: 'left' });
                }
            },
            this,
            'Customers'
       );
        
    },    
    
    onItemUpdated: function (itemType) {
        if (itemType == 'contact' && this.getCustomers()) {
            this.loadList();
        }
    },    
    
	onSort: function(val){
        
	},	
	
    loadList: function(){
        var store = this.getCustomersList().getStore();
        
        store.clearFilter();
        store.filter('contacttype', 'customers');
        
        if (this.projectIdFilter){
            store.filter('projectid', this.projectIdFilter);

            if (this.filterBy && RM.AppMgr.isValidGuid(this.projectIdFilter)) {
                store.filter('filterby', this.filterBy);
            }
        }
        
        if (this.searchFilter){
            store.filter('search', this.searchFilter);
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
		RM.ViewMgr.back();		
	}	

});