Ext.define('RM.controller.AppStopC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.AppStop'],

    config: {
        refs: {
            appStop: 'appstop'
        },
        control: {            
            'appstop #update':{
                tap: 'onUpdate'
            }
        }
    },

    showView: function (stopErr) {
        this.stopErr = stopErr;
        RM.ViewMgr.showPanel2({xtype:'appstop'});
    },    
    
    onUpdate: function() {
        if (Ext.os.is.Android) {
            window.open(this.stopErr.AndroidUpgradeUrl,'_system');
        }
        if(Ext.os.is.iOS){
            window.open(this.stopErr.IosUpgradeUrl);            
        }
    }
});