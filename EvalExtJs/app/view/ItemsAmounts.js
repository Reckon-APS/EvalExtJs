Ext.define('RM.view.ItemsAmounts', {
   extend: 'Ext.Panel',
	xtype: 'itemsamounts',
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
						html: 'Choose an item',
						cls: 'rm-topbartitle'
					}
                ]
            },{
				xtype: 'sortsearchbar',				
				docked: 'top'
			}
        ] 
    },
    
    initialize: function(){        

        this.callParent(arguments);
        
        if(RM.PermissionsMgr.canAddEdit('Items')){
            this.add({
                xtype: 'button',
                text: 'Add a new item',
                itemId: 'createItem',
                cls: 'rm-createitembtn'
            });
            
            
        }
        
        var tplStr =
                    '<table width="100%" class="rm-tablelayout">'+
                        '<tr>'+
                        '<td width="65%"><div class="rm-orgnametext"><span>{[this.accessLevel(values.Level)]}</span> {Name}</div></td>';
        
        
        if(this.config.selectDetails){
            tplStr +=      '<td width="33%"><div class="rm-nextgrayarrow rm-pricevalue rm-alignr rm-pr20">{[RM.AppMgr.formatCurrency(values.SalePrice)]}</div></td>';           
        }
        
        tplStr +=     '</tr>' +      
                    '</table>';
        
        this.add({
				xtype: 'rmlist',
				store: 'Items',
                loadingText: null,
                emptyText: 'No items found.',
				grouped: true,
                flex: 1,
				itemTpl: new Ext.XTemplate( 
                     tplStr,
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
			});
        
    }
    
});