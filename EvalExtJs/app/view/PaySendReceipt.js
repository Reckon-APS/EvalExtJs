Ext.define('RM.view.PaySendReceipt',{
    extend: 'RM.component.SecurePanel',
     xtype: 'paysendreceipt',
     config: {
        cls: 'rm-whitebg',
        layout: 'card',
        activeItem: 0,
        items:[{
                    xtype: 'toolbar',
                    docked: 'top',  
            		itemId: 'topbar',
                    items: [{
                            itemId: 'back',
                            ui: 'rm_topbarbuttonleft',
                            icon: 'resources/images/icons/rm-back.svg',
                            iconCls: 'rm-backbtniconcls',
                            width: '2.6em',
                            iconMask: 'true'
                        }, {
                            xtype: 'component',
                            itemId: 'toolbartitle',
                            html: '',
                            cls: 'rm-topbartitle'
                        },{
        					xtype:'spacer'
        				},{
            				text: 'Details',
            				itemId: 'details', 
                            width: '6em',
            				ui: 'rm_topbarbuttonright'
            			}
                    ]
        		},{
    				xtype:'container',                    
    				cls: 'rm-emailinvoicebackground',
    				items: [
    					{
    						xtype: 'container',
                            itemId: 'msgpanel',
    						layout: 'hbox',
    						height: 50,
    						cls: ['rm-whitebg','rm-p10'],
    						items: [
    							{
    								cls: ['rm-emailcheckmark','rm-iconsize25'],
    								flex:1
    							},{
    								itemId: 'title',
                                    cls: ['rm-pt5', 'rm-colorgreenoptions'],
                                    html: '',
    								flex:5
    							}
    						]
							
					},{
                        xtype: 'rmphonefield',
                        name: 'SMS',
                        clearIcon: false,
                        cls: 'rm-flatfield',
                        label: 'SMS receipt',                        
                        labelWidth: '7.5em',
                        placeHolder: 'enter'
                    },{
                        xtype: 'exttextfield',
                        name: 'Email',
                        clearIcon: false,
                        hidden: true,
                        cls: 'rm-flatfield',
                        label: 'Email receipt',
                        labelWidth: '7.5em',
                        placeHolder: 'enter'
                    },{
                        xtype: 'component',
                        itemId: 'emailcomponent',
                        html: 'To email receipts, use Preferences to set and verify your email address',
                        cls: 'rm-p10 rm-fontsize80 rm-colorgrey rm-whitebg rm-border-top'                        
                    },{
						xtype: 'button',						
						itemId: 'sendreceiptbtn',						
                        cls: ['rm-greenbtn-bg', 'rm-flatbtn'],
                        text: 'SEND RECEIPT'
					},{
						xtype: 'button',						
						itemId: 'dontsendreceiptbtn',
                        cls: ['rm-greybtn-bg', 'rm-flatbtn'],
						text: 'DON\'T SEND RECEIPT'                       
					}
				]
			},{
                xtype:'container',
				cls: 'rm-emailinvoicebackground',
				items: [
					{
						xtype: 'container',
						layout: 'hbox',
						height: 50,
						cls: ['rm-whitebg', 'rm-p10',],
						items: [
							{
								cls: ['rm-emailcheckmark','rm-iconsize25'],
								flex:1
							},{
								itemId: 'sentcont',
                                cls: ['rm-pt5', 'rm-colorgreenoptions'],
                                html: 'Email sent',
								flex:5
							}
						]
							
					},/*{
                      	xtype: 'component',
                          cls: 'rm-whitebg rm-p1015 rm-fontsize80 rm-colorgrey',                          
                          html: 'Check your Messages app on your device to see if it went through.'
                    },*/{
						xtype: 'button',
                        itemId: 'done',
                        cls: ['rm-greenbtn-bg', 'rm-flatbtn'],
						text: 'DONE'
					},{
                        xtype: 'button',
                        itemId: 'retry',
						cls: ['rm-greybtn-bg', 'rm-flatbtn'],                        
						text: 'RETRY'
                    }
				]
            }
         ] 
         
     }
});