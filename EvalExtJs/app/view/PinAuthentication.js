Ext.define('RM.view.PinAuthentication', {
    extend: 'Ext.Panel',
    xtype: 'pinauthentication',
    config: {        
        cls: 'rm-whitebg',
        items: [{
            xtype: 'toolbar',
            docked: 'top',			
            items: [{
                    xtype: 'button',
                    itemId: 'back',
                    width: '2.6em',
                    ui: 'rm_maintopbarbuttonleft',
                    icon: 'resources/images/icons/rm-back.svg',
                    iconCls: 'rm-backbtniconcls'
                },{
					xtype: 'component',
                    itemId: 'title',
					cls: 'rm-topbartitle'
				}
            ]
        },{
            xtype: 'component',
            itemId: 'msg',
            padding: '20 15 20 15',
            cls: 'rm-intromsg'			
        },{
            xtype: 'pinkeypad',
            maskPin: true,
            docked: 'bottom'
        }
        ]
    }
});