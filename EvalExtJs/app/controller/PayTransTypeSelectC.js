Ext.define('RM.controller.PayTransTypeSelectC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.PayTransTypeSelect'],
    config: {
        refs: {
            payTransTypeSelect: 'paytranstypeselect',
            payTransTypeSelectTitle: 'paytranstypeselect #title'
        },
        control: {
            'paytranstypeselect #details': {
                tap: 'onDetailsTap'
            },
            'paytranstypeselect #back': {
                tap: 'back'
            },
            'paytranstypeselect #creditcard':{
                tap: 'onCreditCardTap'
            },
            'paytranstypeselect #cash':{
                tap: 'onCashTap'
            },
            'paytranstypeselect #cheque':{
                tap: 'onChequeTap'
            },
            'paytranstypeselect #other':{
                tap: 'onOtherTap'
            },
            'paytranstypeselect #testsignature':{
                tap: 'onTestSignatureTap'
            }
        }
    },
    
    showView: function (data, callback, callbackScope) {
        this.data = data;
        this.callback = callback;
        this.callbackScope = callbackScope;
        var view = this.getPayTransTypeSelect();
        if (!view){
            view = { xtype: 'paytranstypeselect' };
        }       
        RM.ViewMgr.showPanel(view);
        this.getPayTransTypeSelectTitle().setHtml('$'+data.Total);
        //alert(JSON.stringify(this.data));
    },  
    
    onDetailsTap: function(){
        RM.PayMgr.showScreen('PayAmountDetails', this.data);
    },
    
    onCreditCardTap: function(){
        //RM.PayMgr.showScreen('PayTransTerminal', this.data
        cordova.exec(function (data) {
            //alert(JSON.stringify(data));
            //Success
            
        }, function (data) {
            //alert(JSON.stringify(data));
            //Failure
            
        }, "PayDevice", "doTransaction", [this.data.Amount]);
    },
    
    onCashTap: function(){
        RM.PayMgr.showScreen('PayRecvCash', this.data, this.callback, this.callbackScope);
    },
    
    onChequeTap: function(){
        RM.PayMgr.showScreen('PayRecvCheque', this.data, this.callback, this.callbackScope);
    },
    
    onOtherTap: function(){
        RM.PayMgr.showScreen('PayRecvManualCard', this.data, this.callback, this.callbackScope);
    },
    
    onTestSignatureTap: function(){
        //To test Signature component, will be replaced with the refund screen later
        RM.PayMgr.showScreen('PayTransCardSign', this.data, this.callback, this.callbackScope); 
    },
    
    back: function () {
        RM.ViewMgr.back();
    }
});