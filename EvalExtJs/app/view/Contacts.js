Ext.define('RM.view.Contacts', {
   extend: 'RM.component.SecurePanel',
	xtype: 'contacts',
    requires: ['RM.component.RMList', 'RM.component.SecureButton'],
    config: {
		permissionFor: 'Contacts',
		layout: 'fit',
		items:[{
                xtype: 'toolbar',                
                docked: 'top',
                items: [{
						xtype: 'component',
						html: 'Contacts',
						cls: 'rm-topbartitle'
					}, {
						xtype: 'spacer'
					}, {
                        xtype: 'securebutton',
                        permissionFor: 'Contacts',
						text: 'Add',
						itemId: 'add',                        
						ui: 'rm_topbarbuttonright'
					}
                ]
            },{
				xtype: 'sortsearchbar',				
				docked: 'top',
                sortfields: [
					{text: 'All',  value: 'CustomerSuppliers'},
					{text: 'Customers', value: 'Customers'},
					{text: 'Suppliers',  value: 'Suppliers'}
				]
			},{
				xtype: 'rmlist',
				store: 'Contacts',
                grouped: true,
                loadingText: null,
                emptyText: 'No contacts found.',
                itemTpl: '<div class="rm-nextgrayarrow rm-orgnametext rm-textlimit rm-mr5">{Description} </div>'  				
			}
        ] 
    }
});