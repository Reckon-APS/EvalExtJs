Ext.define('RM.view.PayTransRefund', {
    extend: 'Ext.Panel',
    xtype: 'paytransrefund',
    config: {
        cls: 'rm-whitebg',
        items: [{
            xtype: 'toolbar',
            docked: 'top',            
            items: [{
                    itemId: 'back',
                    ui: 'rm_topbarbuttonleft',
                    icon: 'resources/images/icons/rm-back.svg',
                    iconCls: 'rm-backbtniconcls',
                    width: '2.6em',
                    iconMask: 'true'
                }, {
                    xtype: 'component',
                    itemId: 'title',
                    html: 'Issue a refund',
                    cls: 'rm-topbartitle'
                }
            ]
        },{
            xtype: 'rmamountfield',
            cls: 'rm-flatfield',
            label: 'Amount to refund',
            itemId: 'amount',
            readOnly: true,
            labelWidth: '9em',
            placeHolder: 'enter'
        },{
            xtype: 'extselectfield',
            cls: 'rm-flatfield',
            autoSelect: false,
            itemId: 'reason',
            label: 'Reason',
            placeHolder: 'choose',
            options: [  
                        {text: 'Faulty',  value: 'Faulty'},
                        {text: 'Damaged', value: 'Damaged'},
                        {text: 'Change of mind',  value: 'Change of mind'},
            			{text: 'Warranty', value: 'Warranty'},
            			{text: 'Other', value: 'Other'}
                    ]
        },{
            xtype: 'exttextfield',
            itemId: 'notes',
            cls: 'rm-flatfield',
            label: 'Notes',
            clearIcon: false,
            placeHolder: 'enter'
        },{
            xtype: 'button',
            itemId: 'refund',
            cls: ['rm-greenbtn-bg', 'rm-flatbtn'],
            text: 'REFUND',
        }
        ]
    }
});
    