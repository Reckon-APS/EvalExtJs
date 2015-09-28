Ext.define('RM.view.ExpenseActions', {
    extend: 'Ext.Panel',
    xtype: 'expenseactions',
    config: {
        style: 'background: #FFF;',
        defaults: { xtype: 'button' },
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                ui: 'rm_topbarbuttonleft',
                icon: 'resources/images/icons/rm-back.svg',
                iconCls: 'rm-backbtniconcls',
                width: '2.6em',
                itemId: 'back'
            }, {
                xtype: 'component',
                html: 'Expense actions',
                cls: 'rm-topbartitle'
            }
            ]
        }, {
            xtype: 'component',
            itemId: 'expenseStatus',
            cls: 'rm-hearderbg'
        }, {
            xtype: 'component',
            itemId: 'lockOffWarning',
            hidden: true,
            cls: 'rm-warning-message'
        }, {
            text: 'Approve expense claim',
            itemId: 'approve',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-accept.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'
        }, {
            text: 'Return to draft',
            itemId: 'draft',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-note.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'            			
        }, {
            text: 'Delete expense claim',
            itemId: 'deleteExpense',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-cross.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'
        }, {
            text: 'Email expense claim',
            itemId: 'email',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-email.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'
        }, {
            text: 'View expense claim history',
            itemId: 'history',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-history.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'
        }, {
            text: 'Return to expense list',
            itemId: 'returnToList',
            cls: 'rm-arrowimgbtn rm-invoiceaction-bg rm-invoiceactionbtnlabel',
            icon: 'resources/images/icons/rm-returntolist.svg',
            iconCls: 'rm-invoiceactioniconcls',
            iconAlign: 'left'
        }]
    }
});
