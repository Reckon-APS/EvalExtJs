Ext.define('RM.view.Main', {
    extend: 'Ext.Container',	
    xtype: 'mainview',
	config: {
		fullscreen: true,
		layout: 'card'
	},

    initialize: function () {
        this.callParent(arguments);
    }

});