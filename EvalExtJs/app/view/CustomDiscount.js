Ext.define('RM.view.CustomDiscount', {
    extend: 'Ext.Panel',
    xtype: 'customdiscount',
	requires: ['RM.component.RMAmountField'],
    config: {
        
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{					
					ui: 'rm_topbarbuttonleft',
					icon: 'resources/images/icons/rm-back.svg',
                    iconCls: 'rm-backbtniconcls',
					itemId: 'back',
					width: '2.6em'
				},{
					xtype: 'component',
                    itemId: 'title',
					html: 'Custom discount',
					cls: 'rm-topbartitle'
				},{
					xtype:'spacer'
				},{
					text: 'Save',
					itemId: 'save',                    
					ui: 'rm_topbarbuttonright'
				}
            ]
        },{
            xtype: 'secureformpanel',
			//padding: 0,
			defaults: {labelWidth: 160},
			items: [{
                    xtype: 'component',
                    height: 1
                },{
					xtype: 'rmamountfield',
					itemId: 'percentDiscount',
					label: '% discount',
                    currencyMode: false,
                    decimalPlaces: 4,
                    prefix: '',
                    clearIcon: false,   
                    //cursorSimulate: true,
                    //readOnly: true,
                    minValue: 0,
                    //maxValue: 100,
                    cls: 'rm-flatfield',
					placeHolder: 'enter'
				},{
					xtype: 'rmamountfield',
					itemId: 'absoluteDiscount',
					label: '$ discount',
                    decimalPlaces: 2,
                    prefix: '$', 
                    clearIcon: false,   
                    //cursorSimulate: true,
                    //readOnly: true,
                    minValue: 0,
                    cls: 'rm-flatfield',
					placeHolder: 'enter',
                    border: '1 0 1 0',
                    style: 'border-color: #DBDBDB; border-style: solid;'
				}
			]
        } /*,{
			xtype:'dataentrykeypad',
			maskPin: true,
			docked: 'bottom'
		}*/
        ]
    }
});