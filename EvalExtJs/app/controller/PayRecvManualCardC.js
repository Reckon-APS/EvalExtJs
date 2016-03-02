Ext.define('RM.controller.PayRecvManualCardC',{
    extend: 'Ext.app.Controller',
    requires: 'RM.view.PayRecvManualCard',
     config: {
        refs: {
            payRecvManualCard: 'payrecvmanualcard',
            payRecvManualCardTitle: 'payrecvmanualcard #title',
            //payRecvManualCardForm: 'payrecvmanualcard #payrecvmanualcardform',
            cardTypeFld: 'payrecvmanualcard textfield[name=PaymentMethodId]',
            dateFld: 'payrecvmanualcard textfield[name=Date]'
        },
        control: {
            'payrecvmanualcard #back': {
                tap: 'back'
            },
            'payrecvmanualcard #details': {
                tap: 'onDetailsTap'
            },
            'payrecvmanualcard #recordtransaction': {
                tap: 'recordTransaction'
            }
        }
     },
    
    showView: function (data, callback, callbackScope) {
        this.data = data;
        this.callback = callback;
        this.callbackScope = callbackScope;
        
        var view = this.getPayRecvManualCard();
        if (!view){
            view = { xtype: 'payrecvmanualcard' };
        }       
        RM.ViewMgr.showPanel(view);
        this.getCardTypeFld().setValue(null);
        this.getDateFld().setValue(null);
        //this.getPayRecvManualCardForm().reset();
        this.getPayRecvManualCardTitle().setHtml('$'+data.Total);
        /*var store = this.getCardTypeFld().getStore();        
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('PayTransactionMethods'));     
        store.filter('IsCard', true);
        RM.AppMgr.loadStore(store);*/                
    },
    
    onDetailsTap: function(){
        RM.PayMgr.showScreen('PayAmountDetails', this.data);
    },
    
    recordTransaction: function() {
        
        //var vals = this.getPayRecvManualCardForm().getValues();
        var cardType = this.getCardTypeFld().getValue();        
        this.data.PaymentMethodId = cardType;
        this.data.TransactionDate = this.getDateFld().getValue();
        if(this.validateForm(this.data)){
        	RM.PayMgr.createTransaction(this.data, function(){            
                RM.PayMgr.showScreen('PaySendReceipt', this.data, this.callback, this.callbackScope);      
            },this);            
        }
    },
    
    back: function () {
        RM.ViewMgr.back();
    },   
    
    validateForm: function(vals){        
        var isValid = true;
        
        if( vals.PaymentMethodId === undefined || vals.PaymentMethodId === null || vals.PaymentMethodId === ''){            
            this.getCardTypeFld().showValidation(false);
            isValid = false;
        }       
        
        if( ! vals.TransactionDate ){    
            this.getDateFld().showValidation(false);
            isValid = false;
        } 
        
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
        
        return isValid;
    }
});