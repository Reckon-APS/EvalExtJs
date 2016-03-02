Ext.define('RM.view.CustomerSelect', {
	extend: 'Ext.Panel',
	xtype: 'customerselect',
    config: {
		layout: 'fit',
		items:[{
                xtype: 'toolbar',
                
                docked: 'top',
                items: [{
						xtype: 'component',
						html: 'Customer Select&nbsp;&nbsp;&nbsp;Filter:'
					},{
						xtype:'textfield',
						itemId: 'searchfilter',
                        width: 100
                    }
                ]
            },{
				xtype: 'container',
				itemId: 'customerlist',
				
				padding: 5
			}
        ] 
    }
});