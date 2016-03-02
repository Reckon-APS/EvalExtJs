Ext.define('RM.view.AddNote', {
    extend: 'Ext.Panel',
    xtype: 'addnote',
    config: {
        layout: 'fit',  
        items: [{
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
                    itemId: 'title',
					cls: 'rm-topbartitle'
				},{
					xtype:'spacer'
				},{
					text: 'Add',
					itemId: 'add',                    
					ui: 'rm_topbarbuttonright'

				}
            ]
        },{
			xtype: 'formpanel',
			padding: 0,
			items: [{
                xtype: 'textareafield',
    			itemId: 'notetext',
                autoCapitalize: true,
                clearIcon: false,
                cls: 'rm-addnotefield'
                //cls: 'rm-flatfield rm-inputel-alignl',                
            }]               
        }
        ]
    },
    
    initialize: function() {
        var field = this.down('#notetext'); 
        field.on(['keyup'], this.setTextAreaHeight, this);  
        field.element.down('textarea').setStyle('padding-bottom', (Ext.Viewport.element.getHeight() / 1.5) + 'px');                
    },    

    setTextAreaHeight: function() {
        var field = this.down('#notetext');                
        var textArea = field.element.down('textarea');
        var viewportHeight = Ext.Viewport.element.getHeight();
        var height = Math.max(viewportHeight, textArea.dom.scrollHeight);
        textArea.setHeight(height);         
    }
       
});