Ext.define('RM.view.AcceptPayment', {
    extend: 'Ext.Panel',
    xtype: 'acceptpayment',
    requires: ['RM.component.RMAmountField'],
    config: {
        
        style: 'background:#FFFFFF',
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',            
            items: [{
                itemId: 'back',
                ui: 'rm_topbarbuttonleft',
                icon: 'resources/images/icons/rm-back.svg',
                iconCls: 'rm-backbtniconcls',
                width: '2.6em'                
            }, {
                xtype: 'component',
                html: 'Receive payment',
                cls: 'rm-topbartitle'
            }, {
                xtype: 'spacer'
            }, {
                //text: 'Pay',
                text: 'Save',
                itemId: 'pay',                
                ui: 'rm_topbarbuttonright'
            }
            ]
        },{
			xtype: 'secureformpanel',
			padding: 0,
			items: [
                {
					xtype: 'extdatepickerfield',
					name : 'TransactionDate',
					dateFormat : 'jS M Y',        //'D, d F Y',
					placeHolder: 'select',
					label : 'Payment Date',
                    labelWidth: '9em',
                    cls: 'rm-flatfield',
                    ui : 'plain',
                    rmmandatory: true
				},
                {
					xtype: 'rmamountfield',
					name: 'AmountPaid',
					label: 'Amount',
                    rmmandatory: true,
                    labelWidth: '5em',
					cls: 'rm-flatfield',				                
					clearIcon: false,
					placeHolder: 'Enter',
                    decimalPlaces: 2,
                    prefix: '$'
				},{
					xtype: 'extselectfield',
					label: 'Bank account',
                    rmmandatory: true,
                    labelWidth: '7em',
					usePicker: true,
					name: 'BankAccountId',
					store: 'BankAccounts',
					displayField: 'Description',
					valueField: 'BankAccountId',
                    autoSelect: false,
					placeHolder: 'Select',
					cls: 'rm-flatfield',
					ui: 'plain'
				},{
                    xtype: 'exttextfield',
                    name: 'Reference',
                    label: 'Reference',                    
                    cls: 'rm-flatfield',
                    placeHolder: 'enter',
                    clearIcon: false
                },{
					xtype: 'extselectfield',
					label: 'Payment method',
                    //rmmandatory: true,
                    labelWidth: '9em',
					usePicker: true,
					name: 'PaymentMethodId',
					store: 'PaymentMethods',
					displayField: 'Description',
					valueField: 'PaymentMethodId',
                    autoSelect: false,
					placeHolder: 'Select',
					cls: 'rm-flatfield',
					ui: 'plain',
                    border: '1 0 1 0',
                    style: 'border-color: #DBDBDB; border-style: solid;'	                    
				}
			]
		}
       ]
    }
});