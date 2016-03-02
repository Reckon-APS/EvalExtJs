Ext.define('RM.controller.CustomerInvoicesC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.CustomerInvoices', 'RM.component.InvoicesList'],
    config: {
        refs: {
            CustomerInvoices: 'customerinvoices',
            invoicesTitle: 'customerinvoices #title',
            sortSearchBar: 'customerinvoices sortsearchbar'            
        },
        control: {            
            'customerinvoices #back': {
                tap: 'back'
            },            
            'customerinvoices': {
                show: 'onShow'
            },
            'customerinvoices sortsearchbar': {
                sort: 'onSort',
                search: 'onSearch',
                searchclear: 'onSearchClear'
            },
            'customerinvoices #add': {
                tap: 'add'
            }
        }

    },

    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);        
    },

    showView: function (invoicesTitle, customerId, customerName, sortVal) {
        this.invoicesTitle = invoicesTitle;
        this.customerId = customerId;
        this.customerName = customerName;        
        
        var view = this.getCustomerInvoices();        
        if (!view){
            view = { xtype: 'customerinvoices' };   
        }            
        
        RM.ViewMgr.showPanel(view);
        this.getSortSearchBar().setSearch(sortVal);        
    },
    
    onShow: function () {
        //This next inline style should be moved to the sass
        this.getInvoicesTitle().setTitle('<span style="text-shadow:none; font-weight:normal;">' + this.invoicesTitle + '</span>');        
    },

    onItemUpdated: function (itemType) {
        if (itemType == 'invoice' && this.getCustomerInvoices()) {            
            this.activeList.reload();
        }
    },

    onSort: function (sortVal) {        
        var view = this.getCustomerInvoices();
        view.removeAt(2);
        this.activeList = view.add({xtype:'invoiceslist', sortVal:sortVal, isShowCustomer: false, customerId: this.customerId});
    },

    onSearch: function(val){
        this.activeList.setSearch(val);
    },
    
    onSearchClear: function(){
        this.activeList.clearSearch();
    },
    
    add: function () {
        var data = this.customerId ? { CustomerId: this.customerId, CustomerName: this.customerName} : null;
        RM.InvoicesMgr.showInvoiceDetail(true, data,
			function (closeType, data) {
			    return null;
			},
			this
		);
    },

    back: function () {
        RM.ViewMgr.back();
    }
});