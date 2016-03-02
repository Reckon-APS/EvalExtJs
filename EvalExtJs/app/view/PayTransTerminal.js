Ext.define('RM.view.PayTransTerminal',{
    extend: 'RM.component.SecurePanel',
    xtype: 'paytransterminal',
    config: {
        cls: 'rm-whitebg',  
        layout: 'fit',
		items:[{
                    xtype: 'toolbar',
                    docked: 'top',            
                    items: [{
                            itemId: 'back',
                            ui: 'rm_topbarbuttonleft',
                            icon: 'resources/images/icons/rm-back.svg',
                            iconCls: 'rm-backbtniconcls',
                            width: '2.6em',
                            iconMask: 'true'
                        },{
                            xtype: 'component',
                            itemId: 'title',
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
                xtype: 'container',
                layout: 'card',
                itemId: 'terminalContainer',
                activeItem: 0,
                defaults: {
                    cls: 'rm-paybg'
                },
                items: [
                            {
                            xtype: 'container',                            
                            layout: 'vbox',
                            align: 'center',
                            items:[                    
                                {
                                    xtype: 'img',
                                    src: 'resources/images/icons/rm-update-icon.svg',
                                    height: 70,
                                    width: 70,
                                    margin: '60px auto 15px auto'                        
                                },{
                                    xtype: 'component',
                                    html: 'No device detected', 
                                    cls: 'rm-pay-text-big', 
                                    margin: '10 0 10 0'
                                },{
                                    xtype: 'component',
                                    html: 'No Reckon Pay device detected. <br>Please insert a device and try again.',
                                    cls: ['rm-update-msg', 'rm-lineheight180'],  
                                    margin: '0 0 25 0'
                                }             
                            ]                  
                        },{
                            xtype: 'container',                            
                            layout: 'vbox',
                            align: 'center',
                            items:[                    
                                {
                                    xtype: 'img',
                                    src: 'resources/images/icons/rm-update-icon.svg',
                                    height: 70,
                                    width: 70,
                                    margin: '30px auto 15px auto'                        
                                },{
                                    xtype: 'component',
                                    html: 'Insert Chip', 
                                    cls: 'rm-pay-text-big'                                    
                                },{
                                    xtype: 'component',
                                    html: 'OR',                                   
                                    style: 'text-align: center; color: #D4D4D4;',
                                    margin: '10px 0px 0px 0px' 
                                    
                                },{
                                    xtype: 'img',
                                    src: 'resources/images/icons/rm-update-icon.svg',
                                    height: 70,
                                    width: 70,
                                    margin: '25px auto 15px auto'                  
                                },{
                                    xtype: 'component',
                                    html: 'Swipe Card',
                                    cls: 'rm-pay-text-big'                                    
                                },{
                                    xtype: 'container',
                                    layout: 'hbox',
                                    cls: 'rm-greybg',
                                    items: [{
                                        xtype: 'img',
                                        src: 'resources/images/icons/rm-update-icon.svg',
                                        height: 70,
                                        width: 70,
                                        margin: '15px 10px'
                                    },{
                                        xtype: 'component',
                                        html: 'Tap for payment if <br>supported by your device',
                                        style: 'color: #FFF;',
                                        margin: '25px 0 25px 0'
                                    }]
                                }             
                            ]   
                        },{
                            xtype: 'container',                            
                            items: [{
                                xtype: 'component',
                                html: 'Total amount',
                                cls: ['rm-alignc', 'rm-pay-text-big'],
                                margin: '80 0 10 0'
                            },{
                                xtype: 'component',
                                html: '$14.60',
                                cls: ['rm-alignc', 'rm-pay-amount-text'],
                                margin: '20 0 80 0'
                            },{
                                xtype: 'component',
                                html: 'Please enter your PIN<br>to confirm payment',
                                cls: ['rm-alignc', 'rm-pay-text-big' ]
                            }
                            
                            ]
                        },{
                            xtype: 'container',
                            items: [{
                                    xtype: 'img',
                                    src: 'resources/images/icons/rm-update-icon.svg',
                                    height: 70,
                                    width: 70,
                                    margin: '25px auto 15px auto'  
                            },{
                                xtype: 'component',
                                html: 'You have entered your PIN<br>incorrectly too many times',
                                cls: ['rm-alignc' ]
                            },{
                                xtype: 'button',
                                text: '<span>EXIT</span>',
                                cls: 'rm-photopreviewbtn',
                                docked: 'bottom'                                
                            },{
                                xtype: 'button',
                                text: '<span class="rm-btn-arrow">CHANGE PAYMENT TYPE</span>',
                                cls: 'rm-photopreviewbtn',
                                docked: 'bottom'
                            }]
                        },{
                            xtype: 'container',
                            items: [{
                                        xtype: 'container',
                                        margin: '70px 50px',
                                        layout: 'hbox',
                                        items: [
                                                {                                    
                                                xtype: 'img',
                                                src: 'resources/images/icons/rm-update-icon.svg',
                                                height: 70,
                                                width: 70,
                                                  
                                                                          
                                            },{
                                                xtype: 'component',
                                                html: 'Transaction<br>Successful',
                                                cls: ['rm-colorgreen', 'rm-fontsize120', 'rm-fontweightbold', 'rm-lineheight180'],
                                                margin: '-5 15 15 15'                                                
                                            }
                                        ]
                                    },{
                                                xtype: 'component',
                                                html: 'Please remove the card',
                                                cls: ['rm-alignc', 'rm-pay-text-big' ]
                                    }
                            ]
                        }
                ]
            } 
        
        ]
    }
});
