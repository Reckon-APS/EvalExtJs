Ext.define('RM.view.BillBalanceBreakdown', {
    extend: 'Ext.Panel',
    xtype: 'billbalancebreakdown',
    config: {

        style: 'background: #FFF',
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
            }, {
                xtype: 'component',
                html: 'Breakdown of balance',
                cls: 'rm-topbartitle'
            }
            ]
        }, {
            xtype: 'component',
            itemId: 'breakdownCont',
            padding: 5,
            margin: 0
        }
        ]
    }
});