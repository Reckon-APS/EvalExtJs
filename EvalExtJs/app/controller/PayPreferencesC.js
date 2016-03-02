Ext.define('RM.controller.PayPreferencesC',{
    extend: 'Ext.app.Controller',
    requires: 'RM.view.PayPreferences',
    config: {
        refs: {
            payPreferences: 'paypreferences',            
            payPreferencesForm: 'paypreferences #preferencesform',
            //includeSurcharge: 'paypreferences #includesurcharge',
           //surchargeType: 'paypreferences selectfield[name = SurchargeType]',
            //surchargeAmount: 'paypreferences textfield[name = SurchargeAmount]',
            //surchargePercentage: 'paypreferences textfield[name = SurchargePercentage]',
            email: 'paypreferences textfield[name = Email]',
            includeBcc: 'paypreferences #includebcc',
            nameToShow: 'paypreferences textfield[name = NameToShow]',
            receiptPrefix: 'paypreferences textfield[name = ReceiptPrefix]',
            nextReceiptNumber: 'paypreferences textfield[name = NextReceiptNumber]',
            reckonPayDevice: 'paypreferences #reckonpaydevice'
        }, 
        control: {
            'paypreferences #save':{
                tap: 'onSave'
            },
            /*'paypreferences #includesurcharge': {
                check: 'onSurchargeCheckBoxToggle'
            },
            'paypreferences selectfield[name = SurchargeType]':{
                change: 'onSurchargeTypeChange'
            }*/
            /*'paypreferences textfield[name = NextReceiptNumber]':{
                keyup: 'onReceiptNumKeyUp'
            }*/
        }
     },
    
    /*showView: function () {       
        var view = this.getPayPreference();
        if (!view){
            view = { xtype: 'paypreferences' };
        }       
        RM.ViewMgr.showPanel(view);  
    }, */  
    
    init: function () {
        this.getApplication().addListener('rm-activeviewchanged', 'onActiveViewChanged', this);  
    },
    
    onActiveViewChanged: function(newView) {
        if(this.getPayPreferences() && newView.xtype === this.getPayPreferences().xtype) {            
            this.resetFields();         
        	RM.PayMgr.getPreferences(function(preferences){
            	this.loadData(preferences);  
            },this);    	
        }        
    },
    
    loadData: function(preferences){        
       /* var includeSurcharge = this.getIncludeSurcharge();        
        var surchargeType = this.getSurchargeType();
        var surchargeAmount = this.getSurchargeAmount();
        var surchargePercentage = this.getSurchargePercentage();*/
        var email = this.getEmail();
        var includeBcc = this.getIncludeBcc();
        var nameToShow = this.getNameToShow();
        var receiptPrefix= this.getReceiptPrefix();
        var nextReceiptNumber = this.getNextReceiptNumber();
        var reckonDevice = this.getReckonPayDevice();        
        /*if(includeSurcharge) {        
            includeSurcharge.setValue(this.convertToBooleanValue(this.getPreferencesValue(preferences, 'IncludeSurcharge'))); 
        }        
        if(surchargeType) {
            surchargeType.setValue(this.getPreferencesValue(preferences, 'SurchargeType'));	   
        }
        if(surchargeAmount) {
            surchargeAmount.setValue(this.getPreferencesValue(preferences, 'SurchargeAmount'));	   
        }
        if(surchargePercentage) {
            surchargePercentage.setValue(this.getPreferencesValue(preferences, 'SurchargePercentage'));	   
        }*/
        if(email) {
            email.setValue(this.getPreferencesValue(preferences, 'Email'));	   
        }
        if(includeBcc) {
            includeBcc.setValue(this.convertToBooleanValue(this.getPreferencesValue(preferences, 'IncludeBcc')));	   
        }
        if(nameToShow) {
            nameToShow.setValue(this.getPreferencesValue(preferences, 'NameToShow'));	   
        }
        if(receiptPrefix) {
            receiptPrefix.setValue(this.getPreferencesValue(preferences, 'ReceiptPrefix'));	   
        }
        if(nextReceiptNumber) {
            nextReceiptNumber.setValue(this.getPreferencesValue(preferences, 'NextReceiptNumber'));	   
        }
        if(reckonDevice) {            
            reckonDevice.setValue(this.convertToBooleanValue(this.getPreferencesValue(preferences, 'ReckonPayDevice')));
        }
    },
    
    convertToBooleanValue: function(boolValue){
        if(boolValue && boolValue.toUpperCase() === 'TRUE'){
            return true;
        }
        else{
            return false;
        }
    },
    
    getPreferencesValue: function(preferences, key){
        for(var i = 0; i < preferences.length; i++ ){
            if(preferences[i].SettingName == key){                
                console.log('key: ' + key + ' val: ' + preferences[i].Value);
                return preferences[i].Value;
            }
        }        
    },
    
    resetFields: function(){
        var prefForm = this.getPayPreferencesForm();
        //var includeSurcharge = this.getIncludeSurcharge();
        var reckonDevice = this.getReckonPayDevice();
        var includeBcc = this.getIncludeBcc();
        if(prefForm) {
            prefForm.reset();
        }
        /*if(includeSurcharge) {
            includeSurcharge.setValue(false);	   
        }*/
        if(reckonDevice) {
            reckonDevice.setValue(false);
        }
        if(includeBcc) {
            includeBcc.setValue(false);
        }
    },
    
    /*onSurchargeCheckBoxToggle: function() {
        if(this.getIncludeSurcharge().getValue()){
            this.getSurchargeType().setHidden(false);
            var surchargeType = this.getSurchargeType().getValue();
            if(surchargeType == 'Percentage'){
                this.getSurchargeAmount().setHidden(true);
            	this.getSurchargePercentage().setHidden(false);
            }
            else if(surchargeType == 'Amount'){
                this.getSurchargeAmount().setHidden(false);
            	this.getSurchargePercentage().setHidden(true);
            }
        }
        else{
            this.getSurchargeType().setHidden(true);
            this.getSurchargeAmount().setHidden(true);
            this.getSurchargePercentage().setHidden(true);
        }
    },
    
    onSurchargeTypeChange: function(control){
        if(!this.getIncludeSurcharge().getValue()){
            this.getSurchargeType().setHidden(true);
            this.getSurchargeAmount().setHidden(true);
            this.getSurchargePercentage().setHidden(true);
            return;
        }
  	  var surchargeType = control.getValue();
        if(surchargeType == 'Percentage'){
            this.getSurchargeAmount().setHidden(true);
        	this.getSurchargePercentage().setHidden(false);
            this.getSurchargeAmount().setValue('');
        }
        else if(surchargeType == 'Amount'){
            this.getSurchargeAmount().setHidden(false);
        	this.getSurchargePercentage().setHidden(true);
            this.getSurchargePercentage().setValue('');
        }  
    },*/
    
    onSave: function(){        
        var data = this.getPayPreferencesForm().getValues();
        //data.IncludeSurcharge = this.getIncludeSurcharge().getValue();
        data.ReckonPayDevice = this.getReckonPayDevice().getValue();
        data.IncludeBcc = this.getIncludeBcc().getValue();
        if(this.validateForm(data)){  
            var prefArray = new Array();           
            Ext.Object.each(data, function(key, value) {
                var prefObj = {};
                prefObj.SettingName = key;
                prefObj.Value = value;
                prefArray.push(prefObj);
            });            
            RM.PayMgr.postPreferences(prefArray, function(){
                console.log(prefArray);
            },this);           
        }    
    },   
    
    //work around for numberfield - maxLength 6
    /*onReceiptNumKeyUp: function( textfield, e, eOpts ) {
        var value = textfield.getValue()+'';
        var length = value.length;
        if (length > 6){
            textfield.setValue(value.substring(0, 6));
            return false;
        } 
    },*/
    
    validateForm: function(vals){        
        var isValid = true;      
        /*if(vals.IncludeSurcharge){
            if(vals.SurchargeType == 'Percentage'){
                var surchargePercentage = parseFloat(vals.SurchargePercentage);
                if(!vals.SurchargePercentage){
                    this.getSurchargePercentage().showValidation(false);
            		isValid = false;            
                }
                if(surchargePercentage && surchargePercentage>99){
                    isValid = false;            
            		RM.AppMgr.showErrorMsgBox('Surcharge percentage cannot be greater than 99%');            
            		return isValid;
                }
            }
            else if(vals.SurchargeType == 'Amount'){
                if(!vals.SurchargeAmount){
                    this.getSurchargeAmount().showValidation(false);
            		isValid = false;            
                }
            }  
        }*/
        
        if (!vals.Email) {             
            this.getEmail().showValidation(false);
            isValid = false;            
        }  
        
        if(!vals.NameToShow){
            this.getNameToShow().showValidation(false);
            isValid = false;            
        }  
        
        if(!vals.ReceiptPrefix ){
            this.getReceiptPrefix().showValidation(false);
            isValid = false; 
        }
        
        if(!vals.NextReceiptNumber){
            this.getNextReceiptNumber().showValidation(false);
            isValid = false;
        }
        
        if (vals.Email !== '' && !RM.AppMgr.validateEmail(vals.Email)) {             
            this.getEmail().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidEmailMsg();
            return isValid;
        }  
        
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
        
        return isValid;
    }  
        
       
});