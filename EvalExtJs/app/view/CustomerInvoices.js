Ext.define('RM.view.CustomerInvoices', {
	extend: 'RM.component.SecurePanel',
	xtype: 'customerinvoices',
    requires: ['RM.component.SortSearchBar', 'RM.component.SecureButton'],
    config: {
		permissionFor: 'Invoices',
		layout: 'fit',
		items:[{
                    xtype: 'titlebar',
                    docked: 'top',
                    title: 'A Title',
                    itemId: 'title',
                    items: [{
        						itemId: 'back',
        						ui: 'rm_topbarbuttonleft',
        						width: '2.6em',
        						icon: 'resources/images/icons/rm-back.svg',
                                iconCls: 'rm-backbtniconcls',
                                align: 'left'
                            },{
        						text: 'Add',
        						itemId: 'add',
                                    align: 'right',
                                xtype: 'securebutton',
                                permissionFor: 'Invoices',
        						ui: 'rm_topbarbuttonright'
    					    }
                    ]
                },    
        
        /*  
        {
            xtype: 'toolbar',                
            docked: 'top',
            title: {
                title: 'A Title that is very long now ok',
                style: {
                    'text-align':'left'
                }
            },            
            items: [{
                    itemId: 'back',
                    ui: 'rm_topbarbuttonleft',
                    width: '2.6em',
                    docked: 'left',
                    icon: 'resources/images/icons/rm-back.svg'			
                },{
                    text: 'ADD',
                    itemId: 'add',
                    xtype: 'securebutton',
                    permissionFor: 'Invoices',
                    ui: 'rm_topbarbuttonright',
                    docked: 'right'
                }
            ]
        },*/{
				xtype: 'sortsearchbar',				
				docked: 'top',
				sortfields: [
                    {text: 'Due date',  value: 'duedate'},
					{text: 'Amount', value: 'amount'}					
				]
			}
        ] 
    }
});