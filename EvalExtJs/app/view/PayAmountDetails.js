Ext.define('RM.view.PayAmountDetails',{
    extend: 'RM.component.SecurePanel',
    xtype: 'payamountdetails',
    config:{        
        cls: 'rm-whitebg',
        items: [{
                    xtype: 'toolbar',
                    docked: 'top',            
                    items: [{					
        						itemId: 'return',
        						ui: 'rm_topbarbuttonleft',
        						icon: 'resources/images/icons/rm-back.svg',
                                iconCls: 'rm-backbtniconcls',                        		
                                width: '2.6em'						
							},{
                                xtype: 'component',
                                itemId: 'title',
                                html: 'Details',
                                cls: 'rm-topbartitle'
                        }
                    ]
            },{                
                    xtype: 'component',
                    itemId: 'details',
                    padding: 5,
                    margin:0                       
            }
        ]
    }
});