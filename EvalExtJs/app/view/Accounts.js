Ext.define('RM.view.Accounts', {
   extend: 'Ext.Panel',
	xtype: 'accounts',
    requires: 'RM.component.RMList',
    config: {
		
		layout: 'vbox',
		items:[{
                xtype: 'toolbar',                
                docked: 'top',
                items: [{
						ui: 'rm_topbarbuttonleft',
						icon: 'resources/images/icons/rm-back.svg',
                        iconCls: 'rm-backbtniconcls',
                        width: '2.6em',						
						itemId: 'back'				
					},{
						xtype: 'component',
						html: 'Choose an account',
						cls: 'rm-topbartitle'
					}
                ]
            },{
				xtype: 'sortsearchbar',				
				docked: 'top'
			},{
                xtype: 'list',
                store: 'AccountingCategories',
                itemTpl: '<div class = "rm-orgnametext">{Name}</div>',
                emptyText: 'No accounts found.',
                grouped: true,
                flex: 1
            }
        ] 
    }
    
    
    
});