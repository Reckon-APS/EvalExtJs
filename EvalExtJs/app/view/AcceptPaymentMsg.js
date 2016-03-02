Ext.define('RM.view.AcceptPaymentMsg', {
    extend: 'Ext.Panel',
    xtype: 'acceptpaymentmsg',
    config: {
		
        items: [
                   {
                            xtype: 'container',
                            layout: 'hbox',
                            height: 140,
                            cls: 'rm-emailpositivepanel',
                            items: [
                                {
                                    cls: 'rm-emailcheckmark',
                                    flex:1
                                },
                                {
                                    itemId: 'msgcont',
							        padding: 5,							        
                                    flex:3
                                }
                            ]
							
					},{
						xtype: 'button',
						text: 'CONTINUE',
						itemId: 'continue',
						cls: 'rm-emailscreenbtn'
					}
				]
	}
});