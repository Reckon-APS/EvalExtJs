Ext.define('RM.controller.PayAmountInputBackC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.PayAmountInputBack'],
    config: {
        refs: {  
            payAmountInputBack: 'payamountinputback', 
            toolbarTitle: 'payamountinputback #toolbarTitle',           
            backBtn: 'payamountinputback #back',
            payAmountInputCalcPanel: 'payamountinputback #payamountinputcalcpanel'
        },
        control: {         
            'payamountinputback #back': {
                tap: 'back'  
            }
        }
    },
    
    showView: function(data, cb, cbs){               
        var view = this.getPayAmountInputBack();
        if (!view){
            view = { xtype: 'payamountinputback' };
        }         
        RM.ViewMgr.showPanel(view);
        this.getPayAmountInputCalcPanel().loadData(data, cb, cbs);
        this.getToolbarTitle().setHtml('Joe Plumber');
    },   
    
    back: function () {
        RM.ViewMgr.back();
    }    
    
});