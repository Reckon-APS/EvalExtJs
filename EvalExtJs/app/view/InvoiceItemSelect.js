Ext.define('RM.view.InvoiceItemSelect', {
   extend: 'Ext.Panel',
	xtype: 'invoiceitemselect',
    config: {
		
		layout: 'fit',
		items:[{
                xtype: 'toolbar',                
                docked: 'top',
                items: [{
						xtype: 'component',
						html: 'Invoice Item Select'
					},{
						xtype:'textfield',
						itemId: 'namefilter',
                        width: 100
                    },{
						iconCls: 'refresh',
						itemId: 'refresh',
						iconMask: true,
						ui: 'plain'
                    }
                ]
            },{
				xtype: 'container',
				itemId: 'itemslist',
				
				padding: 5
			},{
				xtype: 'toolbar',
				
				docked: 'bottom',
				items: [{
					    text: 'Create',
                        itemId: 'create'
					}
				]
			}
        ] 
    }
});