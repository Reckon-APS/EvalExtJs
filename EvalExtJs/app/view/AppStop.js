Ext.define('RM.view.AppStop', {
    extend: 'Ext.Panel',
    xtype: 'appstop',
    config: {  
        cls: 'rm-whitebg',      
        items: [
            {
                xtype: 'toolbar',                
                docked: 'top',
                //ui: 'rm-main-topbar',
                items: [
                    {
                        xtype: 'component',
                        cls: 'rm-module-topbar-icon'
                    } 
                ]
            },{
                xtype: 'container',
                cls: 'rm-whitebg',
                layout: 'vbox',
                align: 'center',
                items:[                    
                    {
                        xtype: 'img',
                        src: 'resources/images/icons/rm-update-icon.svg',
                        height: 40,
                        width: 40,
                        margin: '25px auto'                        
                    },{
                        xtype: 'component',
                        html: 'A new update has been released!', 
                        cls: 'rm-update-title', 
                        margin: '-8 0 5 0'
                    },{
                        xtype: 'component',
                        html: 'Click below to update for security & stability.',
                        cls: 'rm-update-msg',  
                        margin: '0 0 25 0'
                    },{
                        xtype: 'button',
                        itemId: 'update',
                        text: 'Update app >',
                        cls: 'rm-photopreviewbtn',
                        border: '1 0 1 0',
                        style: 'border-color: #DBDBDB; border-style: solid;'	
                    }              
                ]                  
            }     
        ]
    }
});
