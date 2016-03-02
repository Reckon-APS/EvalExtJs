Ext.define('RM.controller.PaySendReceiptC',{
    extend: 'Ext.app.Controller',
    requires: 'RM.view.PaySendReceipt',
     config: {
        refs: {
            paySendReceipt: 'paysendreceipt',
            paySendReceiptTopbar: 'paysendreceipt #topbar',
            paySendReceiptMsgPanel: 'paysendreceipt #msgpanel',
            paySendReceiptTitle: 'paysendreceipt #title',
            paySendReceiptToolbarTitle: 'paysendreceipt #toolbartitle',
            smsFld: 'paysendreceipt textfield[name=SMS]',
            emailFld: 'paysendreceipt textfield[name=Email]',
            emailComponent: 'paysendreceipt #emailcomponent',
            sendReceiptBtn: 'paysendreceipt #sendreceiptbtn',
            dontSendReceiptBtn: 'paysendreceipt #dontsendreceiptbtn',
            sentCont: 'paysendreceipt #sentcont'
        },
        control: {            
            'paysendreceipt #sendreceiptbtn': {
                tap: 'sendReceipt'
            },
            /*'paysendreceipt #sendreceiptbtn2': {
                tap: 'sendReceiptUsingSmsUri'
            },*/
            'paysendreceipt #dontsendreceiptbtn': {
                tap: 'done'
            },
            /*'paysendreceipt textfield[name=Email]':{
                tap: 'onEmailFieldTap'
            },*/
            'paysendreceipt #done': {
                tap: 'done'
            },            
            'paysendreceipt #retry':{
                tap: 'retry'
            },
            'paysendreceipt #details': {
                tap: 'onDetailsTap'
            },
            'paysendreceipt #back': {
                tap: 'back'
            }
        }
     },
    
    showView: function (data, callback, callbackScope) {
        this.data = data;
        this.callback = callback;
        this.callbackScope = callbackScope;
        //temp flag to simulate email verification
        this.emailverified = true;
        
        var view = this.getPaySendReceipt();
        if (!view){
            view = { xtype: 'paysendreceipt' };
        }       
        RM.ViewMgr.showPanel(view);
        this.clearFields();
        this.resetButtonText();
        this.getPaySendReceipt().setActiveItem(0);
        //To check if this view is opened from PayTransDetails screen and hide and show controls based on that
        if(callbackScope && callbackScope.getPayTransDetails){
            this.getPaySendReceiptTopbar().setHidden(false);
            this.getPaySendReceiptMsgPanel().setHidden(true);
            this.setButtonTextForResend();
            this.getPaySendReceiptToolbarTitle().setHtml(RM.AppMgr.formatCurrency((data.Total ? data.Total : data.Amount)) );
        }
        else{
            this.getPaySendReceiptTopbar().setHidden(true);
            this.getPaySendReceiptMsgPanel().setHidden(false);
        }
        this.getEmailFld().setHidden(!this.emailverified);
        this.getEmailComponent().setHidden(this.emailverified);
        this.getPaySendReceiptTitle().setHtml('$' + (data.Total ? data.Total : data.Amount) + ' charged');
        if(this.data.voidedTransaction) {
         	this.getPaySendReceiptTitle().setHtml('Charge voided');   
        }
        if(this.data.CustomerEmail){
            this.getEmailFld().setValue(this.data.CustomerEmail);
        }
    },  
    
    clearFields: function(){
        this.getEmailFld().setValue('');
        this.getSmsFld().setValue('');
    },
    
    resetButtonText: function(){
        this.getSendReceiptBtn().setText('SEND RECEIPT');
        this.getDontSendReceiptBtn().setText('DON\'T SEND RECEIPT');
    },
    
    setButtonTextForResend: function(){
        this.getSendReceiptBtn().setText('RESEND RECEIPT');
        this.getDontSendReceiptBtn().setText('DON\'T RESEND RECEIPT');
    },
    
    done: function() {
        if(this.callback){
            this.callback.call(this.callbackScope);
        }
        else{
            RM.ViewMgr.backTo('slidenavigationview');
        }
    },
    
    onDetailsTap: function(){
        RM.PayMgr.showScreen('PayAmountDetails', this.data);
    },
    
    back: function () {
        RM.ViewMgr.back();
    },   
    
    onEmailFieldTap: function(){
        RM.AppMgr.showErrorMsgBox('\'From\' email address must be set in Preferences before a receipt can be sent via email');
    },
    
    sendReceipt: function () {
        var vals = {};
        vals.SMS = this.getSmsFld().getValue();
        vals.Email = this.getEmailFld().getValue();
        if(this.validateForm(vals)){
            if(vals.SMS){
                this.sendSMS(vals);                       
            }
            if(vals.Email){
                this.sendEmail(vals);
            } 
            this.setReceiptContent(vals); 
            this.setButtonTextForResend();
        	this.getPaySendReceipt().setActiveItem(1);
        }       
    },
    
    sendEmail: function(vals){
        //Email API code 
    },
    
    sendSMS: function(vals) {
        var number = vals.SMS;
        //alert('sending SMS using Cordova plugin' + phoneNumber);
        var message = 'Test SMS from Reckon Pay';
        var intent = "INTENT"; //leave empty for sending sms using default intent
        //var me = this;
        var success = function () { 
            //alert('success');
            //me.setReceiptContent(vals); 
            //me.getPaySendReceipt().setActiveItem(1);
            //alert('popup after showing card 1');
            //me.done();
		};
        var error = function (e) {
            //alert('error');
            RM.AppMgr.showErrorMsgBox('Message Failed:' + e); 
        };
        sms.send(number, message, intent, success, error);        
    },
    
    retry: function(){
        this.getPaySendReceipt().setActiveItem(0);
    },
    
    /*sendReceiptUsingSmsUri: function() {        
        var vals = {};
        vals.SMS = this.getSmsFld().getValue();
        vals.Email = this.getEmailFld().getValue();
        if(this.validateForm(vals)){
            alert('sending SMS using SMS Uri' + vals.SMS);                    
            window.location.href = "sms:" + vals.SMS + ";body=Test msg using Uri" ; 
            this.setReceiptContent(vals)
            this.getPaySendReceipt().setActiveItem(1);
        }  
        this.done();
    },*/
    
    setReceiptContent: function(vals){
        var msg = '';
        if(vals.SMS && vals.Email) {
            msg = 'SMS and Email sent';
        }
        else if(vals.SMS) {
            msg = 'SMS sent';
        }
        else if(vals.Email) {
            msg = 'Email sent';
        }
        this.getSentCont().setHtml(msg);
    },
    
     validateForm: function(vals){        
        var isValid = true;
        
        if( !vals.SMS && !vals.Email ){
            RM.AppMgr.showErrorMsgBox('Please enter Phone number or Email or both for receipt');            
            isValid = false;
        }
         
        if(vals.SMS && vals.SMS.length < 9) {
            RM.AppMgr.showErrorMsgBox('Please recheck the number you have entered it appears too short');            
            isValid = false;
        }
         
        if (vals.Email !== '' && !RM.AppMgr.validateEmail(vals.Email)) {             
            this.getEmailFld().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidEmailMsg();
            return isValid;
        } 
        
        /*if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }*/
        
        return isValid;
    }
});