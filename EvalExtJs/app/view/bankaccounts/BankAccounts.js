Ext.define('RM.view.bankaccounts.BankAccounts', {
    extend: 'Ext.Panel',
    xtype: 'bankaccounts',
    config: {
        items: [{
                xtype: 'toolbar',                
                docked: 'top',                
                items: [{
						xtype: 'component',
						html: 'Bank accounts',
						cls: 'rm-topbartitle'
					}
                ]
            },{
				//xtype: 'panel',
				html: 'Bank Accounts',
				padding: 5
        }
        ]
    }
});