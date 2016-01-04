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
            },
            'bills #add': {
                tap: 'add'
            },
            billsList: {
                select: 'onItemTap'
            },
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
	
	onItemTap: function (list, rec) {
	    //if (Ext.fly(e.target).hasCls('rm-emailreminder')) {
	    //    this.sendBillReminder(rec.data.BillId);
	    //}
	    //else {
	        RM.BillsMgr.showBillDetail(false, rec.data,
                function (closeType, data) {
                    return null;
                },
                this
            );
	    //}

	},

    //This method which will be called from onItemTap will currently never be called as RM.ViewMgr.showEmailReminder() always returns false
    //- it was set to return false as although the initial mobile ux had an reminder functionality the web app doesn't at this stage so decision was to turn it off in mobile as well
	sendBillReminder: function (billId) {
	    RM.AppMgr.getServerRecById('Bills', billId,
            function (data) {
                RM.BillsMgr.sendMsg(
                    function () {
                        RM.ViewMgr.backTo('bills');
                    },
                    this,
                    data,
                    'emailreminder'
                );
            },
            this,
            function (eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
        );
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