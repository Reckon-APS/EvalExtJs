Ext.define('RM.view.CreatePin', {
    extend: 'Ext.Panel',
    xtype: 'createpin',
    config: {
        
        style: 'background: #FFF',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
			//ui:'rm-main-topbar',            
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
        }, {
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