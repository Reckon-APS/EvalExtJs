Ext.define('RM.controller.ModuleSignupC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.ModuleSignup'],
    config: {
        refs: {
            moduleSignup: 'modulesignup'
        },
        control: {
            'modulesignup #back': {
                tap: 'onBack'
            },
            'modulesignup #signup': {
                tap: 'onSignup'
            }
        }

    },
    
	showView: function(moduleId){

		var view = this.getModuleSignup();
		if(!view){
			view = {xtype:'modulesignup'};
        }
		RM.ViewMgr.showPanel(view);		
		
	},	    

    onBack: function(){
        RM.ViewMgr.back();
    },
    
    onSignup: function(){
        RM.ViewMgr.back();
    }
    
});    