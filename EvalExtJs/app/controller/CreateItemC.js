Ext.define('RM.controller.CreateItemC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            createItem: 'createitem',
            createItemForm: 'createitem formpanel',
            itemTypeFld: 'createitem #itemType',
            itemNameFld: 'createitem #itemName',            
            acctCatFld: 'createitem selectfield[name=SaleCategoryId]',
            taxCodeFld: 'createitem selectfield[name=SaleTaxCodeId]'
        },
        control: {
            'createitem': {
                show: 'onShow'
            },              
            'createitem #back': {
                tap: 'back'
            },            
            'createitem #save': {
                tap: 'save'
            }
        }

    },
	
	showView: function(cb, cbs){
        this.goCb = cb;
        this.goCbs = cbs;
        
		var view = this.getCreateItem();
		if(!view){
			view = {xtype:'createitem'};
        }
        else{
             this.getCreateItemForm().reset();
            this.getAcctCatFld().setValue(null);
            this.getTaxCodeFld().setValue(null);
        }
		RM.ViewMgr.showPanel(view);		
		
	},
    
    onShow: function(){
        this.initialFormValues = this.getCreateItemForm().getValues();
    },
    
    save: function(){
        var vals = this.getCreateItemForm().getValues();
        vals.ActiveStatus = RM.Consts.ItemStatus.ACTIVE;  //Remove this hardcoded value when state field is added back to form
        //vals.ActiveStatus = vals.ActiveStatus ? RM.Consts.ItemStatus.ACTIVE : RM.Consts.ItemStatus.INACTIVE; //Uncomment this line when state field is added back to form
        
        if (this.validateForm(vals)) { 
            RM.AppMgr.saveServerRec('Items', true, vals,
                function () {
                    RM.AppMgr.itemUpdated('item');
                    RM.ViewMgr.back();
                },
                this,
                function(recs, eventMsg) {
                   RM.AppMgr.showOkMsgBox(eventMsg);             
                }
            );        
        }
    },
    
    isFormDirty: function(){        
        return !RM.AppMgr.isFormValsEqual( this.getCreateItemForm().getValues(), this.initialFormValues);        
    },      
    
    validateForm: function(vals){  
        var isValid = true;       
        
        if(!vals.ItemType){
            this.getItemTypeFld().showValidation(false);
            isValid = false;
        }  
        
        if(!vals.Name){
            this.getItemNameFld().showValidation(false);
            isValid = false;
        }
        
        if(!vals.SaleCategoryId){
            this.getAcctCatFld().showValidation(false);
            isValid = false;
        }
        
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
        
        return isValid;
    },  
    

    goBack: function () {
        RM.ViewMgr.back();
    },

    back: function () {
        
         if(this.isFormDirty()){
            RM.AppMgr.showUnsavedChangesMsgBox(
                function(btn){
                    if(btn == 'yes'){
                        this.save();
                    }
                    else{
                        this.goBack();
                    }
                },
                this
            );
        }
        else{
            this.goBack();
        }    
    },    
    

});