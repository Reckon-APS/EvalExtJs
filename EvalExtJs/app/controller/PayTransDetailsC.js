Ext.define('RM.controller.PayTransDetailsC',{
    extend: 'Ext.app.Controller',
    requires: 'RM.view.PayTransDetails',
    config: {
        refs: {
            payTransDetails: 'paytransdetails',
            title: 'paytransdetails #title',
            date: 'paytransdetails #date',
            cardNumber: 'paytransdetails #cardno',
            receiptNumber: 'paytransdetails #receiptno',
            refundBtn: 'paytransdetails #refund',
            //amountFld: 'paytransdetails #amountfld'
        },
        control: {            
            'paytransdetails #refund': {
                tap: 'refund'
            },
            'paytransdetails #sendreceipt': {
                tap: 'sendReceipt'
            },
            'paytransdetails #back': {
                tap: 'back'
            },
            'paytransdetails #details': {
                tap: 'onDetailsTap'
            },
        }
     },
    
    showView: function (data, callback, callbackScope) {
        this.data = data;
        var view = this.getPayTransDetails();
        if (!view){
            view = { xtype: 'paytransdetails' };
        }       
        RM.ViewMgr.showPanel(view);
        this.loadData();
    },   
    
    loadData: function(){
        //console.log(this.data);
        //regex to test a valid UUID/GUID
        var regexp = new RegExp('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i');
        //if the test result is true then its a refund transaction else a normal transaction 
        if(regexp.test(this.data.ParentId)){
            this.getRefundBtn().setHidden(true);
        }
        else{
            this.getRefundBtn().setHidden(false);
        }  
        this.getTitle().setHtml(RM.AppMgr.formatCurrency(this.data.Amount));
        this.getDate().setValue(this.data.TransactionDate);
        this.getCardNumber().setValue('Card Ending with 4455');
        this.getReceiptNumber().setValue('REC123456');
    },
    
    refund: function(){        
        RM.PayMgr.showScreen('PayTransRefund', this.data);    
    },
    
    sendReceipt: function(){
        RM.PayMgr.showScreen('PaySendReceipt', this.data, function(){
            RM.ViewMgr.back();
        }, this);
    },
    
    onDetailsTap: function(){
        RM.PayMgr.showScreen('PayAmountDetails', this.data);
    },
    
    back: function () {
        RM.ViewMgr.back();
    }     
});