Ext.define('RM.view.InvoiceLineItem', {
    extend: 'Ext.Panel',
    xtype: 'invoicelineitem',
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
				},{
					xtype: 'component',
					html: 'Item details',
					cls: 'rm-topbartitle',
					itemId: 'title'
				},{
					xtype: 'spacer'
				},{
					text: 'ADD',
					itemId: 'add',                    
					ui: 'rm_topbarbuttonright'	
				}
                ]
        },{
			xtype: 'secureformpanel',
            permissionFor: 'Invoices',
			itemId: 'itemForm',
			padding: 0,
            defaults: {clearIcon: false},
			items: [{
					xtype: 'hiddenfield',
					name: 'ProjectId'			
				},{	
                    xtype: 'hiddenfield',
					name: 'ItemId'			
				},{
					xtype: 'hiddenfield',
					name: 'ItemPath'			
				},{
					xtype: 'rmselectscreenfield',
					name: 'ProjectName',
					label: 'Project',
                    //readOnly: true, //prevent OS keypad coming as well
					cls: 'rm-flatfield',
                    clearIcon: true,
                    placeHolder: 'select (optional)',
                    permissionFor: {action:'Select',name:'Projects'},
				},{
					xtype: 'exttextfield',
					name: 'ItemName',
                    readOnly: true, //prevent OS keypad coming as well
					label: 'Item',
                    rmmandatory: true,
					cls: 'rm-flatfield',
					placeHolder: 'select'
				},{
					xtype: 'exttextfield',
					name: 'Description',
                    itemId:'descriptionField',
					label: 'Description',
                    labelWidth: 105,
					cls: ['rm-flatfield', 'rm-flatfield-last'],
					placeHolder: 'enter'
				},{
                    xtype: 'container',
                    itemId: 'detailsFields',
                    defaults: {clearIcon: false},
                    hidden:true,
                    items: [
                    {                        
    					xtype: 'rmamountfield',
    					name: 'UnitPrice',
    					label: 'Item price',
                        rmmandatory: true,
                        labelWidth: 135,
    					cls: 'rm-flatfield',
    					placeHolder: 'enter',
                        decimalPlaces: 8,
                        prefix: '$'

    				},{
    					xtype: 'rmamountfield',
    					name: 'Quantity',
    					label: 'Quantity',
    					value: 1,
    					cls: 'rm-flatfield',
                        decimalPlaces: 4,
                        trailingZerosUpTo: 0,
                        currencyMode: false,
                        prefix: ''
    				},{
                        xtype: 'exttextfield',
    					name: 'Discount',
    					label: 'Item discount',
                        labelWidth: '7em',
                        readOnly: true, //prevent OS keypad coming as well                        
    					value: 0,
    					cls: ['rm-flatfield']                   
    				},{
    					xtype: 'rmamountfield',
    					name: 'Amount',
                        itemId: 'Amount',
    					label: 'Amount',
    					value: 0,
                        readOnly: true,
    					cls: 'rm-flatfield-disabled rm-flatfield-disabled-pt0',                        
                        decimalPlaces: 2,
                        prefix: '$'
    				},{
                        xtype: 'extselectfield',
                        label: 'Tax code',
                        labelWidth: '6em',
    					usePicker: true,
    					name: 'TaxGroupId',  
                        itemId: 'TaxGroupId',
    					store: 'GSTCodes',
    					displayField: 'GSTCode',
    					valueField: 'GSTCodeId',
                        autoSelect: false,
    					cls: 'rm-flatfield',
                        ui:'plain'
                    },{
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
    
    showDetailsFields: function() {
        this.down('#descriptionField').removeCls(['rm-flatfield-last']);        
        this.down('#detailsFields').setHidden(false);        
    },
    
    hideDetailsFields: function() {    
        this.down('#descriptionField').addCls(['rm-flatfield-last']);
        this.down('#detailsFields').setHidden(true);        
    },
    
    hideTaxFields: function() {
        this.down('#TaxGroupId').setHidden(true);
        this.down('#Tax').setHidden(true);        
        this.down('#Amount').addCls(['rm-flatfield-last']);
    },
    
    setTaxModified: function(isModified) {
        var taxField = this.down('#Tax');
        if(isModified) {
            taxField.addCls(['rm-field-warning']);
            taxField.setLabel('Tax (modified)');
            taxField.removeCls('clear-icon-hidden');
        }
        else {
            taxField.removeCls(['rm-field-warning']);
            taxField.setLabel('Tax');
            taxField.addCls('clear-icon-hidden');
        }        
    }
});
