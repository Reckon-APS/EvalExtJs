Ext.define('RM.controller.ItemsC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            items: 'items',
            itemsList: 'items list'
        },
        control: {
			'items #back': {
				tap: 'back'			
			},		
            'items #filterProjectId': {
                keyup: function (textField) {
					this.projectIdFilter = textField.getValue();
                    this.setLoadTimer();
                },
                clearicontap: function () {
                    delete this.projectIdFilter;
                    this.loadList();
                }
            },					
            'items #searchItemName': {
                keyup: function (textField) {
					this.nameFilter = textField.getValue();
                    this.setLoadTimer();
                },
                clearicontap: function () {
                    delete this.nameFilter;
                    this.loadList();
                }
            },
			'items list': {
				select: 'onItemSelect'			
			},	
            'items #refresh': {
                tap: function (textField) {
                    this.loadList();
                }
            }
        }

    },

	showView: function(projectId, cb, cbs){
		this.selectCb = cb;
		this.selectCbs = cbs;
		var view = this.getItems();
		if(!view){
			view = {xtype:'items'};
        }            
		RM.ViewMgr.showPanel(view);
		
        var store = this.getItemsList().getStore();
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('Items'));
        store.clearFilter();
        if (projectId){
            store.filter('projectid', projectId);
        }
        this.loadList();        
        
	},

	onItemSelect: function(list, rec){
		
		setTimeout(function(){list.deselect(rec);},500);
		var item = rec.data;
		item.ItemType = RM.Consts.CHARGEABLE_ITEM;
		this.selectCb.call(this.selectCbs, [item]);
		RM.ViewMgr.back({ type: 'slide', direction: 'left'});
	},		
	
	back: function(){
		RM.ViewMgr.back();
	},
	
    loadList: function () {
		var store = this.getItemsList().getStore();
		store.clearFilter();
		if(this.projectIdFilter){
			store.filter('projectid', this.projectIdFilter);
        }
		if(this.nameFilter){
			store.filter('name', this.nameFilter);			
        }
		
        /*if(store.isLoaded()){ //if store is not already loaded it seems to show its own loading mask
            RM.ViewMgr.showLoadingMask();
        }*/

        store.loadPage(1, {
            callback: function (records, operation, success) {
                //RM.ViewMgr.hideLoadingMask();
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