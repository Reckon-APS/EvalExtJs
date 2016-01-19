Ext.define('RM.view.Bills', {
    extend: 'RM.component.SecurePanel',
    xtype: 'bills',
    requires: ['RM.component.SortSearchBar', 'RM.component.SecureButton'],
    config: {
        permissionFor: 'Bills',
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'component',
                html: 'Bills',
                cls: 'rm-topbartitle',
            }, {
                xtype: 'spacer'
            }, {
                text: 'Add',
                itemId: 'add',
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
                        { text: 'Amount', value: 'amount' },
                        { text: 'Supplier', value: 'supplier' }
            ]

        }
        ]
    }
});