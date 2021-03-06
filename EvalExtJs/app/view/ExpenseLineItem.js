Ext.define('RM.view.ExpenseLineItem', {
    extend: 'Ext.Panel',
    xtype: 'expenselineitem',
    requires: ['RM.component.SecureFormPanel', 'RM.component.ExtNumberField', 'RM.component.RMSelectScreenField', 'Ext.field.Select', 'RM.component.RMAmountField'],
    config: {
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                itemId: 'back',
                ui: 'rm_topbarbuttonleft',
                width: '2.6em',
                icon: 'resources/images/icons/rm-back.svg',
                iconCls: 'rm-backbtniconcls'
            }, {
                xtype: 'component',
                html: 'Item/Account details',
                cls: 'rm-topbartitle',
                itemId: 'title'
            }, {
                xtype: 'spacer'
            }, {
                text: 'Add',
                itemId: 'add',
                ui: 'rm_topbarbuttonright'
            }
            ]
        }, {
            xtype: 'secureformpanel',
            permissionFor: 'ExpenseClaims',
            itemId: 'itemForm',
            padding: 0,            
            items: [{
                xtype: 'component',
                itemId: 'status',
                hidden: true,
                cls: 'rm-hearderbg'
            }, {
                xtype: 'hiddenfield',
                name: 'ProjectId'
            }, {
                xtype: 'hiddenfield',
                name: 'CustomerId'
            }, {
                xtype: 'hiddenfield',
                name: 'SupplierId'
            }, {
                xtype: 'hiddenfield',
                name: 'ItemId'
            }, {
                xtype: 'hiddenfield',
                name: 'ItemPath'
            }, {
                xtype: 'hiddenfield',
                name: 'AccountId'
            }, {
                xtype: 'extdatepickerfield',
                name: 'ExpenseClaimDate',
                label: 'Date',
                rmmandatory: true,
                dateFormat: 'jS M Y',
                cls: 'Date-icon rm-flatfield',
                ui: 'plain',
                placeHolder: 'select'
            }, {
                xtype: 'exttextfield',
                name: 'ProjectName',
                label: 'Project',
                cls: 'rm-flatfield',
                rmreadonly: true,
                placeHolder: 'select (optional)'
            }, {
                xtype: 'exttextfield',
                name: 'CustomerName',
                label: 'Customer',               
                cls: 'rm-flatfield',
                rmreadonly: true,
                placeHolder: 'select (optional)'                
            }, {
                xtype: 'exttextfield',
                name: 'SupplierName',
                label: 'Supplier',
                rmreadonly: true,
                cls: 'rm-flatfield',
                placeHolder: 'select (optional)'                
            }, {
                xtype: 'rmtogglefield',
                name: 'IsBillable',
                onText: 'Yes',
                offText: 'No',
                toggleState: false,
                cls: 'rm-flatfield',
                label: 'Billable',
                labelWidth: '10em'
            }, {
                xtype: 'exttextfield',
                name: 'Notes',
                label: 'Notes',                
                placeHolder: 'enter (optional)',
                cls: 'rm-flatfield',
                clearIcon: false,
                readOnly: true                						
            }, {
                xtype: 'exttextfield',
                name: 'ItemName',
                itemId: 'itemField',
                readOnly: true, //prevent OS keypad coming as well
                label: 'Item',
                //rmmandatory: true,
                cls: ['rm-flatfield'],
                placeHolder: 'select'
            }, {
                xtype: 'exttextfield',
                name: 'AccountName',
                itemId: 'account',
                readOnly: true, //prevent OS keypad coming as well
                label: 'Account',
                //rmmandatory: true,
                cls: ['rm-flatfield', 'rm-flatfield-last'],
                placeHolder: 'select'
            }, {
                xtype: 'container',
                itemId: 'detailsFields',
                defaults: { clearIcon: false },
                hidden: true,
                items: [ {
                    xtype: 'exttextfield',
                    name: 'Description',
                    label: 'Description',
                    labelWidth: 120,
                    cls: 'rm-flatfield',
                    placeHolder: 'enter'
                }, {
                    xtype: 'rmamountfield',
                    name: 'UnitPrice',
                    label: 'Item price',
                    rmmandatory: true,
                    labelWidth: 135,
                    cls: 'rm-flatfield',
                    placeHolder: 'enter',
                    decimalPlaces: 8,
                    prefix: '$'

                }, {
                    xtype: 'rmamountfield',
                    name: 'Quantity',
                    label: 'Quantity',
                    value: 1,
                    cls: 'rm-flatfield',
                    decimalPlaces: 4,
                    trailingZerosUpTo: 0,
                    currencyMode: false,
                    prefix: ''
                }, {
                    xtype: 'rmamountfield',
                    name: 'Amount',
                    itemId: 'Amount',
                    label: 'Amount',
                    value: 0,
                    readOnly: true,
                    cls: ['rm-flatfield-disabled'],
                    decimalPlaces: 2,
                    prefix: '$'
                }, {
                    xtype: 'extselectfield',
                    label: 'Tax code',
                    labelWidth: '6em',
                    usePicker: true,
                    name: 'TaxGroupId',
                    itemId: 'TaxGroupId',
                    store: 'PurchaseTaxCodes',
                    displayField: 'GSTCode',
                    valueField: 'GSTCodeId',
                    autoSelect: false,
                    cls: 'rm-flatfield',
                    placeHolder: 'select',
                    ui: 'plain'
                }, {
                    xtype: 'rmamountfield',
                    name: 'Tax',
                    itemId: 'Tax',
                    label: 'Tax',
                    labelWidth: '7em',
                    cls: ['rm-flatfield', 'rm-flatfield-last'],
                    decimalPlaces: 2,
                    prefix: '$',
                    clearIcon: true
                }]
            }
            ]
        }
        ]
    },

    showDetailsFields: function () {
        this.down('#itemField').removeCls(['rm-flatfield-last']);
        this.down('#detailsFields').setHidden(false);
    },

    hideDetailsFields: function () {
        this.down('#itemField').addCls(['rm-flatfield-last']);
        this.down('#detailsFields').setHidden(true);
    },

    hideTaxFields: function () {
        this.down('#TaxGroupId').setHidden(true);
        this.down('#Tax').setHidden(true);
        this.down('#Amount').addCls(['rm-flatfield-last']);
    },

    setTaxAmountAccessible: function (accessible) {
        this.down('#Tax').setHidden(!accessible);

        var taxCode = this.down('#TaxGroupId');
        if (accessible) {
            taxCode.removeCls(['rm-flatfield-last']);
        }
        else {
            taxCode.addCls(['rm-flatfield-last']);
        }
    },

    setTaxModified: function (isModified) {
        var taxField = this.down('#Tax');
        var countrySettings = RM.CashbookMgr.getCountrySettings();
        if (isModified) {
            taxField.addCls(['rm-field-warning']);
            taxField.setLabel(countrySettings.LineItemTaxLabel + ' (modified)');
            taxField.removeCls('clear-icon-hidden');
        }
        else {
            taxField.removeCls(['rm-field-warning']);
            taxField.setLabel(countrySettings.LineItemTaxLabel);
            taxField.addCls('clear-icon-hidden');
        }
    }
});
