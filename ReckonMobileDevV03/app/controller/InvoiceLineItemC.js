Ext.define('RM.controller.InvoiceLineItemC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.InvoiceLineItem','RM.util.FormUtils','RM.util.PseudoGuid'],
    config: {
        refs: {
            itemDetail: 'invoicelineitem',
            addBtn: 'invoicelineitem #add',
			itemForm: 'invoicelineitem #itemForm',
            description: 'invoicelineitem field[name=Description]',
            unitPrice: 'invoicelineitem field[name=UnitPrice]',
            quantity: 'invoicelineitem field[name=Quantity]',
            discount: 'invoicelineitem field[name=Discount]',
			taxCode: 'invoicelineitem field[name=TaxGroupId]',
            tax: 'invoicelineitem field[name=Tax]',
            amount: 'invoicelineitem field[name=Amount]',
            itemNameFld: 'invoicelineitem field[name=ItemName]',
            projectId: 'invoicelineitem field[name=ProjectID]',
            itemId: 'invoicelineitem field[name=ItemId]',
            projectName: 'invoicelineitem field[name=ProjectName]',
        },
        control: {
            'invoicelineitem': {
                show: 'onShow'
            },
            'invoicelineitem #itemForm exttextfield': {
                tap: 'onFieldTap'
            },			
            'invoicelineitem #back': {
                tap: 'back'
            },		
            'invoicelineitem #add': {
                tap: 'add'
            },
            unitPrice: {
                valueChange: 'unitPriceChanged'
            },
            tax: {
                valueChange: 'taxAmountChanged',
                clearicontap: function() { this.taxAmountChanged(null,null); }
            },
            'taxCode':{
                change: 'taxCodeChanged'
            },            
            quantity: {
                valueChange: 'quantityChanged'
            },
            discount: {
                change: 'discountChanged'
            },
            projectName: {
                change: 'projectChanged'
            }
		}
    },
	
    isTaxInclusive: function() {
        return this.taxStatusCode === RM.Consts.TaxStatus.INCLUSIVE;
    },
    
    showView: function (editable, customerId, options, detailsData, cb, cbs) {
        this.ignoreEvents = false;
        this.isEditable = editable;
        this.customerId = customerId;
        this.taxStatusCode = options.taxStatus; 
        this.invoiceDate = options.invoiceDate;
        this.detailsCb = cb;
        this.detailsCbs = cbs;

        if(detailsData){    	    
            this.detailsData = detailsData;                    
        }
        else{
            this.isCreate = true;
            this.detailsData = {
                IsNew:true,
                InvoiceLineItemId: RM.util.PseudoGuid.next(),
                Quantity: 1,
                TaxGroupId: null,
                TaxIsModified: false
            };
        }        
        
        var view = this.getItemDetail();
        
        this.initShow = false;
        
        if (!view){
            view = { xtype: 'invoicelineitem' };
        }
                     
        RM.ViewMgr.showPanel(view);
    },
	
    onShow: function () {
        var itemForm = this.getItemForm();

        this.getAddBtn().setHidden(!this.isEditable);
        this.getAddBtn().setText(this.isCreate ? 'ADD' : 'SAVE');
        this.setEditable(this.isEditable);
        this.getTax().setReadOnly(!RM.CashbookMgr.getTaxPreferences().AllowTaxEdit);
        
        if(!this.initShow){
            itemForm.reset();
            itemForm.setValues(this.detailsData);     
            this.setDiscountValue(this.detailsData.DiscountPercentage, this.detailsData.DiscountAmount);
            if(!this.isTaxInclusive()) {
                this.getUnitPrice().setValue(this.detailsData.UnitPriceExTax);
            }
            
            if (this.taxStatusCode === RM.Consts.TaxStatus.NON_TAXED) {
                this.getItemDetail().hideTaxFields();            
            }            
            
            this.setTaxModified(this.detailsData.TaxIsModified);
            
            if(this.detailsData.ItemId) { this.getItemDetail().showDetailsFields(); }
            
            this.initialFormValues = itemForm.getValues();
            this.initShow = true;
        }           
    },
    
    isFormDirty: function(){        
        return !RM.AppMgr.isFormValsEqual( this.getItemForm().getValues(), this.initialFormValues);        
    },        
    
    setEditable: function(editable){
        if(!editable) { RM.util.FormUtils.makeAllFieldsReadOnly(this.getItemForm()); }    
    },
    
    setTaxModified: function(isModified) {
        this.detailsData.TaxIsModified = isModified;
        this.getItemDetail().setTaxModified(isModified);
    },
    
    getDiscountValue: function() {
        var discount = this.getDiscount().getValue();
        var result = {};
        if (discount.indexOf('%') > -1) {
            result.DiscountPercentage = parseFloat(discount.replace('%', ''));
        }
        else if (discount.indexOf('$') > -1) {
            result.DiscountAmount = parseFloat(discount.replace('$', ''));
        }
        return result;
    },
    
    setDiscountValue: function(discountPercent, discountAmount) {
        if(discountPercent) {
            this.detailsData.Discount = discountPercent + '%';
        }
        else if(discountAmount) {
            this.detailsData.Discount = '$' + Ext.Number.toFixed(discountAmount, 2);
        }
        else {
            this.detailsData.Discount = '';
        }
        this.getDiscount().setValue(this.detailsData.Discount);
    },

    onFieldTap: function (tf) {
        if(this.isEditable){
    		if (tf.getName() == 'Discount') {
                var discVal = tf.getValue();
    		    RM.InvoicesMgr.showChooseDiscountPopup(
                    discVal || 0,
    				function (disc) {                        
                        tf.setValue(disc == 0 ? '' : disc);                                                 
    				},
    				this
    			);
            }
            else if (tf.getName() == 'ProjectName') {
                RM.Selectors.showProjects(
                    this.customerId,
                    null,
    				function (data) {
    				    this.getItemForm().setValues({ ProjectID: data.ProjectId, ProjectName: data.ProjectPath });
    				},
    				this
    			);
            }
            else if (tf.getName() == 'ItemName') {
                RM.Selectors.showItems(
                    true,
    				this.getProjectId().getValue(),
                    false,
    				function (data) {                        
                        this.itemChanged(data[0])                        
    				},
    				this
    			);
            }
        }           

    },	
	
    
    goBack: function () {
        RM.ViewMgr.back();
    },

    back: function () {
        if(this.isFormDirty()){
            RM.AppMgr.showUnsavedChangesMsgBox(
                function(btn){
                    if(btn == 'yes'){
                        this.add();
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
    
    
    validateForm: function(vals){        
        var isValid = true;
        
        if(!vals.ItemId){
            this.getItemNameFld().showValidation(false);
            isValid = false;
        }        
        
        if(!vals.UnitPriceExTax){
            this.getUnitPrice().showValidation(false);
            isValid = false;
        }        
        
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
        
        return isValid;
    },       
    
	add: function(){
		var ITEM_TYPE_CHARGEABLE_ITEM = 1;
		
		var formVals = this.getItemForm().getValues();

        var item = Ext.apply(this.detailsData, formVals);
        item.ItemType = ITEM_TYPE_CHARGEABLE_ITEM;
        item.Quantity = item.Quantity || 1;

        var discount = this.getDiscountValue();
        item.DiscountPercentage = discount.DiscountPercentage;
        item.DiscountAmount = discount.DiscountAmount;        

        if(this.validateForm(item)){		
		    this.detailsCb.call(this.detailsCbs, [item]);
            RM.ViewMgr.back();
        }
        
	},
    
    itemChanged: function(newItem) {
        // An item has been selected from the list:
        // Reset item fields
        this.detailsData.ItemName = newItem.Name;
        this.detailsData.UnitPriceExTax = newItem.UnitPriceExTax;
        this.setTaxModified(false);
        
        this.ignoreEvents = true;
        this.getItemForm().setValues({ 
            ItemId: newItem.ItemId, 
            ItemName:newItem.ItemPath, 
            TaxGroupId:newItem.SaleTaxCodeID,         
            Description: newItem.SalesDescription,
            UnitPrice: this.isTaxInclusive() ? '' : newItem.UnitPriceExTax
        });
        this.ignoreEvents = false;
        var $this = this;
        this.getServerCalculatedValues('Item', function() {
            // Make sure the details fields are visible after an item is selected
            $this.getItemDetail().showDetailsFields();
        });
    },
    
    unitPriceChanged: function(newValue, oldValue) {
        // Only respond to changes triggered by the user, not events triggered during page loading
        if(this.ignoreControlEvents()) return;        
                      
        if (!this.isTaxInclusive())
        {         
            // Update the tax exclusive unit price shadowing the unit price field
            this.detailsData.UnitPriceExTax = newValue;            
        }
        this.getServerCalculatedValues('UnitPrice');
   },
    
    discountChanged: function(field, newValue, oldValue) {
        if(this.ignoreControlEvents()) return;        
                
        this.detailsData.Discount = newValue;        
        this.getServerCalculatedValues('Discount');
   },
    
    taxAmountChanged: function(newValue, oldValue) {
        if(this.ignoreControlEvents()) return;  
        
        if(!newValue) {
            this.detailsData.TaxIsModified = false;
        }
        else {
            this.detailsData.TaxIsModified = true;
        }
        
        this.getServerCalculatedValues('Tax');
    },    
    
    taxCodeChanged: function(){
        if(this.ignoreControlEvents()) return;        
        
        this.getServerCalculatedValues('Tax');        
    },
    
    projectChanged: function(field, newValue, oldValue) {
        if(this.ignoreControlEvents()) return;        
                
        if(!newValue) {
            // The project field has been cleared using the clearIcon, we have to remove the Id also
            this.getProjectId().setValue(null);
        }
        
        //If an item is already selected, determine the affect on that item (if there are project overrides for the unit price)
        if(this.getItemId().getValue()) {
            //TODO: thjis requires server-side changes to expose an api call to get the applicable rate for an item for a given project
            
        }        
    },

    quantityChanged: function() {        
        if(this.ignoreControlEvents()) return;                    
        this.getServerCalculatedValues('Quantity');
    },
    
    getServerCalculatedValues: function(triggerField, completeCallback) {
        // build a dummy invoice
        var invoice = { 
            AmountTaxStatus: this.taxStatusCode, 
            PreviousAmountTaxStatus: this.taxStatusCode, 
            CustomerId: this.customerId,
            InvoiceDate : this.invoiceDate,
            LineItems:[]
        };
        
        // set a single line item using current details
        var formVals = this.getItemForm().getValues();
        var lineItem = {
            // Flag the item as Status New, since this forces the server to calculate what the default tax for the item is (but not necessarily apply it)
            ChangeStatus : 2,             
            ItemId: formVals.ItemId,
            Quantity: formVals.Quantity || 1,
            TaxGroupID: formVals.TaxGroupId,
            TaxIsModified: this.detailsData.TaxIsModified,
            Tax: this.detailsData.TaxIsModified ? formVals.Tax : null,
            UnitPriceExTax: this.detailsData.UnitPriceExTax
        };

        var discount = this.getDiscountValue();
        // Only pass the ex-tax discount amount if not using a percentage
        if(discount.DiscountPercentage) {
            lineItem.DiscountPercentage = discount.DiscountPercentage;        
        }
        else {
            lineItem.DiscountAmountExTax = this.detailsData.DiscountAmountExTax;            
        }
        
        switch(triggerField) {
            case 'UnitPrice':
                lineItem.UnitPrice = this.getUnitPrice().getValue();
                lineItem.UnitPriceIsModified = true;
                break;            
            case 'Quantity':
                lineItem.QuantityIsModified = true;
                break;
            case 'Discount':                
                if(!lineItem.DiscountPercentage) { lineItem.DiscountAmount = discount.DiscountAmount; }
                lineItem.DiscountIsModified = true;
                break;
        }
                
        invoice.LineItems.push(lineItem);
        
        // call the invoice calculation method
        RM.AppMgr.saveServerRec('InvoiceCalc', true, invoice,
			function response(responseRecords) {
                var calculated = responseRecords[0].Items[0];
                this.ignoreEvents = true;     
                                
                this.detailsData.AmountExTax = calculated.AmountExTax;
                this.detailsData.DiscountedTaxAmount = calculated.DiscountedTaxAmount;
                this.detailsData.DiscountedTaxExclAmount = calculated.DiscountedTaxExclAmount;
                
                if(triggerField === 'UnitPrice') this.detailsData.UnitPriceExTax = calculated.UnitPriceExTax;
                this.setTaxModified(calculated.TaxIsModified);                                
                
                this.getItemForm().setValues({                
                    UnitPrice: this.isTaxInclusive() ? calculated.UnitPrice : this.detailsData.UnitPriceExTax,
                    Amount: calculated.Amount,
                    Tax: calculated.Tax                
                });
                
                //Set discount amount, only absolute amounts are affected by tax fiddling so a discount percentage is not affected by the calc results
                this.setDiscountValue(lineItem.DiscountPercentage, calculated.DiscountAmount);
                this.detailsData.DiscountAmountExTax = calculated.DiscountAmountExTax;
                                
                this.ignoreEvents = false;
                if(completeCallback) completeCallback();                
			},
			this,
            function(eventMsg){
                //TODO: what to do if the calc call fails, hmmm
                alert(eventMsg);                
            },
            'Working...'
		);  
    },
    
    ignoreControlEvents: function() {
        // Only respond to changes triggered by the user, not events triggered during control loading
        if(!this.initShow || this.ignoreEvents) return true;        
    }
	
});