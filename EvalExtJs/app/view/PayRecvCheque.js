Ext.define('RM.view.PayRecvCheque',{
    extend: 'RM.component.SecurePanel',
    xtype: 'payrecvcheque',
    config:{
        cls: 'rm-whitebg',
        layout: 'fit',
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
                    html: '',
                    cls: 'rm-topbartitle'
                },{
					xtype:'spacer'
				},{
    				text: 'Details',
    				itemId: 'details', 
                    width: '5em',
    				ui: 'rm_topbarbuttonright'
    			}
            ]
        },{
            xtype: 'formpanel',
            itemId: 'payrecvchequeform',
            defaults: {cls: 'rm-flatfield', placeHolder: 'enter', clearIcon: false},
            items: [
                    {
                        xtype: 'rmnumberfield',
                        label: 'Cheque number',
                        name: 'ChequeNumber',                        
                        labelWidth: '9em',
                        rmmandatory: true                        
                    },{
                        xtype: 'rmnumberfield',
                        label: 'BSB',
                        name: 'BSB'                                       
                    },/*{
                        xtype: 'rmnumberfield',
                        label: 'Account number',
                        name: 'AccountNumber',
                        //component: {type: 'text'},
                        //allowedCharacters: '-',		//to allow hyphen '-' in Account number field
                        labelWidth: '9em',
                        placeHolder: 'enter',
                        clearIcon: false,
                        cls: 'rm-flatfield'
                    },*/{
                            xtype: 'container',                                                                    
                            layout: 'hbox',
                            items: [{                            
                                html: 'Account number',
                                flex: 4,    
                                cls: 'rm-colorgrey rm-fontsize80 rm-fontweightbold',
                                style: 'padding-top: 0.9em; padding-left: 0.7em;'
                            },{
                                xtype: 'rmnumberfield',                                                    
                                name: 'AccountNumber',						    
                                placeHolder: 'number',
                                //maxLength: 8,
                                flex: 3,
                                border: '0 1 0 1 ',
                                style: 'border-color: #DBDBDB; border-style: solid;'
                            },
                            {
                                xtype: 'rmnumberfield', 
                                placeHolder: 'suffix',
                                //maxLength: 3,
                                name: 'AccountNumberSuffix',
                                flex: 2,
                                border: '0 0 0 0 '                            
                            }]
    						
    					},{
                        xtype: 'exttextfield',
                        label: 'Drawer',
                        itemId: 'drawer',
                        name: 'Drawer',
                        rmmandatory: true                        
                    },{
                        xtype: 'extdatepickerfield',
                        itemId: 'date',
                        name: 'Date',
                        rmmandatory: true,
                        dateFormat : 'jS M Y',
                        label: 'Date',
                        placeHolder: 'select'
                    },{
                        xtype: 'rmnumberfield',
                        name: 'ContactNumber',
                        label: 'Contact number',
                        labelWidth: '8.5em'
                    },{
                        xtype: 'exttextfield',
                        name: 'ContactName',
                        label: 'Contact name',
                        labelWidth: '7.5em'
                    },{
                        xtype: 'button',
                        itemId: 'charge',
                        cls: ['rm-greenbtn-bg', 'rm-flatbtn'],
                        text: 'RECORD TRANSACTION'                        
                    }
            ]
        }
        ]
    }    
});