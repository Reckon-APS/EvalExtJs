Ext.define('RM.controller.PayTransTerminalC',{
    extend: 'Ext.app.Controller',
    requires: 'RM.view.PayTransTerminal',
     config: {
        refs: {
            payTransTerminal: 'paytransterminal',
            payTransTerminalTitle: 'paytransterminal #title'
        },
        control: {
            'paytransterminal #back': {
                tap: 'back'
            },
            'paytransterminal #details': {
                tap: 'onDetailsTap'
            }
        }
     },
    
    showView: function (data, callback, callbackScope) {
        this.data = data;
        this.callback = callback;
        this.callbackScope = callbackScope;
        var view = this.getPayTransTerminal();
        if (!view){
            view = { xtype: 'paytransterminal' };
        }       
        RM.ViewMgr.showPanel(view);
        this.getPayTransTerminalTitle().setHtml('$' + data.Total);
    },
    
    onDetailsTap: function(){
        RM.PayMgr.showScreen('PayAmountDetails', this.data);
    },
    
    back: function () {
        RM.ViewMgr.back();
    }    
});