Ext.define('RM.controller.PayRecvCashC',{
    extend: 'Ext.app.Controller',
    requires: 'RM.view.PayRecvCash',
     config: {
        refs: {
            payRecvCash: 'payrecvcash',
            payRecvCashTitle: 'payrecvcash #title',
            cashFld: 'payrecvcash #cashfld',
            changeFld: 'payrecvcash #changefld'
        },
        control: {
            'payrecvcash #back': {
                tap: 'back'
            },
            'payrecvcash #details': {
                tap: 'onDetailsTap'
            },
            'payrecvcash #cashfld': {
                change: 'onCashFldChange'  
            },
            'payrecvcash #tendercash': {
                tap: 'tenderCash'
            }
        }
     },
    
    showView: function (data, callback, callbackScope) {
        this.data = data;
        this.callback = callback;
        this.callbackScope = callbackScope;
        var view = this.getPayRecvCash();
        if (!view){
            view = { xtype: 'payrecvcash' };
        }       
        RM.ViewMgr.showPanel(view);
        this.clearFields();
        this.getPayRecvCashTitle().setHtml('$'+data.Total);
        this.getCashFld().setValue('');
    },
    
    clearFields: function(){
        this.getCashFld().setValue('');
        this.getChangeFld().setValue('');
    },
    
    onDetailsTap: function(){
        RM.PayMgr.showScreen('PayAmountDetails', this.data);
    },
    
    onCashFldChange: function() {
        if(this.getCashFld().getValue()){
            this.setChangeFldValue();
        }
        else{
            this.getChangeFld().setValue('');                      
        }
    },
    
    calculateChange: function(){        
        var cash = parseFloat(this.getCashFld().getValue()); 
        var total = parseFloat(this.data.Total);
        var change = cash - total;
        return change;
    },
    
    setChangeFldValue: function(){        
        var change = this.calculateChange();        
        if(change < 0){
             this.getChangeFld().setValue('');               
        }
        else {
            this.getChangeFld().setValue(change);
        }     
    },   
    
    validateForm: function(){
        var isValid = true;
        var cashFldVal = this.getCashFld().getValue();
        var cash = parseFloat(cashFldVal); 
        var change = this.calculateChange();
        if (Ext.isNumber(cash)) {
            if(change < 0){
                 RM.AppMgr.showErrorMsgBox('Cash received cannot be less than the total amount', function(){
                     this.clearFields();
                 }, this);   
                 isValid = false;
                 return isValid;
            }                      
        }
        if(!cashFldVal){
            RM.AppMgr.showErrorMsgBox('Please enter cash received'); 
            isValid = false;
        }        
        return isValid;
    },
    
    tenderCash: function(){        
        this.data.PaymentMethodId = 2;        
        if(this.validateForm()){
        	RM.PayMgr.createTransaction(this.data, function(){
                RM.PayMgr.showScreen('PaySendReceipt', this.data, this.callback, this.callbackScope);      
            },this);            
        }
    },
        
    back: function () {
        RM.ViewMgr.back();
    }    
});