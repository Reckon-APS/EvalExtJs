Ext.define('RM.view.InvoiceActions', {
    extend: 'Ext.Panel',
    xtype: 'invoiceactions',
    config: {
        
        style: 'background: #FFF;',
		defaults: {xtype: 'button'},
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
					html: 'Invoice actions',
					cls: 'rm-topbartitle'
				}
            ]
        },{
            xtype: 'component',
            itemId: 'invoiceStatus',
            cls: 'rm-hearderbg'            
        },{
            xtype: 'component',            
            itemId: 'lockOffWarning',
            hidden: true,
            cls: 'rm-warning-message'
        },{
			text: 'Approve invoice',
			itemId: 'approve',
			cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-accept.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'	
            			
        },{
			text: 'Receive payment',
			itemId: 'pay',
			cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-receive.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'	
            			
        },{
            text: 'Mark as paid',
            itemId: 'markAsPaid',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-tick.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'

        }
        /*,{
			text: 'Receive payment with Pay',
			itemId: 'payApp',
			cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-receive.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'	
            			
        }*/,{
            text: 'Return to draft',
            itemId: 'draft',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-note.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'            			
        }, {
            text: 'Delete invoice',
            itemId: 'deleteInvoice',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-cross.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'
        }, {
			text: 'Email customer',
			itemId: 'email',
			cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-email.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'
           						
        },{
			text: 'View invoice history',
			itemId: 'history',
			cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-history.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'						
        }
        ]
    }
});
