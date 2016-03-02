Ext.define('RM.controller.CoreSettingsC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.settings.CoreSettings'],
    config: {
        refs: {
            coreSettings: 'coresettings',
            settingsForm: 'coresettings #settingsForm'
            //apiUrl: 'coresettings #apiUrl'
        },
        control: {
            'coresettings': {
                show: 'onShow'
            },
            'coresettings #back': {
                tap: 'onBack'
            },
            'coresettings #save': {
                tap: 'onSave'
            },
            'coresettings #uploadLogs': {
                tap: 'onUploadLogs'
            }
            //<debug>
            ,
            'coresettings #iAmTheLaw': {
                tap: 'onIAmTheLaw'
            }
            //</debug>
        }

    },

    showView: function () {

        var view = this.getCoreSettings();
        if (!view)
            view = { xtype: 'coresettings' };

        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        
        this.getSettingsForm().setValues(RM.AppMgr.getBaseApi());
    },

    onBack: function(){
        RM.ViewMgr.back();
    },
    
    onSave: function () {
        RM.AppMgr.setBaseApi(this.getSettingsForm().getValues());
        RM.ViewMgr.back();
    },

    onUploadLogs: function () {
        RM.EventMgr.uploadLogs();
        RM.ViewMgr.back();
    }

    //<debug>
    ,onIAmTheLaw: function() {
        RM.PermissionsMgr.allowEverything();
        RM.AppMgr.showSuccessMsgBox('All access granted.');
    }
    //</debug>

});