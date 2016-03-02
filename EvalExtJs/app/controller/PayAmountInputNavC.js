Ext.define('RM.controller.PayAmountInputNavC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.PayAmountInputNav'],
    config: {
         refs: {  
            payAmountInputCalcPanel: 'payamountinputnav #payamountinputcalcpanel',           
            toolbarTitle: 'payamountinputnav #toolbarTitle',    
        }
    },
    
    showView: function(data){ 
        var me = this;
        this.getPayAmountInputCalcPanel().loadData(data, function(){
            me.clearFields();
            RM.ViewMgr.backTo('slidenavigationview');
        }, this);
        this.getToolbarTitle().setHtml('Joe Plumber');
    },
    
    clearFields: function(){
        this.getPayAmountInputCalcPanel().clearInputFieldAndHistory();
   	 this.getPayAmountInputCalcPanel().getDescriptionFld().setValue('');
    }    
});