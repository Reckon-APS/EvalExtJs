Ext.define('RM.component.ChooseInvoiceItem', {
    requires: ['RM.component.Popup'],
    items: [{
        		xtype: 'component',
				html: 'Choose item to add',
                cls: 'rm-title'
			},{
				text: 'Item',
				itemId: 'item'                
			}
	
		],
    
    initialize: function(){
	},
	
	show: function(cb,cbs){        
        cb.call(cbs, this.items[1].itemId);
	},	
	
	hide: function(){
        RM.ViewMgr.deRegBackHandler();

	}
});