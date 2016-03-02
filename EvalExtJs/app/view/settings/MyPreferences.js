Ext.define('RM.view.settings.MyPreferences', {
	extend: 'Ext.Panel',
	xtype: 'mypreferences',
	config: {
		items: [
			{
				xtype: 'toolbar',
				docked: 'top',
                //ui: 'rm-main-topbar',
				items: [
					{
						ui: 'rm_maintopbarbuttonleft',
						iconCls: 'rm-backbtniconcls',
                        width: '2.6em',
						icon: 'resources/images/icons/rm-back.svg',
						itemId: 'back'
					},{
						xtype: 'component',
						html: 'My preferences',
						cls: 'rm-topbartitle'
					}, {
						xtype: 'spacer'
					}, {
						text: 'Save',
						itemId: 'save',
                        ui: 'rm_maintopbarbuttonright'
					}
				]
			},{
				xtype: 'component',
				padding: 5,
				html: 'My Preferences'

			},{
				xtype: 'toolbar',
				docked: 'bottom',
                //ui: 'rm-main-topbar',
				items: [
					{
						xtype: 'spacer'
					}, {
						xtype: 'button',
						text: 'Core settings',
						itemId: 'coreSettings',
						ui: 'rm_maintopbarbuttonright'
					}
				]
			}
		]
	}
});