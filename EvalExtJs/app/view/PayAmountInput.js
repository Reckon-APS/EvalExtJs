Ext.define('RM.view.PayAmountInput', {
        extend: 'Ext.Panel',
        xtype: 'payamountinput',
        requires: ['RM.component.CalcKeypad'],
        config: {
        cls: 'rm-whitebg',
        layout: 'vbox',            
        items:[
             /*{
                    xtype: 'toolbar',
                    docked: 'top',				
                    items: [{					
        						itemId: 'back',
        						ui: 'rm_topbarbuttonleft',
        						icon: 'resources/images/icons/rm-back.svg',
                                iconCls: 'rm-backbtniconcls',
                        		hidden: true,
                                width: '2.6em'						
							},
                             {
                                xtype: 'component',
                                html: '',
                                cls: 'rm-topbartitle',
                                itemId: 'toolbarTitle'
                            }
                         ]             
            },*/
            {
                                        xtype: 'container',
                                        docked: 'top',
                                        scrollable: 'horizontal',
                                        height: '3em',
                                        cls: 'rm-whitebg',
                                        layout: 'hbox',
                                        items: [
                                            {
                                                xtype: 'button',                                                
                                                cls: ['rm-white-flatbtn', 'rm-payamountinput-back-arrow'],
                                                itemId: 'historyshowbtn',
                                                docked: 'left'
                                            },
                                            {
                                                xtype: 'component',
                                                html: '0.00',
                                                itemId: 'amount',                                    
                                                cls: 'rm-pay-amount'                                                
                                            },{
                                                xtype: 'button',
                                                itemId: 'clearinputbtn',
                                                margin: 9,
                                                ui: 'plain', 
                                                iconCls: 'rm-btn-iconsize',
                                                icon: 'resources/images/icons/rm-fieldclear.svg',
                                                docked: 'right'                                        
                                            },{
                                                xtype: 'button',                                                
                                                cls: ['rm-white-flatbtn', 'rm-payamountinput-arrow'],
                                                itemId: 'historyhidebtn',
                                                hidden: true,
                                                docked: 'right'
                                            }                
                                        ]
            },
            {
                xtype: 'container',
                itemId: 'inputandhistorycontainer',
                flex: '1',
                layout: 'card',
                activeItem: 0,               
                items: [
                    {
                        xtype: 'container',
                        cls: 'rm-whitebg',
                        scrollable: 'vertical',
                        items: [        
                                    
                                {
                                    xtype: 'container',
                                    cls: ['rm-whitebg', 'rm-border-top'],
                                    height: '2.6em',
                                    layout: 'hbox',
                                    items: [
                                        {
                        				    xtype: 'exttextfield', 
                                            itemId: 'discount',
                                            readOnly: true,                        					
                        					cls: 'rm-flatfield',
                                            border: 0,
                                            clearIcon: false,  
                                            placeHolder: 'enter',
                                            flex: 1
                        				},{
                                            xtype: 'button',
                                            itemId: 'discountbtn',
                                            width: 72,
                                            cls: ['rm-white-flatbtn', 'rm-border-left', 'rm-pay-discountbtn']
                                        }                
                                    ]
                            },{                                                            
                                    xtype: 'container',                         
                                    cls: ['rm-border-bottom','rm-whitebg', 'rm-border-top'],
                                    height: '2.6em',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'exttextfield',
                                            itemId: 'descriptionfield',
                                            cls: 'rm-flatfield',
                                            border: 0,                                            
                                            clearIcon: false,
                                            readOnly: true,
                                            placeHolder: 'add optional description',
                                            flex: 1
                                        },{
                                            xtype: 'button',
                                            itemId: 'camerabtn',
                                            width: 72,
                                            cls: ['rm-white-flatbtn', 'rm-border-left', 'rm-pay-camerabtn']
                                        }                        
                                    ]
                        },{
                                    xtype: 'calckeypad',
                                    docked: 'bottom'  
                        },{                    
                                    xtype: 'button',
                                    itemId: 'charge',
                                    text: '<span class="rm-btn-arrow">CHARGE</span>',
                                    cls: 'rm-photopreviewbtn',
                                    docked: 'bottom'
                              
                        }
                ]
            }
            ,{
                   xtype: 'container',
                   cls: 'rm-whitebg',
                   scrollable: 'vertical',
                   html: 'History',
                   styleHtmlContent: true,
                   styleHtmlCls: ['rm-p10', 'rm-fontsize70', 'rm-pay-graytext', 'rm-border1px'],
                   itemId: 'historycontainer'
            }               
        ]
            }           
         ] 
    }
});
