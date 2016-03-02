Ext.define('RM.controller.PayTransCardSignC',{
    extend: 'Ext.app.Controller',
    requires: 'RM.view.PayTransCardSign',
    config: {
        refs: {
            payTransCardSign: 'paytranscardsign',
            payTransCardSignTitle: 'paytranscardsign #title',
            payTransCardSignPanel: 'paytranscardsign #signpanel',
            payTransCardVoidButton: 'paytranscardsign #void',
            payTransCardClearButton: 'paytranscardsign #clear',
            payTransCardConfirmButton: 'paytranscardsign #confirm',
            payTransCardApproveButton: 'paytranscardsign #approve'            
        },
        control: { 
            'paytranscardsign #back': {
                tap: 'back'
            },
            'paytranscardsign #clear': {
                tap: 'clear'
            },
            'paytranscardsign #confirm':{
                tap: 'onConfirmTap'  
            },
             'paytranscardsign #approve':{
                tap: 'onApproveTap'  
            },
            'paytranscardsign #details': {
                tap: 'onDetailsTap'
            },
            'paytranscardsign #void':{
                tap: 'onVoidTap'
            },
            'paytranscardsign #signpanel': {
                rmcanvaspainted: 'onRMCanvasPainted',
                rmcanvascleared: 'onRMCanvasCleared'
            }
        }
     },
    
    showView: function (data, callback, callbackScope) {
        this.data = data;
        this.callback = callback;
        this.callbackScope = callbackScope;
        var view = this.getPayTransCardSign();
        if (!view){
            view = { xtype: 'paytranscardsign' };
        }       
        RM.ViewMgr.showPanel(view);
        this.loadData();
    },   
    
    loadData: function(){        
        this.getPayTransCardSignTitle().setHtml('$' + this.data.Amount);
    },
    
    clear: function(){
        this.getPayTransCardSignPanel().clearCanvas();        
    },
    
    back: function(){
        RM.ViewMgr.back();
    },
    
    onDetailsTap: function(){
        RM.PayMgr.showScreen('PayAmountDetails', this.data);
    },
    
    onRMCanvasCleared: function(){
        this.getPayTransCardClearButton().setHidden(true);  
        this.getPayTransCardConfirmButton().setHidden(true);  
    },
    
    onRMCanvasPainted: function(){
        this.getPayTransCardClearButton().setHidden(false);  
        this.getPayTransCardConfirmButton().setHidden(false);  
    },
    
    onVoidTap: function(){
        RM.AppMgr.showRMMsgPopup('Transaction has been voided.','error',[{text: 'CHANGE PAYMENT TYPE', itemId: 'changetype', cls: 'x-button-green'}, {text: 'SEND VOID RECEIPT', itemId: 'exit'}], function(selection){
            if(selection === 'changetype'){
                RM.ViewMgr.backTo('paytranstypeselect');
                //RM.PayMgr.showScreen('PayTransDetails', this.data, this.callback, this.callbackScope);
            }
            else if(selection === 'exit'){
                this.callback.call(this.callbackScope);
            }            
        }, this); 
    },
    
   onConfirmTap: function() {
       if (this.getPayTransCardSignPanel().isCanvasEmpty) {
           RM.AppMgr.showErrorMsgBox('No signature detected');
       }
       else {
           RM.PayMgr.showPinAuthentication(
               localStorage.getItem('RmUserName'),
               localStorage.getItem('RmDisplayName'), 
               function() {
                   RM.ViewMgr.back();
                   this.getPayTransCardSignPanel().setReadOnlyMode(); 
                   this.getPayTransCardClearButton().setHidden(true);
                   this.getPayTransCardVoidButton().setHidden(false);
                   this.getPayTransCardConfirmButton().setHidden(true);
                   this.getPayTransCardApproveButton().setHidden(false); 
               }, 
               this, 
               function() {
                   RM.AppMgr.showErrorMsgBox('Incorrect PIN');
               });   
       }
   },
    
    onApproveTap: function(){
       
    	//RM.PayMgr.createTransaction(this.data, function(){
            RM.PayMgr.showScreen('PaySendReceipt', this.data, this.callback, this.callbackScope);      
        //},this);            
       
    }    
});