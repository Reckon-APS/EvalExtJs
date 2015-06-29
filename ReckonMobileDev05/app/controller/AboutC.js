Ext.define('RM.controller.AboutC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.About'],
    config: {
        refs: {
            about: 'about',
            version: 'about #version',
            apiVersion: 'about #apiVersion'
        },
        control: {
            about: { show: 'onShow'}
        }
    },
	
	showView: function(){

		var view = this.getAbout();
		if(!view){
			view = {xtype:'about'};
        }
		RM.ViewMgr.showPanel(view);		
	},
    
	onShow: function () {
        this.getVersion().setHtml('Version: ' + RM.AppMgr.getAppVersion());        
        this.getApiVersion().setHtml('Api Version: ' + RM.HomeSettingsMgr.getSetting('ApiVersion') || 'unknown');
    }

});