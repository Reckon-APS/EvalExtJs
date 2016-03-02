Ext.define('RM.view.settings.LinkBankAccount', {
    extend: 'Ext.Panel',
    xtype: 'linkbankaccount',
    config: {
        items: [{
                xtype: 'toolbar',                
                docked: 'top',                
                items: [{
						xtype: 'component',
						html: 'Link bank account',
						cls: 'rm-topbartitle'
					}
                ]
            },{
            xtype: 'panel',
            html: 'Link Bank Account',
            padding: 5
        }
        ]
    }
});