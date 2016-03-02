Ext.define('RM.view.ForgotPassword', {
    extend: 'Ext.Panel',
    xtype: 'forgotpassword',
    config: {
        
		layout: 'card',
        style: 'background:#FFF;',
		activeItem: 0,        
		items: [{
				xtype:'panel',
                style: 'background: #FFFFFF',
				layout: {
					type: 'vbox',					
					pack: 'start',
					align: 'stretch'
				},
				items:[{
						xtype: 'toolbar',
						docked: 'top',
                        //ui: 'rm-main-topbar',
						items: [{								
								ui: 'rm_maintopbarbuttonleft',
								icon: 'resources/images/icons/rm-back.svg',
                                iconCls: 'rm-backbtniconcls',
                                width: '2.6em',								
								itemId: 'back'				
							},{
								xtype: 'component',
								html: 'Forgotten password',
								cls: 'rm-topbartitle'
							}
						]						
					},{
						xtype: 'component',
						html: 'Please enter your username and email to reset your password',
						cls: 'rm-resetpasswordmsg',
                        padding: '18 15 15 15'
					},
                    {
						xtype: 'exttextfield',
						itemId: 'username',
						label: 'Username',
                        rmmandatory: true,
                        labelWidth: '7em',
                        cls: 'rm-flatfield',
                        placeHolder: 'enter',
                        clearIcon: false
					},
                    {
						xtype: 'extemailfield',                        
						label: 'Email',
						itemId: 'email',
                        rmmandatory: true,
                        labelWidth: '5em',                        
						cls: 'rm-flatfield',                        
                        clearIcon: false, 
                        placeHolder: 'enter'             
					},{
						xtype: 'button',
						text: 'SEND',
                        itemId: 'send',
                        cls:'rm-loginbtn'						
					}
				]
			},{
				xtype:'container',
                style: 'background:#FFF;',
                items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            height: 106,
                            cls: 'rm-emailpositivepanel',
                            items: [
                                {
                                    cls: 'rm-emailcheckmark',
                                    flex:1
                                },
                                {
                                    itemId: 'successMsg',							        						        
                                    flex:5
                                }
                            ]
							
					},{
						xtype: 'button',
						text: 'CONTINUE',
						itemId: 'continue',
						cls: 'rm-emailscreenbtn'
					}
				]
				
			},{
				xtype:'container',
                style: 'background:#FFF;',
                items: [
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        height: 130,
                        cls: 'rm-emailnegativepanel',
                        items: [
                                {
                                    cls: 'rm-emailcrossmark',
                                    flex: 1
                                },
                                {
                                    itemId: 'failMsg',                                                            
                                    flex:5
                                }
                            ]

                    },{
						xtype: 'button',
						text: 'OK',
						itemId: 'ok',
						cls: 'rm-emailscreenbtn'
					}
				]
				
			}
		]		

    }
});