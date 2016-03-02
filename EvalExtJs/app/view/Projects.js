Ext.define('RM.view.Projects', {
   extend: 'Ext.Panel',
	xtype: 'projects',
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
						html: 'Projects',
						cls: 'rm-topbartitle'
					}
                ]
            },{
				xtype: 'sortsearchbar',				
				docked: 'top'
			},{
				xtype: 'rmlist',
				store: 'Projects',
                grouped: true,
                loadingText: null,
                emptyText: 'No projects found.',
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
