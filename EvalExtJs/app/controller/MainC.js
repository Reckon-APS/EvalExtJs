Ext.define('RM.controller.MainC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.core.AppMgr'],	
    config: {
        refs: {
            mainView: 'mainview'            
        },
        control: {
            mainView: {                
                activeitemchange: 'onActivate'
            }
        }

    },
    
    init: function () {
        RM.AppMgr = RM.core.AppMgr;
        RM.AppMgr.init(this.getApplication());
    },
    
    onActivate: function (container, newView, oldView) {
        //console.log('active changed from ' + oldView.xtype + ' to ' + newView.xtype);
    }
});