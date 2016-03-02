Ext.define('RM.view.ItemDetail', {
    extend: 'Ext.Panel',
    xtype: 'itemdetail',
    requires: ['Ext.field.Number', 'Ext.field.Select'],
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
					text: 'Add',
					itemId: 'add',                    
					ui: 'rm_topbarbuttonright'	
				}
                ]
        },{
			xtype: 'formpanel',
			itemId: 'itemForm',
			padding: 0,
			items: [{
					xtype: 'hiddenfield',
					name: 'ItemId'			
				},{
					xtype: 'hiddenfield',
					name: 'ProjectId'			
				},{
					xtype: 'hiddenfield',
					name: 'ItemPath'			
				},{
					xtype: 'textfield',
					name: 'ItemName',
					label: 'Item',
					cls: 'rm-flatfield',
                    clearIcon: false,
                    readOnly: true                                     
				},{
					xtype: 'numberfield',
					name: 'Quantity',
					label: 'Quantity',
					value: 1,
					cls: 'rm-flatfield',
					clearIcon: false
				},{
                    xtype: 'selectfield',
                    label: 'Tax code',
                    labelWidth: '6em',
					usePicker: true,
					name: 'SaleTaxCodeId',
					store: 'GSTCodes',
					displayField: 'GSTCode',
					valueField: 'GSTCodeId',
					cls: 'rm-flatfield',
                    ui:'plain'
                },{
                    xtype: 'exttextfield',
					name: 'Discount',
					label: 'Discount',
					value: 0,
					cls: 'rm-flatfield',
					clearIcon: false,
                    readOnly: true,
                    border: '1 0 1 0',
                    style: 'border-color: #DBDBDB; border-style: solid;'
				}
			]
		}
        ]
    }
});