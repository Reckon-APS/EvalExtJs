Ext.define('RM.controller.InvoiceLineItemC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.InvoiceLineItem','RM.util.FormUtils','RM.util.PseudoGuid', 'RM.util.MathHelpers'],
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
            projectId: 'invoicelineitem field[name=ProjectId]',
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
                clearicontap: 'projectCleared'
            }
		}
    },
	
    isTaxInclusive: function() {
        return this.taxStatusCode === RM.Consts.TaxStatus.INCLUSIVE;
    },
    
    isTaxTracking: function() {
        return this.taxStatusCode !== RM.Consts.TaxStatus.NON_TAXED;
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
            this.isCreate = false;
            this.detailsData = Ext.clone(detailsData);                 
        }
        else{
            this.isCreate = true;
            this.detailsData = {
                IsNew:true,
                InvoiceLineItemId: RM.util.PseudoGuid.next(),
                UnitPriceAccuracy: 2,
                Quantity: null,
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
        
        this.getTax().setReadOnly(!RM.CashbookMgr.getTaxPreferences().AllowTaxEdit);        
        if(!this.isEditable) { this.makeViewReadonly(); }
        
        if(!this.initShow){
            itemForm.reset();
            itemForm.setValues(this.detailsData);     
            this.setDiscountDisplayValue(this.detailsData.DiscountPercentage, this.detailsData.DiscountAmount);
            
            var priceDisplayValue = RM.util.MathHelpers.roundToEven(this.isTaxInclusive() ? this.detailsData.UnitPrice : this.detailsData.UnitPriceExTax, this.detailsData.UnitPriceAccuracy);
            this.getUnitPrice().setValue(priceDisplayValue);

            if (!this.isTaxTracking()) {
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
    
    makeViewReadonly: function(){
        RM.util.FormUtils.makeAllFieldsReadOnly(this.getItemForm());    
    },
    
    setTaxModified: function(isModified) {
        this.detailsData.TaxIsModified = isModified;
        this.getItemDetail().setTaxModified(isModified);
    },
    
    setDiscountDisplayValue: function(discountPercent, discountAmount) {
        var discount;
        if(discountPercent) {
            discount = discountPercent + '%';
        }
        else if(discountAmount) {
            discount = RM.AppMgr.formatCurrency(discountAmount, 2);
        }
        else {
            discount = '';
        }
        this.getDiscount().setValue(discount);
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
                        var currentValue = this.getProjectId().getValue();                          
                        if(currentValue !== data.ProjectId) {
                            this.projectChanged(data, currentValue);
                        }
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
    
        // Field-specific validations
        if(!vals.ItemId){
            this.getItemNameFld().showValidation(false);
            isValid = false;
        }        
        
        if(!Ext.isNumber(vals.UnitPriceExTax)){
            this.getUnitPrice().showValidation(false);
            isValid = false;
        }        
        
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
        
        // More general validations (non-deterministic which field should be corrected)
        if(vals.Amount < 0) {
            RM.AppMgr.showOkMsgBox("The total amount can't be negative, please check your Discount and Unit Price.");
            isValid = false;
        }
        
        return isValid;
    },       
    
	add: function(){
        // Make sure we aren't waiting on an async action like item calculation
        if(this.ignoreControlEvents()) return;
        
		var ITEM_TYPE_CHARGEABLE_ITEM = 1;

        var formVals = this.getItemForm().getValues();
        // Remove the form fields that are display values only, and shouldn't override detailsData
        delete formVals.Amount;
        delete formVals.UnitPrice;
        delete formVals.Tax;
        delete formVals.Discount;
        
        if(!this.isTaxTracking()) delete formVals.TaxGroupId;
        
        var item = Ext.apply(this.detailsData, formVals);
        item.ItemType = ITEM_TYPE_CHARGEABLE_ITEM;
        item.Quantity = item.Quantity;
        item.LineText = item.Description || item.ItemName;
        
        if(this.validateForm(item)){            
		    this.detailsCb.call(this.detailsCbs, [item]);
            RM.ViewMgr.back();
        }
        
	},
    
    projectChanged: function(newProjectData, oldProjectId) {        
        this.getItemForm().setValues({ 
            ProjectId: newProjectData.ProjectId, 
            ProjectName: newProjectData.ProjectPath 
        });                        
        
        // If an item is already selected, check if it has a rate override for the new project
        var currentItem = this.getItemId().getValue();
        if (currentItem) {
            RM.AppMgr.getServerRecs('Items/GetByProject', 
            {
                id: currentItem,
                projectId: newProjectData.ProjectId
            },
            function(result) {
                if(result && result.length === 1) {
                    // There is a project rate for this item, apply it
                    this.setNewUnitPriceExTax(result[0].SalePrice);                    
                }
            },
            this);
        }
    },
    
    projectCleared: function() {        
        // The project field has been cleared using the clearIcon, we have to remove the Id also
        this.getProjectId().setValue(null);  
        
        // Now retrieve the default unit price
        var currentItem = this.getItemId().getValue();
        if(currentItem) {
            RM.AppMgr.getServerRecs('Items/GetById', 
            {
                id: currentItem            
            },
            function(result) {
                if(result && result.length === 1) {                
                    this.setNewUnitPriceExTax(result[0].SalePrice);                    
                }
            },
            this);
        }
    },
    
    itemChanged: function(newItem) {
        // An item has been selected from the list:
        // Reset item fields
        this.detailsData.ItemName = newItem.Name;
        this.detailsData.DefaultTaxGroupId = newItem.SaleTaxCodeId;
        this.detailsData.UnitPriceExTax = newItem.UnitPriceExTax;
        this.setTaxModified(false);
        
        this.ignoreEvents = true;
        this.getItemForm().setValues({ 
            ItemId: newItem.ItemId, 
            ItemName:newItem.ItemPath, 
            TaxGroupId: this.isTaxTracking() ? newItem.SaleTaxCodeId : null,         
            Description: newItem.SalesDescription,
            UnitPrice: this.isTaxInclusive() ? '' : newItem.UnitPriceExTax
        });
        this.ignoreEvents = false;
        var that = this;
        this.getServerCalculatedValues('Item', function() {
            // Make sure the details fields are visible after an item is selected
            that.getItemDetail().showDetailsFields();
        });
    },
    
    unitPriceChanged: function(newValue, oldValue) {
        // Only respond to changes triggered by the user, not events triggered during page loading
        if(this.ignoreControlEvents()) return;        
        
        // Emptying the field is treated as a 0 unit price
        newValue = newValue || 0;
        
        // Store the number of decimals the amount is captured with
        var splitNumber = newValue.toString().split('.');        
        if(splitNumber.length == 2 && splitNumber[1].length > 1) {
            this.detailsData.UnitPriceAccuracy = splitNumber[1].length;
        }
        else {
            this.detailsData.UnitPriceAccuracy = 2;
        }                
               
        if (!this.isTaxInclusive())
        {         
            // Update the tax exclusive unit price shadowing the unit price field
            this.detailsData.UnitPriceExTax = newValue;            
        }
        this.getServerCalculatedValues('UnitPrice');
   },
    
    discountChanged: function(field, newValue, oldValue) {
        if(this.ignoreControlEvents()) return;        
        
        // Reset all discount values, then apply the new one
        this.detailsData.DiscountAmount = null;
        this.detailsData.DiscountAmountExTax = null;
        this.detailsData.DiscountPercentage = null;
        
        if (newValue.indexOf('%') > -1) {
            this.detailsData.DiscountPercentage = parseFloat(newValue.replace('%', ''));
        }
        else if (newValue.indexOf('$') > -1) {
            if (this.isTaxInclusive()) {
                this.detailsData.DiscountAmount = RM.AppMgr.unformatCurrency(newValue);        
            }
            else {             
                this.detailsData.DiscountAmountExTax = RM.AppMgr.unformatCurrency(newValue);
            }            
        }
        
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
            Quantity: formVals.Quantity,
            TaxGroupId: this.isTaxTracking() ? formVals.TaxGroupId : null,
            TaxIsModified: this.detailsData.TaxIsModified,
            Tax: this.detailsData.TaxIsModified ? formVals.Tax : null,
            UnitPriceExTax: this.detailsData.UnitPriceExTax
        };

        // Only pass the ex-tax discount amount if not using a percentage
        if(this.detailsData.DiscountPercentage) {
            lineItem.DiscountPercentage = this.detailsData.DiscountPercentage;        
        }
        else {
            lineItem.DiscountAmountExTax = this.detailsData.DiscountAmountExTax;   
            lineItem.DiscountAmountTax = this.detailsData.DiscountAmountTax; 
        }
        
        switch(triggerField) {
            case 'UnitPrice':
                lineItem.UnitPrice = this.getUnitPrice().getValue() || 0;
                lineItem.UnitPriceIsModified = true;
                break;            
            case 'Quantity':
                lineItem.QuantityIsModified = true;
                break;
            case 'Discount':                
                if(!lineItem.DiscountPercentage) { 
                    lineItem.DiscountAmount = this.isTaxInclusive() ? this.detailsData.DiscountAmount : this.detailsData.DiscountAmountExTax; 
                    lineItem.DiscountAmountExTax = this.isTaxInclusive() ? null : this.detailsData.DiscountAmount;  
                    lineItem.DiscountAmountTax = null;
                }
                lineItem.DiscountIsModified = true;
                break;
        }
                
        invoice.LineItems.push(lineItem);
        
        // call the invoice calculation method
        this.ignoreEvents = true;     
        RM.AppMgr.saveServerRec('InvoiceCalc', true, invoice,
			function response(responseRecords) {
                var calculated = responseRecords[0].Items[0];                
                
                this.detailsData.UnitPriceExTax = calculated.UnitPriceExTax || 0;
                this.detailsData.UnitPrice = calculated.UnitPrice;
                this.detailsData.Amount = calculated.Amount;                
                this.detailsData.AmountExTax = calculated.AmountExTax;
                this.detailsData.AmountTax = calculated.AmountTax;
                this.detailsData.Tax = calculated.Tax;                
                this.detailsData.DiscountedTaxAmount = calculated.DiscountedTaxAmount;
                this.detailsData.DiscountedTaxExclAmount = calculated.DiscountedTaxExclAmount;
                
                //Set discount amount, only absolute amounts are affected by tax fiddling so a discount percentage is not affected by the calc results                                
                this.detailsData.DiscountAmount = calculated.DiscountAmount;
                this.detailsData.DiscountAmountExTax = calculated.DiscountAmountExTax;
                this.detailsData.DiscountAmountTax = calculated.DiscountAmountTax;
                this.setDiscountDisplayValue(this.detailsData.DiscountPercentage, this.detailsData.DiscountAmount);

                this.setTaxModified(calculated.TaxIsModified);                                
                
                // Now, the values displayed in the UI are rounded to the requisite number of decimals - THESE UI VALUES ARE NOT PERSISTED
                var displayedUnitPrice = RM.util.MathHelpers.roundToEven(this.isTaxInclusive() ? calculated.UnitPrice : this.detailsData.UnitPriceExTax, this.detailsData.UnitPriceAccuracy);
                this.getItemForm().setValues({                
                    UnitPrice: displayedUnitPrice,
                    Amount: RM.util.MathHelpers.roundToEven(calculated.Amount, 2),
                    Tax: RM.util.MathHelpers.roundToEven(calculated.Tax, 2)                
                });
                                                
                this.ignoreEvents = false;
                if(completeCallback) completeCallback();                
			},
			this,
            function(eventMsg){
                //TODO: what to do if the calc call fails, hmmm
                alert(eventMsg);                
                this.ignoreEvents = false;     
            },
            'Working...'
		);  
    },
    
    ignoreControlEvents: function() {
        // Only respond to changes triggered by the user, not events triggered during control loading
        if(!this.initShow || this.ignoreEvents) return true;        
    },
    
    setNewUnitPriceExTax: function(unitPriceExTax) {
        // Setting a new unit price ex tax means we have to reset the unit price displayed and call the calculation service
        this.ignoreEvents = true;
        this.setTaxModified(false);
        this.detailsData.UnitPriceExTax = unitPriceExTax;
        this.getUnitPrice().setValue(this.isTaxInclusive() ? '' : unitPriceExTax);
        this.ignoreEvents = false;
        this.getServerCalculatedValues();
    }
	
});