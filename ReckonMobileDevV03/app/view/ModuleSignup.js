Ext.define('RM.view.ModuleSignup', {
	extend: 'Ext.Panel',
	xtype: 'modulesignup',
	config: {
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
				ui: 'rm-main-topbar',
				items: [
					{
						ui: 'rm_maintopbarbuttonleft',
						icon: 'resources/images/icons/rm-back.png',
						width: '2.6em',						
						itemId: 'back'
					},{
						xtype: 'component',
						html: 'Module Signup',
						cls: 'rm-topbartitle'
					}, {
						xtype: 'spacer'
					}, {
						text: 'SIGN UP',
						itemId: 'signup',
                        width: '5em',
						ui: 'rm_maintopbarbuttonright'
					}
				]
			},{
				xtype: 'component',
				padding: 5,
				html: 'Module signup to go here'

			}
		]
	}
});