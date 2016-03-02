Ext.define('RM.view.PayTransDetails', {
    extend: 'Ext.Panel',
    xtype: 'paytransdetails',    
    config: {
        cls: 'rm-whitebg',        
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
                    width: '6em',
    				ui: 'rm_topbarbuttonright'
    			}
            ]
        },/*{
            xtype: 'rmamountfield',
            cls: 'rm-flatfield',
            itemId: 'amountfld',
            label: 'Amount',
            clearIcon: false,
            readOnly: true,
            //hidden: true
        },*/{
            xtype: 'extdatepickerfield',
            itemId: 'date',
            cls: 'rm-flatfield',
            dateFormat : 'jS M Y',
            readOnly: true,
            label: 'Paid on'
        },{
            xtype: 'exttextfield',
            itemId: 'cardno',
            clearIcon: false,
            readOnly: true,
            cls: 'rm-flatfield',
            label: 'Paid with'
        },{
            xtype: 'exttextfield',
            itemId: 'receiptno',
            clearIcon: false,
            readOnly: true,
            cls: ['rm-flatfield', 'rm-flatfield-last'],
            label: 'Receipt No.',
            labelWidth: '7em'            
        },{
            xtype: 'exttextfield',
            itemId: 'refundreceiptno',
            clearIcon: false,
            readOnly: true,
            hidden: true,
            cls: ['rm-flatfield', 'rm-flatfield-last'],
            label: 'Refund Receipt No.',
            labelWidth: '11em'            
        },{
            xtype: 'button',
            itemId: 'sendreceipt',
            cls: ['rm-greenbtn-bg', 'rm-flatbtn'],
            text: 'RE-SEND RECEIPT'
        },{
            xtype: 'button',
            itemId: 'refund',
            cls: ['rm-greybtn-bg', 'rm-flatbtn'],
            text: 'ISSUE REFUND'
        }
        ]
    }
});