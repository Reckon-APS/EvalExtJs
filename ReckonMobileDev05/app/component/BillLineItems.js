Ext.define('RM.component.BillLineItems', {
    extend: 'Ext.Container',
    requires: ['Ext.Button'],
    xtype: 'billlineitems',
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
            text: 'ADD BILL LINE',
            action: 'addItem',
            cls: 'rm-invoicelineitem-add'
        });

    },

    setTaxStatus: function (taxStatus) {
        this.taxStatus = taxStatus;
    },

    setSupplierId: function (supplierId) {
        this.supplierId = supplierId;
    },

    setSupplierName: function (customerName) {
        this.customerName = customerName;
    },

    setProjectId: function (projectId) {
        this.projectId = projectId;
    },

    setProjectName: function (projectName) {
        this.projectName = projectName;
    },

    setBillDate: function (billDate) {
        this.billDate = billDate;
    },

    setIsEditable: function (editable) {
        this.isEditable = editable;
        this.query('button[action=addItem]')[0].setHidden(!editable);
    },

    onAddItem: function () {
        if (this.supplierId == null) {
            RM.AppMgr.showOkMsgBox("You must select a Supplier before adding an invoice line.");
        }
        else {
            var billData = this.up('#billForm').getValues();
            RM.BillsMgr.showBillLineItem(true, this.supplierId, { taxStatus: this.taxStatus, isCreate: true, projectId: this.projectId, projectName: this.projectName, supplierName: this.supplierName }, billData, this.addNewLineItems, this);
        }
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
        RM.ExpensesMgr.showExpenseLineItem(this.isEditable, this.supplierId, { taxStatus: this.taxStatus, isCreate: false, projectId: this.projectId, projectName: this.projectName, supplierName: this.supplierName }, item,
        		function (data) {
        		    this.updateLineItem(compId, data[0]);
        		    this.fireEvent('editlineitem');
        		},
        		this
        	);
    },

    updateLineItem: function (compId, item) {
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
        return hasLineItems;
    }


});