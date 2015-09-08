Ext.define('RM.component.ExpenseLineItems', {
    extend: 'Ext.Container',
    requires: ['Ext.Button'],
    xtype: 'expenselineitems',
    config: {
        cls: 'rm-whitebg',
        control: {
            'button[action=addItem]': {
                tap: 'onAddItem'
            },
            'button[action=deleteItem]': {
                tap: 'onDeleteItem'
            }
        }
    },


    initialize: function () {

        this.callParent(arguments);

        this.lineItems = {};

        this.add({
            xtype: 'button',
            text: 'ADD EXPENSE LINE',
            action: 'addItem',
            cls: 'rm-invoicelineitem-add'
        });

    },

    setTaxStatus: function (taxStatus) {
        this.taxStatus = taxStatus;
    },

    setCustomerId: function (customerId) {
        this.customerId = customerId;
    },

    setProjectId: function (projectId){
        this.projectId = projectId;
    },

    setExpenseDate: function (expenseDate) {
        this.expenseDate = expenseDate;
    },

    setIsEditable: function (editable) {
        this.isEditable = editable;
        this.query('button[action=addItem]')[0].setHidden(!editable);
    },

    //getItemsLabelHtml: function(valid){
    //    return valid ? 'Items/Accounts <span class="rm-colorred">*</span>' : '<span class="rm-colorred">Items/Accounts *</span>';        
    //},

    onAddItem: function () {
        var expenseData = this.up('#expenseForm').getValues();
        RM.ExpensesMgr.showExpenseLineItem(true, this.customerId, true, expenseData, this.addNewLineItems, this);
    },

    addNewLineItems: function (items) {
        this.addLineItems(items);
        this.fireEvent('addlineitem', items);
    },

    addLineItems: function (items) {

        //alert(Ext.encode(items));

        for (var i = 0; i < items.length; i++) {
            this.addLineItem(items[i]);
        }

    },

    addLineItem: function (item) {
        if (item.IsSubTotal) {
            return;
        }

        var me = this;

        //alert(Ext.encode(item));

        var c = this.add({
            xtype: 'container',
            cls: 'rm-whitebg',
            layout: {
                type: 'fit'
            },
            margin: '1 0 1 4',
            items: [
				{
				    xtype: 'container',
				    layout: 'hbox',
				    scrollable: 'none',
				    cls: 'rm-p5',
				    items: [
						{
						    xtype: 'container',
						    layout: 'vbox',
						    items: [
								{
								    xtype: 'component',
								    cls: 'rm-invoiceitemtext',
								    html: ((item.Quantity > 0) ? item.Quantity + ' x ' : '') + (item.Description || item.ItemName || item.SupplierName),
								    listeners: {
								        tap: {
								            element: 'element',
								            fn: function () {
								                me.editLineItem.call(me, this.getParent().getParent().getParent().getId());
								            }
								        }
								    }
								}
						    ]
						}, {
						    xtype: 'button',
						    action: 'deleteItem',
						    ui: 'plain',
						    docked: 'right',
						    hidden: !this.isEditable,
						    width: 30,
						    icon: 'resources/images/rm-lineitemcross.svg',
						    height: 30,
						    padding: 0,
						    iconCls: 'rm-lineitemcrossbg',
						    margin: '-4 0 0 2'
						}, {
						    xtype: 'component',
						    cls: 'rm-invoiceitemamount',
						    docked: 'right',
						    html: RM.AppMgr.formatCurrency(item.Amount)

						},
				    ]
				}
            ]
        });

        this.lineItems[c.getId()] = item;
        this.validateForm();
    },

    editLineItem: function (compId) {
        var item = this.lineItems[compId]

        //if (item.ItemType == RM.Consts.ItemTypes.CHARGEABLE_ITEM) {
            /*RM.Selectors.showItemDetail(this.showItemTax, item,
        		function(closeType, data){
                    this.updateLineItem(compId, data);
                    this.fireEvent('editlineitem');
        		},
        		this
        	);*/
        RM.ExpensesMgr.showExpenseLineItem(this.isEditable, this.customerId, { taxStatus: this.taxStatus, isCreate: false }, item,
        		function (data) {
        		    this.updateLineItem(compId, data[0]);
        		    this.fireEvent('editlineitem');
        		},
        		this
        	);

        //}

    },

    updateLineItem: function (compId, item) {
        //this.getComponent(compId).getComponent(0).getComponent(0).getComponent(0).setHtml(((item.Quantity > 0) ? item.Quantity  + ' x ' : '') + (item.ItemPath ? item.ItemPath : item.ItemName));
        this.getComponent(compId).getComponent(0).getComponent(0).getComponent(0).setHtml(((item.Quantity > 0) ? item.Quantity + ' x ' : '') + item.Description);
        this.lineItems[compId] = item;
    },

    removeAllItems: function () {

        for (var li in this.lineItems) {
            this.removeAt(1);
        }
        this.lineItems = {};
    },

    onDeleteItem: function (btn) {
        var itemContainer = btn.getParent().getParent(), item = this.lineItems[itemContainer.getId()];

        RM.AppMgr.showYesNoMsgBox('Are you sure you want to delete ' + ((item.Quantity > 0) ? item.Quantity + ' x ' : '') + (item.LineText || item.Description || item.ItemName || item.AccountName) + '?',
            function (msgBoxBtn) {
                if (msgBoxBtn == 'yes') {
                    delete this.lineItems[itemContainer.getId()];
                    this.remove(itemContainer);
                    this.fireEvent('deletelineitem');
                }
            },
            this
        );
    },

    getViewData: function () {

        var data = [];
        for (var li in this.lineItems) {
            data.push(this.lineItems[li]);
        }
        return data;
    },

    validateForm: function () {
        var hasLineItems = this.getViewData().length > 0;
        //this.getComponent(0).getComponent(0).setHtml(this.getItemsLabelHtml(hasLineItems));
        return hasLineItems;
    }


});