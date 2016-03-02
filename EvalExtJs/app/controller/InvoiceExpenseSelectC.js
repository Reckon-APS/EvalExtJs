Ext.define('RM.controller.InvoiceExpenseSelectC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.InvoiceExpenseSelect'],
    config: {
        refs: {
            expSelect: 'invoiceexpenseselect',
            expSelectList: 'invoiceexpenseselect list'
        },
        control: {
            'invoiceexpenseselect #back': {
                tap: 'back'
            },
            'invoiceexpenseselect sortsearchbar': {
                sort: 'onSort',
                search: function (val) {
                    this.searchFilter = val;
                    this.setLoadTimer();
                },

                searchclear: function () {
                    delete this.searchFilter;
                    this.loadList();
                }
            },
            'invoiceexpenseselect list': {
                itemtap: 'onItemTap'
            },
            'invoiceexpenseselect': {
                headertap: 'onHeaderTap'
            },
            'invoiceexpenseselect #add': {
                tap: 'onAdd'
            }
        }
    },

    showView: function (customerId, cb, cbs) {
        this.customerIdFilter = customerId;
        this.selectCb = cb;
        this.selectCbs = cbs;

        var view = this.getExpSelect();
        if (!view){
            view = { xtype: 'invoiceexpenseselect' };
        }
        RM.ViewMgr.showPanel(view);

        var store = this.getExpSelectList().getStore()
        this.setGrouper(store, 'CustomerName');
		store.getProxy().setUrl(RM.AppMgr.getApiUrl('InvoiceExpenseSelect'));

        this.loadList();
        
    },

    back: function () {
        RM.ViewMgr.back();
    },

    onItemTap: function (list, index, target, rec, e, eOpts) {
        var targetEle = Ext.fly(e.target);

        if (targetEle.hasCls('rm-notelink'))
            RM.Selectors.showHistory('Expense', RM.Consts.EXPENSE_HISTORY_TYPE, rec.get('ExpenseId'));
        else
            rec.set('Selected', !rec.get('Selected'));
    },

    onHeaderTap: function (groupName, isChecked) {
        var groupByName = this.groupByName;
        this.getExpSelectList().getStore().each(function (item) {
            var recGroupName = item.get(groupByName);
            if (groupByName == 'Date')
                recGroupName = Ext.Date.format(recGroupName, 'D M j, Y');
            if (recGroupName == groupName || (!recGroupName && groupName == 'None'))
                item.set('Selected', isChecked);
        });
    },

    onSort: function (val) {
        //this.getExpSelectList().getStore().setGroupField(val);
        var store = this.getExpSelectList().getStore();
        store.sort(val);
        this.setGrouper(store, val);
        this.loadList();
    },

    setGrouper: function (store, groupByName) {
        this.groupByName = groupByName;
        store.setGrouper({
            groupFn: function (rec) {
                var groupName = rec.get(groupByName);
                if (!groupName)
                    groupName = 'None';
                else if (groupByName == 'Date')
                    groupName = Ext.Date.format(groupName, 'D M j, Y');

                //return '<div><input type="checkbox" class="select_checkbox" style="margin:4px;"><span>' + groupName + '</span></div>';
                return '<div class="rm-checkbox rm-checkbox-off" style="float:left;"></div><div style="display:inline;margin-left:6px;">' + groupName + '</div>';
                //return '<div class="rm-checkbox rm-checkbox-off" style="float:left;"></div><div style="float:left;margin-left:6px;">' + groupName + '</div>';  //Changed for checkbox icon
                //Another way to get checkbox in header could be using techniques as shown in:
                //http://kubahulewicz.net/2012/07/sencha-touch-2-searchable-grouped-list-with-expandcollapse-functionality/

            }
        });
    },

    onAdd: function () {

        var items = [];

        this.getExpSelectList().getStore().each(function (item) {
            if (item.get('Selected')) {
                var itemData = item.data, taxCode = RM.AppMgr.getTaxCode(itemData.TaxTypeId);

                items.push({ //fields corresponding to InvoiceLineItemDto
                    //InvoiceItemId: null, //is assigned at server
                    //InvoiceId: null, //can be determined at server as line item is already inside the InvoiceDto
                    ItemType: RM.Consts.ItemTypes.EXPENSE,
                    ItemId: itemData.ExpenseId,
                    //Name: itemData.Description + ' (Exp)',
                    CustomerName: itemData.CustomerName,
                    EmployeeName: itemData.EmployeeName,
                    ItemName:  itemData.ItemName,                    
                    Quantity: 1,
                    Amount: itemData.Amount,
                    TaxCodeId: itemData.TaxTypeId,
                    TaxRate: taxCode ? taxCode.Rate / 100 * itemData.Amount : 0,
                    UnitPrice: itemData.Amount
                    //,DiscountAmount: 0
                });

            }
        });

        //alert(Ext.encode(items));
        //this.selectCb.call(this.selectCbs, items);
        //RM.ViewMgr.back({ type: 'slide', direction: 'left' });        
        
        RM.InvoicesMgr.showInvoiceTimeSelectDetail(
            'Expense details',
            items,
            function(items){
                //alert(Ext.encode(items));
                this.selectCb.call(this.selectCbs, items);
                RM.ViewMgr.back({ type: 'slide', direction: 'left' });                
            },
            this
        );          
        
    },

    loadList: function () {
        
        var store = this.getExpSelectList().getStore();
        store.clearFilter();
        store.filter('AllEmployees', false);
        if(this.searchFilter){
            store.filter('search', this.searchFilter);
        }                
        if(this.customerIdFilter){
            store.filter('customerid', this.customerIdFilter);
        }         
        
        RM.AppMgr.loadStore(
            store,
            function(recs, operation, success){
                for(var i = 0; i < recs.length; i++){
                    recs[i].set('Selected', false);    
                } 
            },
            this
        );        
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    }

});