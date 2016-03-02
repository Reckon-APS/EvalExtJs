Ext.define('RM.view.budgets.Budgets', {
    extend: 'Ext.Panel',
    xtype: 'budgets',
    config: {
        items: [{
                xtype: 'toolbar',                
                docked: 'top',                
                items: [{
						xtype: 'component',
						html: 'Budgets',
						cls: 'rm-topbartitle'
					}
                ]
            },{
            xtype: 'panel',
            html: 'Budgets',
            padding: 5
        }
        ]
    }
});