Ext.define('RM.view.EnterUsername', {
	extend: 'Ext.Panel',
	xtype: 'enterusername',
	requires: ['Ext.form.Panel', 'Ext.field.Password'],
	config: {
		
		style: 'background: #FFF',	
		items: [
			{
				xtype: 'toolbar',                
				docked: 'top',
                //ui: 'rm-main-topbar',
				items: [
					{
                        xtype: 'component',
                        cls: 'rm-module-topbar-icon'
                    }, {
						xtype: 'spacer'
					}, {
						
						icon: 'resources/images/icons/rm-settings.svg',                     
						itemId: 'options',
						ui: 'rm_maintopbarbuttonright'
					}
				]
			},{
				xtype: 'formpanel',
                
				padding: 0,
				height: 182,
				items: [{
                            xtype: 'component',
                            //html: 'Welcome to Reckon Mobile.',
                            html: 'Free signup at our Reckon One website.',                            
                            height: '90px',
                            padding: '40 10 34 10',
                            cls: 'rm-intromsg'
                    },
					{
						xtype: 'textfield',
						name: 'UserName',
						label: 'Username',
                        labelWidth: '6em',
                        cls: 'rm-flatfield',
                        placeHolder: 'enter',
                        clearIcon: false
					},{
						xtype: 'passwordfield',
						name: 'Password',
						label: 'Password',
                        labelWidth: '6em',
                        cls: 'rm-flatfield',
                        placeHolder: 'enter',
                        clearIcon: false
					}
				]
			},{
				xtype:'button',
				text: 'LOGIN',
				itemId: 'login',
                cls:'rm-loginbtn'
			}
		]
	}
});