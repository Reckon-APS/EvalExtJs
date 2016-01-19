Ext.define('RM.view.SupplierBills', {
    extend: 'RM.component.SecurePanel',
    xtype: 'supplierbills',
    requires: ['RM.component.SortSearchBar', 'RM.component.SecureButton'],
    config: {
        permissionFor: 'Bills',
        layout: 'fit',
        items: [{
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
            }, {
                text: 'Add',
                itemId: 'add',
                align: 'right',
                xtype: 'securebutton',
                permissionFor: 'Bills',
                ui: 'rm_topbarbuttonright'
            }
            ]
        }, {
            xtype: 'sortsearchbar',
            docked: 'top',
            sortfields: [
                { text: 'Due date', value: 'duedate' },
                { text: 'Amount', value: 'amount' }
            ]
        }
        ]
    }
});