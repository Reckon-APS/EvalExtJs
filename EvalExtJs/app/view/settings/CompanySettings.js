Ext.define('RM.view.settings.CompanySettings', {
    extend: 'Ext.Panel',
    xtype: 'companysettings',
    config: {
        items: [{
                xtype: 'toolbar',                
                docked: 'top',               
                items: [{
						xtype: 'component',
						html: 'Company settings',
						cls: 'rm-topbartitle'
					}
                ]
            },{
            xtype: 'panel',
            html: 'Company Settings',
            padding: 5
        }
        ]
    }
});