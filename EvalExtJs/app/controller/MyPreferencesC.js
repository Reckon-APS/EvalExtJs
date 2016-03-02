Ext.define('RM.controller.MyPreferencesC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.settings.MyPreferences'],
    config: {
        refs: {
            myPreferences: 'mypreferences'
        },
        control: {
            'mypreferences #back': {
                tap: 'onBack'
            },
            'mypreferences #save': {
                tap: 'onSave'
            },               
            'mypreferences #coreSettings': {
                tap: 'onCoreSettings'
            }
            
        }

    },
    
	showView: function(){

		var view = this.getMyPreferences();
		if(!view){
			view = {xtype:'mypreferences'};
        }
		RM.ViewMgr.showPanel(view);		
		
	},	    

    onBack: function(){
        RM.ViewMgr.showDashboard({ type: 'slide', direction: 'right'});
    },
    
    onSave: function(){
        RM.ViewMgr.showDashboard({ type: 'slide', direction: 'right'});
    },
    
    onCoreSettings: function () {
        RM.ViewMgr.showCoreSettings();
    }

});