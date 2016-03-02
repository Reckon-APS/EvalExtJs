Ext.define('RM.view.settings.CoreSettings', {
    extend: 'Ext.Panel',
    xtype: 'coresettings',
    config: {
        layout: 'fit',
        style: 'background: #FFFFFF',
        items: [{
            xtype: 'toolbar',
            //ui: 'rm-main-topbar',
            docked: 'top',            
            items: [{
				ui: 'rm_maintopbarbuttonleft',
				icon: 'resources/images/icons/rm-back.svg',	
                iconCls: 'rm-backbtniconcls',
				itemId: 'back'				
			},{
                xtype: 'component',
                html: 'Core settings',
                cls: 'rm-topbartitle'
            }, {
                xtype: 'spacer'
            }, {
                text: 'Save',
                width: '4em',
                itemId: 'save',
                ui: 'rm_maintopbarbuttonright'
            }
                ]
        }, {
            xtype: 'formpanel',            
            itemId: 'settingsForm',
            defaults: {labelWidth: '6.5em'},
            padding: 0,
            items: [/*{
                    xtype: 'textfield',
                    name: 'ApiUrl',
                    label: 'Api Url'
                },*/{
                    xtype: 'selectfield',
                    name: 'ApiLocation',
                    label: 'Api Location',
                    usePicker: true,
                    options: [  
                        {text: 'Production', value: 'production'},
                        {text: 'Pre Production', value: 'preproduction'},
                        {text: 'Staging', value: 'staging'},
                        { text: 'QA Server', value: 'qaserver' },
                        {text: 'QQA Server', value: 'qqaserver' },
                        {text: 'Dev Server', value: 'devserver'},                                                
                        {text: 'Dev Local IIS',  value: 'devlocaliis'}
                    ]
                },{
                    xtype: 'selectfield',
                    name: 'ApiType',
                    label: 'Api Type',
                    usePicker: true,
                    options: [
                        {text: 'Normal',  value: 'normal'},
                        {text: 'Test', value: 'test'},
                        {text: 'Json',  value: 'json'}
                    ]
                }            
            ]
        },{
            xtype: 'toolbar',
            //ui: 'rm-main-topbar',
            docked: 'bottom',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'button',
                width: '7em',
                text: 'Upload logs',
                itemId: 'uploadLogs',
                ui: 'rm_maintopbarbuttonright'
            }
            //<debug>
            , {
                xtype: 'button',
                width: '7em',
                text: 'I Am The Law',
                itemId: 'iAmTheLaw',
                ui: 'rm_maintopbarbuttonright'
            }
            //</debug>
            ]
        }
        ]
    }
});
