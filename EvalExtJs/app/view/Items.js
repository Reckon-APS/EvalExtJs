Ext.define('RM.view.Items', {
   extend: 'Ext.Panel',
	xtype: 'items',
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
						html: 'Items',
						cls: 'rm-topbartitle'
					}
                ]
            },{
				xtype: 'sortsearchbar',				
				docked: 'top',
				sortfields: [{text: 'Name', value: 'name'}]
			},{
				xtype: 'rmlist',
				store: 'Items',
                emptyText: 'No items found.',
				grouped: true,
				itemTpl: new Ext.XTemplate(        
					'<span>{[this.accessLevel(values.Level)]}</span> {Name}',					
					{
						accessLevel: function(level) {
							var ret = '';
							if(level > 0){
								for(var i = 1; i <= level; i++){
									ret += '&bull;';
								}
							}
							return ret;
						}
				})
			}
        ] 
    }
});