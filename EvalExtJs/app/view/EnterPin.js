Ext.define('RM.view.EnterPin', {
    extend: 'Ext.Panel',
    xtype: 'enterpin',
    requires: ['RM.component.PinKeypad', 'RM.component.DropdownOverlay'],
    config: {
        style: 'background: #fff',
        
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            //ui:'rm-main-topbar',
            
            items: [
            {
                        xtype: 'component',
                        cls: 'rm-module-topbar-icon'
            },
            {
                xtype: 'spacer'
            }, {                
                icon: 'resources/images/icons/rm-settings.svg',
                itemId: 'options',                
                ui: 'rm_maintopbarbuttonright'
            }
            ]
        },{
            xtype: 'component',
            html: 'Please enter your PIN',
            padding: '20 15 5 15',
            cls: 'rm-pinheader'
        }, {
            xtype: 'component',
            itemId: 'msg',
            padding: '5 15 10 15',
            cls: 'rm-intromsg'
        }, {
            xtype: 'pinkeypad',
            maskPin: true,
            docked: 'bottom'
        }
        ]
    }
});