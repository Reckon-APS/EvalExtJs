Ext.define('RM.view.Suppliers', {
   extend: 'Ext.Panel',
	xtype: 'suppliers',
    requires: 'RM.component.RMList',
    config: {
		
		layout: 'fit',
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
						html: 'Suppliers',
						cls: 'rm-topbartitle'
					}
                ]
            },{
				xtype: 'sortsearchbar',				
				docked: 'top',
				sortfields: [{text:'Name', value:'name'}]
			},{
				xtype: 'rmlist',
				store: 'Suppliers',
                emptyText: 'No suppliers found.',
                itemTpl: '<div>{Name}</div>'
			}
        ] 
    }
});