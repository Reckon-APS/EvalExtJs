Ext.define('RM.view.PayRecvManualCard',{
    extend: 'Ext.Panel',
    xtype: 'payrecvmanualcard',
    config:{
        cls: 'rm-whitebg',
        layout: 'vbox',
        items: [
                     {
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
                                    xtype: 'component',
                                    html: 'A credit card transaction will be created but payment won\'t be processed.',            
                                    cls: ['rm-fontsize80', 'rm-pay-grayheadertext']
                                },
                                {
                                    xtype: 'extselectfield',
                                    cls: 'rm-flatfield',                                    
                                    autoSelect: false,  
                                    itemId: 'cardtype',
                                   /* store: 'TransactionMethods',
                                    displayField: 'Name',
            						valueField: 'Id',*/
                                    rmmandatory: true,
                                    label: 'Credit card type',
                                    name: 'PaymentMethodId',
                                    placeHolder: 'choose',
                                    labelWidth: '9em',                                   
                                    options: [                                   			
                                                {text: 'Visa',  value: 6},
                                                {text: 'Master Card', value: 7},
                                                {text: 'American Express',  value: 9},
                                    			{text: 'Other', value: 10}
                                            ]                                   
                                },
                                {
                                    xtype: 'extdatepickerfield',
                                    name: 'Date',
                                    rmmandatory: true,
                                    dateFormat : 'jS M Y',
                                    label: 'Date',
                                    cls: 'rm-flatfield'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'recordtransaction',
                                    text: 'RECORD TRANSACTION',
                                    cls: ['rm-greenbtn-bg', 'rm-flatbtn']
                                }
        /*
        {
                        xtype: 'formpanel',
                        itemId: 'payrecvmanualcardform',
                        flex: 1,
                        items:[
                                {
                                    xtype: 'component',
                                    html: 'A credit card transaction will be created but payment won\'t be processed.',            
                                    cls: ['rm-fontsize80', 'rm-pay-grayheadertext']
                                },
                                {
                                    xtype: 'extselectfield',
                                    cls: 'rm-flatfield',                                    
                                    autoSelect: false,  
                                    itemId: 'cardtype',
                                    label: 'Credit card type',
                                    name: 'PaymentMethodId',
                                    placeHolder: 'choose',
                                    labelWidth: '9em',                              
                                    options: [                                   			
                                                {text: 'Visa',  value: 'Visa'},
                                                {text: 'Master Card', value: 'MasterCard'},
                                                {text: 'American Express',  value: 'AmEx'},
                                    			{text: 'Other', value: 'Other'}
                                            ],
                                    
                                },
                                {
                                    xtype: 'extdatepickerfield',
                                    name: 'Date',
                                    dateFormat : 'jS M Y',
                                    label: 'Date',
                                    cls: 'rm-flatfield'
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'recordtransaction',
                                    text: '<span class="rm-btn-arrow">RECORD TRANSACTION</span>',
                                    cls: 'rm-photopreviewbtn',
                                }
                        ]
        }*/
        ]
    }    
});