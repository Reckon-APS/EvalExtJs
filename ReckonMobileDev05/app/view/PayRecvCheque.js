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
            items: [
                    {
                        xtype: 'exttextfield',
                        label: 'Cheque number',
                        name: 'ChequeNumber',
                        placeHolder: 'enter',
                        labelWidth: '12em',
                        clearIcon: false,
                        cls: 'rm-flatfield'
                    },{
                        xtype: 'extnumberfield',
                        label: 'BSB',
                        name: 'BSB',
                        placeHolder: 'enter',
                        clearIcon: false,
                        cls: 'rm-flatfield'
                    },{
                        xtype: 'extnumberfield',
                        label: 'Account number',
                        name: 'AccountNumber',
                        labelWidth: '9em',
                        placeHolder: 'enter',
                        clearIcon: false,
                        cls: 'rm-flatfield'
                    },{
                        xtype: 'exttextfield',
                        label: 'Drawer',
                        itemId: 'drawer',
                        name: 'Drawer',
                        clearIcon: false,
                        placeHolder: 'enter',
                        cls: 'rm-flatfield'
                    },{
                        xtype: 'extdatepickerfield',
                        itemId: 'date',
                        name: 'Date',
                        dateFormat : 'jS M Y',
                        label: 'Date',
                        cls: 'rm-flatfield'
                    },{
                        xtype: 'button',
                        itemId: 'charge',
                        text: '<span class="rm-btn-arrow">CHARGE</span>',
                        cls: 'rm-photopreviewbtn',
                    }
            ]
        }
        ]
    }    
});