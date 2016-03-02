Ext.define('RM.view.AcceptPaymentType', {
    extend: 'Ext.Panel',
    xtype: 'acceptpaymenttype',
    config: {
        
        layout: 'vbox',
        style: 'background: #FFF;',
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
                html: 'Payment type',
                cls: 'rm-topbartitle'
            }
            ]
        },{
			xtype: 'button',
			text: 'Credit',
			cls: 'rm-arrowimgbtn rm-paymenttype-btn-bg',            
            icon: 'resources/images/icons/rm-credit.svg',
            iconAlign: 'left',
            paymentType: RM.Consts.PaymentMethodTypes.CREDIT_CARD

		},{
			xtype: 'button',
			text: 'Cash',
			cls: 'rm-arrowimgbtn rm-paymenttype-btn-bg',			
			icon: 'resources/images/icons/rm-cash.svg',
			iconAlign: 'left',
			paymentType: RM.Consts.PaymentMethodTypes.CASH
		},{
			xtype: 'button',
			text: 'Cheque',
			cls: 'rm-arrowimgbtn rm-paymenttype-btn-bg',			
			icon: 'resources/images/icons/rm-cheque.svg',
			iconAlign: 'left',
			paymentType: RM.Consts.PaymentMethodTypes.CHEQUE
		}
        ]
    }
});