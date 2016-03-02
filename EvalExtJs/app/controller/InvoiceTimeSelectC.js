Ext.define('RM.controller.InvoiceTimeSelectC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.InvoiceTimeSelect'],
    config: {
        refs: {
            timeSelect: 'invoicetimeselect',
            timeSelectList: 'invoicetimeselect list'
        },
        control: {
            'invoicetimeselect #back': {
                tap: 'back'
            },
            'invoicetimeselect sortsearchbar': {
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
            'invoicetimeselect list': {
                itemtap: 'onItemTap'
            },
            'invoicetimeselect': {
                headertap: 'onHeaderTap'
            },
            'invoicetimeselect #add': {
                tap: 'onAdd'
            }
        }

    },

    showView: function (customerId, cb, cbs) {
        this.customerIdFilter = customerId;
        this.selectCb = cb;
        this.selectCbs = cbs;
        
        var view = this.getTimeSelect();
        if (!view){
            view = { xtype: 'invoicetimeselect' };
        }            
        RM.ViewMgr.showPanel(view);

        var store = this.getTimeSelectList().getStore();
        this.setGrouper(store, 'CustomerName');
		store.getProxy().setUrl(RM.AppMgr.getApiUrl('InvoiceTimeSelect'));

        this.loadList();             
    },

    back: function () {
        RM.ViewMgr.back();
    },

    onItemTap: function (list, index, target, rec, e, eOpts) {
        var targetEle = Ext.fly(e.target);

        if (targetEle.hasCls('rm-notelink'))
            RM.Selectors.showHistory('Time', RM.Consts.HistoryTypes.TIME, rec.get('TimeEntryId'));
        else
            rec.set('Selected', !rec.get('Selected'));

    },

    onHeaderTap: function (groupName, isChecked) {
        var groupByName = this.groupByName;
        this.getTimeSelectList().getStore().each(function (item) {
            var recGroupName = item.get(groupByName);
            if (groupByName == 'Date')
                recGroupName = Ext.Date.format(recGroupName, 'D M j, Y');
            if (recGroupName == groupName || (!recGroupName && groupName == 'None'))
                item.set('Selected', isChecked);
        });
    },

    /*onSelect: function(list, rec){	
    console.log('onSelect');
    setTimeout(function(){list.deselect(rec);},500);
    },*/

    onSort: function (val) {
        //this.getTimeSelectList().getStore().setGroupField(val);
        var store = this.getTimeSelectList().getStore();
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
                //return '<div class="rm-checkbox rm-checkbox-off" style="float:left;"></div><div style="float:left;margin-left:6px;">' + groupName + '</div>';   //Changed for checkbox icon
            }
        });
    },

    onAdd: function () {

        var items = [];

        this.getTimeSelectList().getStore().each(function (item) {
            if (item.get('Selected')) {
                var itemData = item.data, amount = itemData.Duration * itemData.HourlyRate, taxCode = RM.AppMgr.getTaxCode(itemData.TaxTypeId);
                //alert(Ext.encode(itemData));
                items.push({ //fields corresponding to InvoiceLineItemDto
                    //InvoiceItemId: null, //is assigned at server
                    //InvoiceId: null, //can be determined at server as line item is already inside the InvoiceDto
                    ItemType: RM.Consts.ItemTypes.TIME,
                    ItemId: itemData.TimeEntryId,
                    //Name: 'Hrs: ' + itemData.ProjectName, //itemData.Description,
                    CustomerName: itemData.CustomerName,
                    EmployeeName: itemData.EmployeeName,
                    ItemName:  itemData.ItemName,
                    Quantity: itemData.Duration,
                    Amount: amount,
                    TaxCodeId: itemData.TaxTypeId,
                    TaxRate: taxCode ? taxCode.Rate / 100 * amount : 0, //this is the tax amount - need to change TaxRate to Tax in InvoiceLineItemDto
                    UnitPrice: itemData.HourlyRate
                    //,DiscountAmount: 0
                });
            }
        });

        RM.InvoicesMgr.showInvoiceTimeSelectDetail(
            'Time details',
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
        
        var store = this.getTimeSelectList().getStore();
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