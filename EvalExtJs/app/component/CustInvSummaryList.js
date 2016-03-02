Ext.define('RM.component.CustInvSummaryList', {
    extend: 'Ext.Panel',
    requires: 'RM.component.RMList',
    xtype: 'custinvsummarylist',    
    config:{
        layout: 'fit',
        control: {
            'list': {
                 select: 'onItemSelect'
            }
        }        
    },

    initialize: function () {

		this.callParent(arguments);
        
        
		this.add({
				xtype: 'rmlist',
				store: 'CustomerInvoices',
                loadingText: null,
                emptyText: 'No invoices found.',
				grouped: true,
				itemTpl: '<div class="rm-nextgrayarrow rm-ml5 rm-mr5">{CustomerName}' + '<span class="rm-customerinvoices-invoicecount">' + ' ({InvoiceCount}) ' + '</span>' +
                                '<tpl if=" 0< InvoiceOverdueCount">' +                                
                                "<span class='rm-reddot'></span>" +
                                '</tpl>'+
                         '</div>'}
        );
        
        var store = Ext.data.StoreManager.lookup('CustomerInvoices');
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('CustomerInvoices'));
  
        RM.AppMgr.loadStore(store);
        
    },
    
    onItemSelect: function (list, rec) {
        // Delay the selection clear so get a flash of the selection
        setTimeout(function () { list.deselect(rec); }, 500);
        RM.InvoicesMgr.showCustInvoices(rec.data.CustomerName,  rec.data.CustomerId, rec.data.CustomerName, 'duedate');
    },
    
    reload: function(){
         this.loadList();
    },
    
    setSearch: function(val){
        this.search = val;
        this.setLoadTimer();
    },
    
    clearSearch: function(){
        delete this.search;
        this.loadList();
    },    
    

    loadList: function () {
        var store = Ext.data.StoreManager.lookup('CustomerInvoices');
        store.clearFilter();
        
        if(this.search){
            store.filter('search', this.search);
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