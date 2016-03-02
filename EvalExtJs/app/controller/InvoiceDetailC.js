Ext.define('RM.controller.InvoiceDetailC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.util.FormUtils','RM.util.Dates'],

    config: {
        refs: {
            invoiceDetail: 'invoicedetail',
            invoiceTitle: 'invoicedetail #title',
            saveBtn: 'invoicedetail #save',
            lineItems: 'invoicedetail invoicelineitems',
            invoiceForm: 'invoicedetail #invoiceForm',
            balanceDue: 'invoicedetail #balanceDue',
            invCodeFld: 'invoicedetail textfield[name=InvCode]',
            notesFld: 'invoicedetail textfield[name=Notes]',
            customerFld: 'invoicedetail textfield[name=CustomerName]',
            dueDateFld: 'invoicedetail extdatepickerfield[name=DueDate]',
            dateFld: 'invoicedetail extdatepickerfield[name=Date]',
            refNrFld: 'invoicedetail textfield[name=Ref]',
            amountsFld: 'invoicedetail extselectfield[name=AmountTaxStatus]',
            invStatus: 'invoicedetail #invoiceStatus',
            termsFld: 'invoicedetail textfield[name=Terms]',
            paymentDetailsFld: 'invoicedetail textfield[name=PaymentDetails]'
        },
        control: {
            'invoicedetail': {
                show: 'onShow',
                hide: 'onHide'
            },
            'invoicedetail #back': {
                tap: 'back'
            },
            'invoicedetail #save': {
                tap: 'onSave'
            },
            'invoicedetail #options': {
                tap: 'onOptions'
            },
            'invoicedetail #invoiceForm textfield': {
                tap: 'onFieldTap'
            },
            'invoicedetail extselectfield[name=AmountTaxStatus]':{
                change: 'onAmountTaxStatusSelected'
            },
            'invoicedetail #addItem': {
                tap: 'onAddItem'
            },
            'invoicedetail invoicelineitems': {
                addlineitem: 'onAddLineItem',
                editlineitem: 'onEditLineItem',
                deletelineitem: 'onDeleteLineItem'
            },
            'invoicedetail #balBreakdown': {
                tap: 'onBalanceBreakdown'
            },
            'invoicedetail #invActions': {
                tap: 'onOptions'
                //tap: 'onInvoiceActions'
            },
            dateFld : {
                change: 'onInvoiceDateChanged'
            },
            termsFld: {
                change: 'onTermsChange'
            }
        }
    },

    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);
    },

    isEditable: function() {
        return RM.InvoicesMgr.isInvoiceStatusEditable(this.detailsData.Status) && 
        RM.PermissionsMgr.canAddEdit('Invoices') && 
        (!Ext.isDefined(this.detailsData.SaveSupport) || this.detailsData.SaveSupport) &&
        !(this.detailsData.Paid > 0);         
    },
    
    showView: function (isCreate, data, cb, cbs) {
        this.lineItemsDirty = false;
        this.isCreate = isCreate;
        this.detailsData = data ? data : {};
        this.detailsCb = cb;
        this.detailsCbs = cbs;

        this.noteText = '';
        this.paymentDetailsText = '';
        this.dataLoaded = false;        
                
        if (isCreate) {
            var today = new Date();
            today.setHours(0,0,0,0);
        
            this.detailsData = Ext.applyIf(this.detailsData, { 
                Status: RM.InvoicesMgr.getInitialInvoiceStatus(), 
                AmountTaxStatus: RM.CashbookMgr.getTaxPreferences().SalesFigures, 
                Date: today, 
                Discount: 'None',
                Amount: 0,
                DiscountTotal: 0,
                Tax: 0,
                Subtotal: 0, 
                Paid: 0,
                BalanceDue: 0,
                SaveSupport: true,
                PaymentDetails: RM.CashbookMgr.getSalesPreferences().PaymentDetails
            });

            this.paymentDetailsText = this.detailsData.PaymentDetails;

            //Load the terms list from the store
            var store = Ext.getStore('Terms');
            store.getProxy().setUrl(RM.AppMgr.getApiUrl('Terms'));
            store.getProxy().setExtraParams({ Id: RM.CashbookMgr.getCashbookId() });
            RM.AppMgr.loadStore(store, this.setCashbookDefaultTerm, this);
        }
                
        var view = this.getInvoiceDetail();
        if (!view){
            view = { xtype: 'invoicedetail' };
        }           
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        RM.ViewMgr.regFormBackHandler(this.back, this);

        var dateField = this.getDateFld();
        this.getInvoiceTitle().setHtml(this.isCreate ? 'Add invoice' : 'View invoice');
        
        this.applyViewEditableRules();        
        this.getInvoiceDetail().setActionsHidden(this.isCreate);                

        if (!this.dataLoaded) {
            
            if (!this.isCreate) {                
                this.loadFormData();               
            }
            else {                
                this.loadNewInvCode();
                var invoiceForm =  this.getInvoiceForm();
                
                var data = this.detailsData;
                if (data.CustomerId) {                    
                    this.getLineItems().setCustomerId(data.CustomerId);
                }                
                
                invoiceForm.reset();
                invoiceForm.setValues(data);
                this.applyTaxRules();
                this.previousAmountTaxStatus = data.AmountTaxStatus;
                this.getBalanceDue().setHtml('');
                this.initialFormValues = invoiceForm.getValues();
                this.getLineItems().setCustomerId(null);
                this.getLineItems().setInvoiceDate(this.getDateFld().getValue());
                this.getLineItems().setTaxStatus(data.AmountTaxStatus);
                this.getInvStatus().setHtml(RM.InvoicesMgr.getInvoiceStatusText(data.Status));

                // Check that the default date in the picker isn't before the lock off date
                var curDateValue = dateField.getValue();
                var lockOffDate = RM.CashbookMgr.getLockOffDate();
                if(curDateValue.getTime() <= lockOffDate.getTime()) {
                    lockOffDate.setDate(lockOffDate.getDate() + 1);
                    dateField.updateValue(lockOffDate);                    
                }                

                this.dataLoaded = true;
            }           
        }

    },

    setCashbookDefaultTerm: function () {
        var me = this;
        var store = this.getTermsFld().getStore();
        this.getTermsFld().setValue(null);
        store.each(function (item) {
            if (item.data.IsSelected) {
                me.getTermsFld().setValue(item.data.TermID);
            }
        });
    },
    
    onHide: function(){
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },
    
    onItemUpdated: function (itemType) {
        if (itemType == 'invoice' && !this.isCreate) {            
            this.dataLoaded = false;
        }
    },
    
    onSave: function(button) {
        if(this.isFormDirty()){
            this.save();    
        }
        else{
            this.goBack();            
        }
    },
    
    applyViewEditableRules: function(){
        var editable = this.isEditable();
        this.getSaveBtn().setHidden(!editable);
        if(!editable) { RM.util.FormUtils.makeAllFieldsReadOnly(this.getInvoiceForm()); }        
        this.getLineItems().setIsEditable(editable);
    },    
    
    applyTaxRules: function() {
        var amounts = this.getAmountsFld();
        var taxPrefs = RM.CashbookMgr.getTaxPreferences();
        amounts.setReadOnly(!this.isEditable() || !taxPrefs.AllowUserIncludeTax);
        if(!this.isEditable() || !taxPrefs.AllowUserIncludeTax){
            amounts.setCls('rm-flatfield-disabled');
        }
        if(this.isCreate) {
            // New invoice behaviour
            if (taxPrefs.IsTaxTracking) {
                amounts.setHidden(false);
                amounts.setValue(taxPrefs.SalesFigures);
            }
            else
            {
                amounts.setHidden(true);
                amounts.setValue(RM.Consts.TaxStatus.NON_TAXED);
            }
        }
        else {
            // Existing invoice behaviour
            var showAmounts = taxPrefs.IsTaxTracking || amounts.getValue() !== RM.Consts.TaxStatus.NON_TAXED;
            amounts.setHidden(!showAmounts);
        }        
    },

    loadFormData: function () {        
        RM.AppMgr.getServerRecById('Invoices', this.detailsData.InvoiceId,
			function (data) {
			    //To reset readonly property when invoice status is changed back to draft, fix for bug#25428               
			    if (data.Status === RM.Consts.InvoiceStatus.DRAFT) {			        
			        this.getDateFld().setReadOnly(false);			        
			        this.getTermsFld().setReadOnly(false);
			        this.getRefNrFld().setReadOnly(false);
			    }

                if (data.Status === RM.Consts.InvoiceStatus.APPROVED && data.BalanceDue < data.Amount) {
                    this.getInvStatus().setHtml(RM.InvoicesMgr.getPartiallyPaidInvoiceStatusText());                                    
                }
                else {
                    this.getInvStatus().setHtml(RM.InvoicesMgr.getInvoiceStatusText(data.Status));
                }
                
                var invoiceForm =  this.getInvoiceForm();
			    this.getLineItems().removeAllItems();
			    this.detailsData = data;
                if(data.DueDate != null){
                   data.DueDate = RM.util.Dates.decodeAsLocal(data.DueDate);             
                }
			    data.Date = RM.util.Dates.decodeAsLocal(data.Date);
			    data.Discount = (data.DiscountPerc && data.DiscountPerc != 0) ? data.DiscountPerc + '%' : 'None';
			    data.Discount = (data.DiscountAmount && data.DiscountAmount != 0) ? RM.AppMgr.formatCurrency(data.DiscountAmount, 2) : data.Discount;			    
                this.noteText = data.Notes; //Enables preserving of new lines when going from textfield to textarea
                this.paymentDetailsText = data.PaymentDetails;

                data.Notes = data.Notes ? data.Notes.replace(/(\r\n|\n|\r)/g, ' ') : ''; //ensures new lines will be shown as spaces as Notes on form is previewed in one line. newlines entered in mobile seem to use \n where as entered in web app seem to use \r
                invoiceForm.setValues(data);
                
                this.applyTaxRules();
                this.previousAmountTaxStatus = data.AmountTaxStatus;
                
                this.applyViewEditableRules(); //needs to be called before adding line items below so that line items can have delete x hidden if necessary
                
                var lineItemsPanel = this.getLineItems();
			    lineItemsPanel.addLineItems(data.LineItems);                
                lineItemsPanel.setCustomerId(data.CustomerId);
                lineItemsPanel.setTaxStatus(data.AmountTaxStatus);
                lineItemsPanel.setInvoiceDate(data.Date);
                this.lineItemsDirty = false;
                
			    this.displayBalanceDue();
                this.initialFormValues = invoiceForm.getValues();
                this.getInvoiceDetail().setActionsHidden(false);                         

                this.dataLoaded = true;
                if(data.ViewNotice){
                    RM.AppMgr.showOkMsgBox(data.ViewNotice);
                }
			},
			this,
            function(eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
                this.goBack();
            }
		);
    },
    
    loadNewInvCode: function(){
        
        RM.AppMgr.saveServerRec('InvoiceCreate', true, null,
			function (recs) {
                this.getInvCodeFld().setValue(recs[0].InvCode);
                this.detailsData.InvCode = recs[0].InvCode;
			},
			this,
            function(recs, eventMsg){
                this.goBack();
                RM.AppMgr.showOkMsgBox(eventMsg);
            },
            'Loading...'
		);
    },
    
    isFormDirty: function(){        
        return this.lineItemsDirty || !RM.AppMgr.isFormValsEqual( this.getInvoiceForm().getValues(), this.initialFormValues);        
    },      

    onFieldTap: function (tf) {
        var fldName = tf.getName();
        
        if (fldName == 'Notes') {
            this.showNotes();
        }
        else if(fldName === 'PaymentDetails'){
            this.showPaymentDetails();
        }
        else if(this.isEditable()){
            if (fldName == 'CustomerName') {
                RM.Selectors.showCustomers(
                    null,
    				function (data) {
    				    //tf.setValue(data.Name);
    				    this.getInvoiceForm().setValues({ CustomerId: data.ContactId, CustomerName: data.Description });
    				    this.loadCustomerSpecificTermsList(data.ContactId);    				    
                        this.getLineItems().setCustomerId(data.ContactId);
                        this.calculateBreakdown();
            		},
    				this
    			);
            }
            else if (fldName == 'Discount') {
                RM.ViewMgr.hideKeyPad();
                var oldVal = tf.getValue();
    
                RM.InvoicesMgr.showChooseDiscountPopup(
                    oldVal == 'None' ? 0 : oldVal,
    				function (disc) {
                        var newVal = (disc == 0 ? 'None' : disc);
                        if(newVal != oldVal){                        
        				    tf.setValue(newVal);
                            oldVal = newVal;
                            this.calculateBreakdown(); 
                        }
    				},
    				this
    			);
            }
        }
      

    },
    
    onAmountTaxStatusSelected: function(amountTaxStatusFld, newValue, oldValue){ 
        if(!this.dataLoaded) return;
        this.detailsData.AmountTaxStatus = newValue;
        this.previousAmountTaxStatus = oldValue;
        
        var that = this;
        function proceedWithChange() {
            that.calculateBreakdown();          
            that.getLineItems().setTaxStatus(newValue);
            that.previousAmountTaxStatus = newValue;
        }
                
        // Make sure the user is aware of the impact of certain changes
        if(newValue === RM.Consts.TaxStatus.NON_TAXED && this.taxModificationsExist()) {
            RM.AppMgr.showYesNoMsgBox('This change will remove the modified tax information on all your line items, are you sure you want to do this?', 
            function(result) {
                if(result === 'yes') {
                    proceedWithChange();
                }
                else {
                    // Put the old value back, suppressing the change event at the same time
                    amountTaxStatusFld.suspendEvents();
                    amountTaxStatusFld.setValue(oldValue);
                    this.detailsData.AmountTaxStatus = oldValue;
                    amountTaxStatusFld.resumeEvents(true);
                }
            }, this);
        }
        else {
            proceedWithChange();
        }        
    },

    onTermsChange: function() {
        if (!this.getTermsFld().getValue()) {
            this.getDueDateFld().setValue('');
            this.getDueDateFld().setReadOnly(false);
        }
        this.calculateTermDueDate();
    },

    onInvoiceDateChanged: function (dateField, newValue, oldValue) {        
        if(!this.dataLoaded) return;
        //  Recalculate the invoice tax amounts, since tax rates are date dependent
        this.calculateBreakdown();
        this.getLineItems().setInvoiceDate(newValue);
        this.calculateTermDueDate(newValue);
    },
    
    showNotes: function(){
        
        RM.Selectors.showNoteText(
            'Notes',
            this.isEditable(),
            'Save',
            this.noteText,
            function(noteText){
                RM.ViewMgr.back();
                this.noteText = noteText;
                this.getNotesFld().setValue(noteText.replace(/(\r\n|\n|\r)/g, ' '));
            },
            this
        );
        
    },

    showPaymentDetails: function () {
        RM.Selectors.showNoteText(
            'Payment details',
            this.isEditable(),
            'Save',
            this.paymentDetailsText,
            function (paymentDetailsText) {
                RM.ViewMgr.back();
                this.paymentDetailsText = paymentDetailsText;
                this.getPaymentDetailsFld().setValue(paymentDetailsText.replace(/(\r\n|\n|\r)/g, ' '));
            },
            this
        );
    },
    
    onAddLineItem: function () {
        this.lineItemsDirty = true;
        this.calculateBreakdown();     
    },

    onDeleteLineItem: function () {
        this.lineItemsDirty = true;
        this.calculateBreakdown();
    },

    onEditLineItem: function(){
        this.lineItemsDirty = true;
        this.calculateBreakdown();
    },

    loadCustomerSpecificTermsList: function(CustomerId){
        var me = this;        

        RM.AppMgr.getServerRecs('Terms/GetContactTerms', { CashbookId: RM.CashbookMgr.getCashbookId(), CustomerId: CustomerId, OnlyCustomerTerm: true, OnlySupplierTerm: false },
			function response(respRecs) {
			    var store = me.getTermsFld().getStore(store);
			    store.setData(respRecs);
			    me.getTermsFld().setStore(store);
			    store.each(function (item) {
			        if (item.data.IsSelected) {
			            me.getTermsFld().setValue(item.data.TermID);
			        }
			    })
			},
			this,
            function (eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
                this.goBack();
            },
            'Loading...'
		);
    },

    

    calculateTermDueDate: function (invoiceIssueDate) {
        var me = this;
        var term = this.getTermsFld().getValue();
        var issueDate = this.getDateFld().getValue() || invoiceIssueDate;
        
        if (!term || !issueDate) {
            return;
        }

        RM.AppMgr.getServerRec('TermDueDate', { CashbookId: RM.CashbookMgr.getCashbookId(), IssueDate: issueDate, TermId: term },
			function response(respRecs) {
			    me.getDueDateFld().setValue(new Date(respRecs.DueDate));
			    me.getDueDateFld().setReadOnly(true);
			},
			this,
            function (eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
                this.goBack();
            },
            'Loading due date...'
		);
    },
    
    calculateBreakdown: function () {
        
        var formVals = this.getInvoiceForm().getValues();
        var lineItems = this.getLineItems().getViewData();
        var vals = {
            CustomerId: formVals.CustomerId,
            InvoiceDate: RM.util.Dates.encodeAsUTC(formVals.Date), 
            AmountTaxStatus: formVals.AmountTaxStatus, 
            PreviousAmountTaxStatus: this.previousAmountTaxStatus, 
            LineItems:[]
        };
        
        if (formVals.Discount.indexOf('%') > -1) {
            vals.DiscountPercentage = formVals.Discount.replace('%', '');
        }
        else if (formVals.Discount.indexOf('$') > -1) {
            vals.DiscountAmount = formVals.Discount.replace('$', '');
        }
      
        if(vals.PreviousAmountTaxStatus !== vals.AmountTaxStatus) {
            if(vals.AmountTaxStatus === RM.Consts.TaxStatus.NON_TAXED) {
                // House keeping. The calcs api doesn't handle removing things like the tax group and tax amounts when 
                // switching to NON-TAXED so we remove them first.
                lineItems = lineItems.map(function(item) {
                    item.TaxGroupId = null;
                    item.Tax = null;
                    item.TaxIsModified = false;
                    return item;
                });
            }
            else if(vals.PreviousAmountTaxStatus === RM.Consts.TaxStatus.NON_TAXED) {
                // User is changing from NON-TAXED to a Tax-incl state. Apply the default tax group to each of the line items.
                lineItems = lineItems.map(function(item) {
                    item.TaxGroupId = item.DefaultTaxGroupId;
                    return item;
                });
            }
        }
        
        // Send only the fields required by the calculation contract for line items
        vals.LineItems = lineItems.map(function(item) {
            return {
                InvoiceLineItemId: item.InvoiceLineItemId,
                ItemType: item.ItemType, 
                ItemId: item.ItemId, 
                ProjectId: item.ProjectId,
                Quantity: item.Quantity, 
                UnitPriceExTax: item.UnitPriceExTax, 
                DiscountAmount: item.DiscountAmount,
                DiscountAmountExTax: item.DiscountAmountExTax,
                DiscountAmountTax: item.DiscountAmountTax,
                DiscountPercentage: item.DiscountPercentage,
                TaxGroupId: item.TaxGroupId, 
                Tax: item.Tax, 
                TaxIsModified: item.TaxIsModified,
                AccountId: item.AccountId,
                TaxExclusiveTotalAmount: item.AmountExTax,
                IsParent: item.IsParent,
                IsSubTotal: item.IsSubTotal
            };            
        });         
                
        RM.AppMgr.saveServerRec('InvoiceCalc', true, vals,
			function response(respRecs) {
                var respRec = respRecs[0];                
                
                var data = this.detailsData;
                data.Amount = respRec.TotalIncludingTax;
                data.AmountExTax = respRec.TotalExcludingTax;
                data.Tax = respRec.Tax;
                data.Subtotal = respRec.Subtotal;
                data.DiscountTotal = respRec.Discount || 0;
                data.Paid = respRec.AmountPaid;
                data.BalanceDue = respRec.BalanceDue;
                
                var lineItemsPanel = this.getLineItems();
                lineItemsPanel.removeAllItems();
                
                for (var i = 0; i < lineItems.length; i++) {
                    var currentLine = lineItems[i];
                    
                    // find the result for the line
                    var resultLine = null;                    
                    Ext.Array.some(respRec.Items, function(item) {
                        if(item.InvoiceLineItemId === currentLine.InvoiceLineItemId) {
                            resultLine = item;
                            return true;
                        }
                    });
                    
                    // If the item isn't in the response, it must be removed (project/customer filtering is potentially applied server-side)
                    if(!resultLine) {
                        lineItems[i] = null;
                    }
                    else {
                        // Map the calculated values across
                        Ext.apply(currentLine, resultLine);
                    }                    
                }
                
                // Clean out any deleted items
                lineItems = Ext.Array.clean(lineItems);
                
                lineItemsPanel.setTaxStatus(vals.AmountTaxStatus);
                lineItemsPanel.addLineItems(lineItems);
                
                this.displayBalanceDue();
                
			},
			this,
            function(eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
                this.goBack();
            },
            'Loading...'
		);         

    },

    displayBalanceDue: function () {        
        this.getBalanceDue().setHtml(RM.AppMgr.formatCurrency(this.detailsData.BalanceDue, 2));
    },

    onBalanceBreakdown: function () {
        RM.InvoicesMgr.showBalanceBreakdown(this.detailsData);
    },

    onInvoiceActions: function () {
        if(this.isCreate){
            RM.AppMgr.showOkMsgBox('Invoice Actions are only available after saving new invoices.');            
        }
        else{
            RM.InvoicesMgr.showActions(this.detailsData);    
        }        
    },

    goBack: function(){        
        this.detailsCb.call(this.detailsCbs, 'back');
        RM.ViewMgr.back();
        this.getLineItems().removeAllItems();
        this.dataLoaded = false; 
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

    onOptions: function () {
        if(this.isFormDirty()) {
            RM.AppMgr.showOkCancelMsgBox('You must save your changes to continue, save now?',
                function(btn) {
                    if(btn == 'ok'){
                        this.save(this.onInvoiceActions);                                     
                    }
                },
                this
            );
        }
        else {
            this.onInvoiceActions();
        }              
    },

    validateForm: function(vals){        
        var isValid = true;

        if(!vals.CustomerId){
            this.getCustomerFld().showValidation(false);
            isValid = false;
        } 
        
        this.getLineItems().validateForm(); //still return isValid = true even if no line items, as the 'No items have been added to this invoice.' will be shown in save()
        
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
        
        return isValid;
    },
    
    save: function (afterSaveCallback) {
        var formVals = this.getInvoiceForm().getValues();        
        formVals.LineItems = Ext.clone(this.getLineItems().getViewData());
        
        var vals = Ext.applyIf(formVals, this.detailsData);
        delete vals.DiscountPerc;
        delete vals.DiscountAmount;

        if (vals.Discount.indexOf('%') > -1) {
            vals.DiscountPerc = vals.Discount.replace('%', '');
        }
        else if (vals.Discount.indexOf('$') > -1) {
            vals.DiscountAmount = vals.Discount.replace('$', '');
        }
        delete vals.Discount;
        
        vals.Notes = this.noteText;
        vals.PaymentDetails = this.paymentDetailsText;

        // Some date fernagling, the default json serialization of dates will format the date in UTC which will alter the time from 00:00:00
        vals.Date = RM.util.Dates.encodeAsUTC(vals.Date);
        vals.DueDate = vals.DueDate ? RM.util.Dates.encodeAsUTC(vals.DueDate) : null;
        
        if(this.validateForm(vals)){
            if(formVals.LineItems.length > 0){                
                // Some line item admin
                var lineNumber = 1;
                formVals.LineItems.forEach(function(item) {
                    item.lineNo = lineNumber;
                    
                    // Remove the temporary Id for any new items, since the server is way too trusting
                    if(item.IsNew) {
                        delete item.InvoiceLineItemId;                
                    }
                    
                    // Set the line numbers to handle new or deleted items
                    lineNumber += 1;
                });   
                
                this.detailsCb.call(this.detailsCbs, 'save', vals);

                RM.AppMgr.getServerRecById('CustomerAvailableCreditLimit', vals.CustomerId,
                        function (data) {
                            if (data.HasCreditLimit && vals.BalanceDue > 0 && data.AvailableCredit < vals.BalanceDue)
                            {
                                RM.AppMgr.showCustomiseButtonMsgBox("This invoice will exceed the customer's credit limit. Save anyway?", 'YES, SAVE INVOICE', 'NO, CONTINUE EDITING',
                                 function (result) {
                                     if (result === 'yes') {
                                         this.saveInvoice(afterSaveCallback, vals);
                                     }
                                     else {
                                         //Stay on the current screen for the user user to modify.
                                         return;
                                     }
                                 }, this);
                            }
                            else {
                                this.saveInvoice(afterSaveCallback, vals);
                            };
                        },
                        this,
                        function (eventMsg) {
                            RM.AppMgr.showOkMsgBox(eventMsg);
                        }
                    );       
            }
            else{            
                RM.AppMgr.showErrorMsgBox('No items have been added to this invoice.');
            }                
        }


    },

    // Check all the lineItems for modifications to tax code or tax amount
    taxModificationsExist: function() {
        var lineItems = this.getLineItems().getViewData();
        var changesExist = false;
        
        Ext.Array.some(lineItems, function(item) {
            if(item.TaxIsModified || item.TaxGroupId !== item.DefaultTaxGroupId) {
                changesExist = true;
                return true;
            }            
        });
        
        return changesExist;
    },
    saveInvoice: function (afterSaveCallback, vals)
    {
        RM.AppMgr.saveServerRec('Invoices', this.isCreate, vals,
                    function (recs) {
                        RM.AppMgr.itemUpdated('invoice');

                        if (afterSaveCallback) {
                            if (this.isCreate) {
                                this.detailsData.InvoiceId = recs[0].InvoiceId;
                                this.detailsData.TemplateId = recs[0].TemplateId;
                            }
                            this.detailsData.CustomerId = vals.CustomerId;
                            this.detailsData.AccountsReceivableCategoryId = recs[0].AccountsReceivableCategoryId;
                            // Clear the loaded flag to force a reload of invoice information when the view is shown again                            
                            this.dataLoaded = false;
                            this.isCreate = false;
                            afterSaveCallback.apply(this);
                        }
                        else {
                            this.goBack();
                        }
                    },
                    this,
                    function (recs, eventMsg) {
                        RM.AppMgr.showOkMsgBox(eventMsg);
                    }
        );
    }
  
});
