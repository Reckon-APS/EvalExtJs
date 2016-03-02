Ext.define('RM.view.PayPreferences',{
    extend: 'Ext.Panel',
    xtype: 'paypreferences',    
    config:{ 
        cls: 'rm-whitebg',       
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',            
                items: [
                             {
                                xtype: 'component',
                                itemId: 'title',
                                html: 'Preferences',
                                cls: 'rm-topbartitle'
                            },{
            					xtype:'spacer'
            				},{
                                xtype: 'button',
                				text: 'Save',
                				itemId: 'save', 
                                width: '4em',
                				ui: 'rm_topbarbuttonright'
                			}
                ]
            },
            {
                xtype: 'formpanel',
                itemId: 'preferencesform',
                layout: 'vbox',
                scrollable: 'vertical',
                cls: 'rm-whitebg',
                items:[                
                    /*{            
            			xtype: 'rmcheckbox',	
                        name: 'IncludeSurcharge',
                        itemId: 'includesurcharge',
            			border: 0,
                        text: 'Include surcharge',
            			labelCls: 'rm-paypreferences-leftalign rm-pref-headingtitle rm-fontweightbold rm-fontsize80',						
            			cls: 'rm-pl15 rm-checkbox-rightalign',
                        margin: '20 0 10 0',
                        value: false
                    },{
                        xtype: 'extselectfield',
                        hidden: true,
                        name: 'SurchargeType',
                        cls: ['rm-flatfield', 'rm-flatfield-fontweightnormal', 'rm-pl5'],
                        border: 0,                        
                        label: 'Surcharge type',
                        labelWidth: '8em',
                        placeHolder: 'choose',
                        options: [
                                    {text: 'Percentage',  value: 'Percentage'},
                                    {text: 'Amount', value: 'Amount'}
                                ]
                    },{
                        xtype: 'rmamountfield',
                        hidden: true,
                        name: 'SurchargeAmount',  
                        placeHolder: 'enter',
                        cls: ['rm-flatfield', 'rm-flatfield-last', 'rm-flatfield-fontweightnormal', 'rm-pl5'],
                        border: '0',
                        label: 'Surcharge amount',
                        labelWidth: '12em',                                                
                        clearIcon: false,            
                        placeHolder: 'enter'
                    },{
                  	  xtype: 'extnumberfield',
                        hidden: true,
                        name: 'SurchargePercentage',
                        placeHolder: 'enter',
                        cls: ['rm-flatfield', 'rm-flatfield-last', 'rm-flatfield-fontweightnormal', 'rm-pl5', 'rm-percentagefield'],                        
                        border: '0',
                        label: 'Surcharge percentage',
                        labelWidth: '12em',                                              
                        clearIcon: false,            
                        placeHolder: 'enter'
                    },{
                        xtype: 'component',                        
                        cls: 'rm-flatfield-last'
                    },*/{
                        xtype: 'component',
                        cls: ['rm-pl15', 'rm-fontweightbold', 'rm-pref-headingtitle', 'rm-fontsize80'],
                        html: 'Email settings',
                        margin: '15 0 0 0'
                    },{
                        xtype: 'extemailfield',
                        name: 'Email',
                        placeHolder: 'enter',
                        clearIcon: false,
                        border: 0,
                        label: 'Your email address',
                        cls: ['rm-flatfield', 'rm-flatfield-fontweightnormal', 'rm-pl5'],
                        labelWidth: '10em'
                    },{
                        xtype: 'component',
                        html: 'Email verified',
                        cls: 'rm-fontsize70 rm-pl15 rm-pb5 rm-colorblack'
                    },/*{
                        xtype: 'component',
                        html: 'Resend verification email',
                        margin: '0 0 10 0',
                		cls: ['rm-pl15', 'rm-linkbtn', 'rm-fontsize70'],
                        listeners: {
							tap: {
								element: 'element',                    
								fn: function () { 
                                    RM.AppMgr.showSuccessMsgBox('We\'ve sent you an email.<br>Please check your inbox and click the link in the email to verify the new email address.');	                        
								}
							}
						}
                    },*/{            
            			xtype: 'rmcheckbox',	
                        name: 'Bcc',
                        itemId: 'includebcc',
            			border: 0,
                        text: 'Send copy of receipt to above email',
            			labelCls: 'rm-paypreferences-leftalign rm-fontsize80 rm-pref-headingtitle',						
            			cls: 'rm-pl15 rm-checkbox-rightalign',
                        margin: '0 0 10 0',
                        value: false
                    },{
                        xtype: 'exttextfield',
                        name: 'NameToShow',
                        placeHolder: 'enter',
                        cls: ['rm-flatfield', 'rm-flatfield-fontweightnormal', 'rm-flatfield-last', 'rm-pl5'],
                        clearIcon: false,
                        label: 'Name to show',
                        border: '0 0 1 0',
                        labelWidth: '8em'
                    },{
                        xtype: 'component',
                        cls: ['rm-pl15', 'rm-fontweightbold', 'rm-pref-headingtitle', 'rm-fontsize80'],
                        html: 'Receipt settings',
                        margin: '15 0 0 0'
                    },{
                        xtype: 'exttextfield',
                        name: 'ReceiptPrefix',
                        placeHolder: 'enter',
                        autoCapitalize: true,
                        clearIcon: false,
                        border: 0,
                        label: 'Receipt prefix',
                        value: 'REC',
                        maxLength: 3,
                        cls: ['rm-flatfield', 'rm-flatfield-fontweightnormal', 'rm-pl5'],
                        labelWidth: '8em'
                    },
                	{
                        xtype: 'rmphonefield', //to show leading zeros in number e.g. 0001. number field ignores leading zeros
                        name: 'NextReceiptNumber',
                        placeHolder: 'enter',
                        cls: ['rm-flatfield', 'rm-flatfield-fontweightnormal', 'rm-flatfield-last', 'rm-pl5'],
                        clearIcon: false,
                        label: 'Next receipt number',
                        border: '0 0 1 0',
                        maxLength: 6,	//Not working, Sencha bug
                        value: '0001',
                        labelWidth: '9em'                        
                    },
                	{            
            			xtype: 'rmcheckbox',
                        itemId: 'reckonpaydevice',
                        name: 'ReckonPayDevice',
                        value: false,
                        margin: '15 0 0 0',
                        text: 'I have a Reckon Pay device',
            			labelCls: 'rm-paypreferences-leftalign rm-pref-headingtitle rm-fontweightbold rm-fontsize80',								
            			cls: 'rm-pl15 rm-checkbox-rightalign'            			
                    },
                	{
                        xtype: 'component',
                        html: 'What is a Reckon Pay device?',
                        width: '18em',
                        cls: ['rm-pl15', 'rm-linkbtn', 'rm-mt-10', 'rm-fontsize70'],
                        listeners: {
							tap: {
								element: 'element',                    
								fn: function () { 
									window.open(RM.HomeSettingsMgr.getSetting('AppInfoUrl'), '_blank', 'location=no');                        
								}
							}
						}
                    }
                ]
            }
        
        ]
    }
});