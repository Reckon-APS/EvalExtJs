Ext.define('RM.controller.ItemsAmountsC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            items: 'itemsamounts',
            itemsList: 'itemsamounts list'
        },
        control: {
            'itemsamounts #back': {
                tap: 'back'
            },
            'itemsamounts sortsearchbar': {
                search: function (val) {
                    this.nameFilter = val;
                    this.setLoadTimer();
                },

                searchclear: function () {
                    delete this.nameFilter;
                    this.loadList();
                }
            },						
            'itemsamounts list': {
                select: 'onItemSelect'
            },
            'itemsamounts #createItem':{
                tap: 'onCreateItem'
            }
        }

    },
    
    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);
    },    

    showView: function (showItemTax, projectId, selectDetails, cb, cbs, itemType, itemPurchasedSoldType) {
        this.showItemTax = showItemTax;
        this.projectIdFilter = projectId;
        this.itemType = itemType;
        this.itemPurchasedSoldType = itemPurchasedSoldType;

        this.selectDetails = selectDetails;
        this.selectCb = cb;
        this.selectCbs = cbs;
        /*var view = this.getItems();
        if (!view){
            view = { xtype: 'itemsamounts', selectDetails: selectDetails};
        }*/
        
        var view = { xtype: 'itemsamounts', selectDetails: selectDetails}; //create a new view each time as we want selectDetails to be effective
        RM.ViewMgr.showPanel(view);

        var store = this.getItemsList().getStore();
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('Items'));
        this.loadList();
    },

    onItemUpdated: function (itemType) {
        if (itemType == 'item') {
            this.loadList();
        }
    },    
    
    onItemSelect: function (list, rec) {

        setTimeout(function () { list.deselect(rec); }, 500);
        var item = rec.data;
        item.ItemName = item.Name;
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
    
    onCreateItem: function(){
        //alert('onCreateItem');
        RM.InvoicesMgr.showCreateItem(
            function(){
                
                
            },
            this
       );
        
    },

    back: function () {
        RM.ViewMgr.back();
    },

    loadList: function () {
        var store = this.getItemsList().getStore();
        store.clearFilter();
        if (this.projectIdFilter){
            store.filter('projectid', this.projectIdFilter);
        }
        if (this.nameFilter){
            store.filter('name', this.nameFilter);
        }
        if (this.itemType) {
            store.filter('ItemType', this.itemType);
        }
        if (this.itemPurchasedSoldType) {
            store.filter('itempurchasedsoldtype', this.itemPurchasedSoldType);
        }

        RM.AppMgr.loadStore(store);
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    }


});