Ext.define('RM.view.Modules', {
	extend: 'Ext.Container',
	xtype: 'modules',
	config: {		
        layout:{
            type: 'vbox'            
        },
        style: 'background:white',
		items: [
			{
				xtype: 'toolbar',                
				docked: 'top',
                //ui: 'rm-main-topbar',
				items: [
					{
                        xtype: 'component',
                        cls: 'rm-module-topbar-icon'
                    },{
                        xtype: 'spacer'
                    }, {
                        icon: 'resources/images/icons/rm-settings.svg',
                        itemId: 'options',
                        ui: 'rm_maintopbarbuttonright'
                    }
				]
			},{
                xtype: 'component',
                padding: '28 10 28 10',
                html: 'Your products',
                cls: 'rm-intromsg'
            },{
                xtype: 'dataview',
                flex: 1,
                baseCls: 'rm-moduletiles',
        		store: {
        			fields: ['ModuleCode', {name:'Activated', type:'bool'}, 'ShortName', 'FullName', 'Description', 'Image']
        		},    
                /*itemTpl: new Ext.XTemplate(
                    '<div ><img src="resources/images/{Image}-'+
                    '<tpl if="Activated == true">'+
                        'on'+                                            
                    '</tpl>'+ 
                   '<tpl if="Activated == false">'+
                        'off'+                                            
                    '</tpl>'+
                    '.svg" style= "width: 90px; height: 90px;">'+
                    '<div style= "color: #969696;">{ShortName}</div></div>'
                ),*/	
                itemTpl: new Ext.XTemplate(
                    '<div ><img src="resources/images/{Image}-on.svg" style= "width: 90px; height: 90px;">'+
                    '<div style= "color: #969696;">{ShortName}</div></div>'
                ),
                
            }     
        
        
		],
       
	} 
    
});
