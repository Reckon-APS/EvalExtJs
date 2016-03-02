Ext.define('RM.view.InvoiceTimeSelectDetail', {
    extend: 'Ext.Panel',
    xtype: 'invoicetimeselectdetail',
    requires: ['RM.component.InvoiceTimeSelectDetailPan'],
    config: {
        layout: 'vbox',
        
        style: 'background: #FFFFFF',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{					
					itemId: 'back',
					ui: 'rm_topbarbuttonleft',
                    width: '2.6em',
					icon: 'resources/images/icons/rm-back.svg'					
				},{
					xtype: 'component',
                    itemId: 'detailsTitle',
					cls: 'rm-topbartitle'
				},{
					xtype: 'spacer'
				},{
					text: 'Add',
					itemId: 'add',                    
					ui: 'rm_topbarbuttonright'	
				}
                ]
        }
        ]
    }
});