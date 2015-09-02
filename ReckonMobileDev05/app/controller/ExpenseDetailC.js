Ext.define('RM.controller.ExpenseDetailC', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            expenseDetail: 'expensedetail',
            expenseTitle: 'expensedetail #title',
            expenseStatus: 'expensedetail #expenseStatus',
            saveBtn: 'expensedetail #save',
            expenseForm: 'expensedetail #expenseForm',
            customerId: 'expensedetail hiddenfield[name=CustomerID]',
            //supplierId: 'expensedetail hiddenfield[name=SupplierID]',
            projectId: 'expensedetail hiddenfield[name=ProjectID]',
            //description: 'expensedetail #description',
            //historyFld: 'expensedetail #history',
            //photoBtn: 'expensedetail #photo',
            dateFld: 'expensedetail extdatepickerfield[name=ExpenseClaimDate]',
            amountFld:  'expensedetail exttextfield[name=Amount]',
            itemFld:  'expensedetail exttextfield[name=ItemName]',
            //supplierFld: 'expensedetail exttextfield[name=SupplierName]',
            lineItems: 'expensedetail expenselineitems',
        },
        control: {
            'expensedetail': {
                show: 'onShow',
                hide: 'onHide'
            },
            'expensedetail #back': {
                tap: 'back'
            },
            'expensedetail #save': {
                tap: 'save'
            },
            //'expensedetail #photo': {
            //    tap: 'onPhoto'
            //},
            'expensedetail #expenseForm exttextfield': {
                tap: 'onFieldTap'
            },
            'expensedetail expenselineitems': {
                addlineitem: 'onAddLineItem',
                editlineitem: 'onEditLineItem',
                deletelineitem: 'onDeleteLineItem'
            },
            'expensedetail extselectfield[name=AmountTaxStatus]': {
                change: 'onAmountTaxStatusSelected'
            },
            'expensedetail #addItem': {
                tap: 'onAddItem'
            }
        }
    },

    init: function () {
        this.serverApiName = 'Expenses';
    },

    isEditable: function () {
        return RM.ExpensesMgr.isStatusEditable(this.detailsData.Status) &&
        RM.PermissionsMgr.canAddEdit('ExpenseClaims');
    },

    applyViewEditableRules: function () {
        var editable = this.isEditable();
        this.getSaveBtn().setHidden(!editable);
        if (!editable) { RM.util.FormUtils.makeAllFieldsReadOnly(this.getExpenseForm()); }
        this.getLineItems().setIsEditable(editable);
    },

    applyTaxRules: function () {
        //var amounts = this.getAmountsFld();
        //var taxPrefs = RM.CashbookMgr.getTaxPreferences();
        //amounts.setReadOnly(!this.isEditable() || !taxPrefs.AllowUserIncludeTax);
        //if (!this.isEditable() || !taxPrefs.AllowUserIncludeTax) {
        //    amounts.setCls('rm-flatfield-disabled');
        //}
        //if (this.isCreate) {
        //    // New invoice behaviour
        //    if (taxPrefs.IsTaxTracking) {
        //        amounts.setHidden(false);
        //        amounts.setValue(taxPrefs.SalesFigures);
        //    }
        //    else {
        //        amounts.setHidden(true);
        //        amounts.setValue(RM.Consts.TaxStatus.NON_TAXED);
        //    }
        //}
        //else {
        //    // Existing invoice behaviour
        //    var showAmounts = taxPrefs.IsTaxTracking || amounts.getValue() !== RM.Consts.TaxStatus.NON_TAXED;
        //    amounts.setHidden(!showAmounts);
        //}
    },

    showView: function (data, cb, cbs) {
        this.lineItemsDirty = false;
        this.isCreate = (data == null);
        this.detailsData = data;
        this.detailsCb = cb;
        this.detailsCbs = cbs;

        this.noteText = '';
        
        if (this.isCreate){
            this.detailsData = {HasReceiptPhoto: false, Date: new Date(), StatusCode:'b'}; // { TaxTypeId: '52c59eb2-7dc3-411b-848a-27c4aa7378b7', UserId: '00000000-0000-0000-0000-000000000000', StatusCode: '' };
        }

        var view = this.getExpenseDetail();
        if (!view){
            view = { xtype: 'expensedetail' };
        }            
        RM.ViewMgr.showPanel(view);
        
    },

    onShow: function () {
        RM.ViewMgr.regFormBackHandler(this.back, this);
        this.getExpenseTitle().setHtml(this.isCreate ? 'Add Expense' : 'View Expense');

        if (!this.dataLoaded) {
            var expenseForm = this.getExpenseForm();
            if (!this.isCreate) {
                RM.AppMgr.getServerRecById(this.serverApiName, this.detailsData.ExpenseClaimID,
					function (data) {
					    //data.HasReceiptPhoto = true;
					    this.getExpenseStatus().setHidden(false);
					    this.getExpenseStatus().setHtml(RM.ExpensesMgr.getExpenseStatusText(data.Status));
					    this.detailsData = data;                        
					    data.ExpenseClaimDate = new Date(data.ExpenseClaimDate);
					    //delete data.Notes;
                        //data.SaleTaxCodeId = data.TaxTypeId;
					    //expenseForm.setValues(data);
                        //this.noteText = data.Notes; //Enables preserving of new lines when going from textfield to textarea
                        //data.Notes = data.Notes ? data.Notes.replace(/(\r\n|\n|\r)/g, ' ') : '';
                        expenseForm.setValues(data);
					    ////this.setPhotoBtnIcon();
                        this.applyTaxRules();
                        this.previousAmountTaxStatus = data.AmountTaxStatus;

                        this.applyViewEditableRules(); //needs to be called before adding line items below so that line items can have delete x hidden if necessary

                        var lineItemsPanel = this.getLineItems();
                        lineItemsPanel.addLineItems(data.Items);
                        lineItemsPanel.setCustomerId(data.CustomerId);
                        lineItemsPanel.setTaxStatus(data.AmountTaxStatus);
                        lineItemsPanel.setExpenseDate(data.Date);
                        this.lineItemsDirty = false;

                        //this.displayBalanceDue();

                        this.initialFormValues = expenseForm.getValues();
                        
                        //this.hasExistingReceiptPhoto = data.HasReceiptPhoto;
					},
					this
				);
            }
            else{                
                expenseForm.reset();
                this.detailsData.ExpenseClaimDate = new Date();
                expenseForm.setValues(this.detailsData);                
                //this.setPhotoBtnIcon();
                this.initialFormValues = expenseForm.getValues();               
            }
            this.dataLoaded = true;
        }

        this.getExpenseForm().setValues(this.detailsData);
    },    
    
    onHide: function(){
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },    

    isFormDirty: function(){        
        return !RM.AppMgr.isFormValsEqual(this.getExpenseForm().getValues(), this.initialFormValues);        
    },   
    
    //setPhotoBtnIcon: function(){
    //    var photoBtn = this.getPhotoBtn(),iconDir = 'resources/images/icons/';
    //    if(this.detailsData.HasReceiptPhoto){
    //        photoBtn.setIcon(iconDir + 'rm-attach.svg');
    //        photoBtn.setText('Photo attached');             
    //    }
    //    else{
    //        photoBtn.setIcon(iconDir + 'rm-photo.svg');
    //        photoBtn.setText('Photograph the receipt');             
    //    }
       
    //},    
    
    onFieldTap: function (tf) {
        if (!this.isEditable()) {
            return;
        }

        if (tf.getName() == 'CustomerName') {
            RM.Selectors.showCustomers(
                this.getProjectId().getValue(),
				function (data) {
				    tf.setValue(data.Name);
				    this.getExpenseForm().setValues({ CustomerID: data.ContactId, CustomerName: data.Description });
				},
				this
			);
        }
        else if (tf.getName() == 'ProjectName') {
            RM.Selectors.showProjects(
                this.getCustomerId().getValue(),
                null,
				function (data) {
				    tf.setValue(data.Name);	
				    this.getExpenseForm().setValues({ ProjectID: data.ProjectId, ProjectName: data.ProjectPath});
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
                    var rec = data[0];
				    this.detailsData.TaxTypeId = rec.SaleTaxCodeId;
				    //this.getExpenseForm().setValues({ ItemId: data[0].ItemId, ItemName: data[0].Name, SaleTaxCodeId: data[0].SaleTaxCodeId });
                    this.getExpenseForm().setValues({ ItemId:rec.ItemId, ItemName:rec.ItemPath});
				},
				this
			);
        }
        
        //else if (tf.getName() == 'Notes') {
        //    this.editDescription();
        //}
        //else if (tf.getItemId() == 'history') {
        //    RM.Selectors.showHistory('Expense', RM.Consts.HistoryTypes.EXPENSE, this.detailsData.ExpenseId);
        //}         

    },

    editDescription: function(){
        
        var isEditable = true; //change this when doing expense business rules
        
        RM.Selectors.showNoteText(
            'Description',
            isEditable,
            'Save',
            this.noteText,
            function(noteText){
                RM.ViewMgr.back();
                this.noteText = noteText; //Enables preserving of new lines when going from textfield to textarea
                this.getDescription().setValue(noteText.replace(/(\r\n|\n|\r)/g, ' '));
            },
            this
        );        
        
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
    
    goBack: function(){
        this.detailsCb.call(this.detailsCbs, 'back');
        RM.ViewMgr.back();
        this.dataLoaded = false;        
    },
    
    validateForm: function(vals){        
        var isValid = true;
        
        if(!vals.Amount){
            this.getAmountFld().showValidation(false);
            isValid = false;
        }
        if(!vals.ItemName){
            this.getItemFld().showValidation(false);
            isValid = false;
        }
        if(!vals.SupplierName){
            this.getSupplierFld().showValidation(false);
            isValid = false;
        }
        
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
        
        return isValid;
    },    

    onPhoto: function () {
        
        var receiptImage = null;
        if(this.receiptImage){
            receiptImage = this.receiptImage;
        }
        else if(this.detailsData.HasReceiptPhoto){
            receiptImage = RM.AppMgr.getApiUrl('ReceiptImages') + '/' + this.detailsData.ExpenseId + '?_t=' + new Date().getTime();
        }        
        
        RM.Selectors.showReceiptPhotoPreview(!this.detailsData.HasReceiptPhoto, receiptImage, 
            function(option, imgData){
                if(option == 'attachnew'){
                    this.receiptImage = imgData;
                    this.detailsData.HasReceiptPhoto = true;                    
                }
                else if(option == 'attach'){
                    this.detailsData.HasReceiptPhoto = true;                    
                }                
                this.setPhotoBtnIcon();
            }, 
            this
        );

    },

    save: function () {
        var formVals = this.getExpenseForm().getValues();
        formVals.Billable = this.getBillableCheckbox().getValue();
        var vals = Ext.applyIf(formVals, this.detailsData);

        vals.Notes = this.noteText;
        var receiptImageIsFile = this.receiptImage && (this.receiptImage.indexOf(';base64,') == -1);
        
        if(this.validateForm(vals)){        
            if(receiptImageIsFile){
                this.uploadPhotoFile(vals);            
            }
            else{
                this.uploadPhotoData(vals);
            }
        }
    },
    
    uploadPhotoFile: function(vals){   
        
        var me = this, options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = this.receiptImage.substr(this.receiptImage.lastIndexOf('/') + 1);
        options.mimeType = "image/jpg";           
        
        options.params = {
            Date: Ext.util.Format.date(vals.Date, 'c'),
            Amount: vals.Amount,
            ItemId: vals.ItemId,
            //SupplierId: vals.SupplierId,
            Notes: vals.Notes,
            Billable: vals.Billable == 1 ? 'true' : 'false',
            StatusCode: vals.StatusCode
        };
        
        if(vals.ExpenseId) options.params.ExpenseId = vals.ExpenseId;
        if(vals.ProjectId) options.params.ProjectId = vals.ProjectId;
        if(vals.CustomerId) options.params.CustomerId = vals.CustomerId;
        if(vals.TaxTypeId) options.params.ExpenseId = vals.TaxTypeId;
        
        var ft = new FileTransfer();            
        
        ft.onprogress = function(progressEvent) {
            /*if (progressEvent.lengthComputable) {
              loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
            } else {
              loadingStatus.increment();
            }*/            
        };
        
        ft.upload(this.receiptImage, RM.AppMgr.getApiUrl('Expenses'), win, fail, options);
        var msgBox = RM.AppMgr.showRMProgressPopup('<b>Loading Expense with photo...</b>','<div style="color: #A0A0A0; font-size: 90%;">This may take a while</br>depending on your connection</div>','', [{text: 'CANCEL', itemId: 'cancel'}], function(){            
            ft.abort(win, fail);
        }, me);
        
        function win(r) {
            //alert("Code = " + r.responseCode + '  Response = ' + r.response + '  Sent = ' + r.bytesSent);
            msgBox.hide();
            RM.AppMgr.showSuccessMsgBox('Expense saved',function(){
               me.goBack();
                RM.AppMgr.itemUpdated('expense');
            }, me);            
        }
        
        function fail(error) {
            msgBox.hide();
            RM.AppMgr.showFailureMsgBox('Save not successful', me.handlePhotoUploadChoices, me);
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }
    },
    
    handlePhotoUploadChoices: function(choice){
        if(choice == 'retry'){
            this.save();
        }
        if(choice == 'cancel'){            
            
        } 
    },
    
    uploadPhotoData: function(vals){
        var boundary = '++++++reckononemobile.formBoundary', postData = '';       
        if(vals.ExpenseId) postData += this.genFormDataFld('ExpenseId', vals.ExpenseId, boundary);
        if(vals.ProjectId) postData += this.genFormDataFld('ProjectId', vals.ProjectId, boundary);
        if(vals.CustomerId) postData += this.genFormDataFld('CustomerId', vals.CustomerId, boundary);
        postData += this.genFormDataFld('Date', Ext.util.Format.date(vals.Date, 'c'), boundary);
        postData += this.genFormDataFld('Amount', vals.Amount, boundary);
        postData += this.genFormDataFld('ItemId', vals.ItemId, boundary);
        //postData += this.genFormDataFld('SupplierId', vals.SupplierId, boundary);
        postData += this.genFormDataFld('Notes', vals.Notes, boundary);
        postData += this.genFormDataFld('Billable', vals.Billable, boundary);
        postData += this.genFormDataFld('StatusCode', vals.StatusCode, boundary);
        if(vals.TaxTypeId) postData += this.genFormDataFld('TaxTypeId', vals.TaxTypeId, boundary);
        
        if(this.receiptImage){
            var imgData = this.receiptImage.substr(this.receiptImage.indexOf(';base64,') + 8);
            postData += this.genFormFileField('receipt.png', imgData, boundary);
        }
        postData += '--' + boundary + '--\r\n';
        
        Ext.Ajax.request({
            method:"POST",
            headers: {
                'Content-Type': 'multipart/form-data; boundary=' + boundary
            },
            rawData: postData,
            url: RM.AppMgr.getApiUrl('Expenses'),
            success: function (response) {
                var resp = Ext.decode(response.responseText);
                if(resp.success){
                    RM.AppMgr.showSuccessMsgBox('Expense saved',function(){
                       RM.AppMgr.itemUpdated('expense');
                       this.goBack(); 
                    }, this);                        
                }
                else{
                     RM.AppMgr.showOkMsgBox(resp.eventMsg);
                }
                
            },
            failure: function (resp) {
                RM.AppMgr.handleServerCallFailure(resp);
            },
            scope: this
        });
        
    },
    
    genFormDataFld: function(fldName, fldVal, boundary){        
        return '--' + boundary + '\r\nContent-Disposition: form-data; name="' + fldName +  '"\r\n\r\n' + fldVal + '\r\n';
    },
    
    genFormFileField: function(fileName, fileData, boundary){
        return '--' + boundary + '\r\nContent-Disposition: form-data; name="file"; filename="' + fileName + '"\r\nContent-Transfer-Encoding: base64\r\nContent-Type: image/png\r\n\Content-Length: ' + fileData.length + '\r\n\r\n' + fileData + '\r\n';
    },

    onAddLineItem: function () {
        this.lineItemsDirty = true;
        this.calculateBreakdown();
    },

    onDeleteLineItem: function () {
        this.lineItemsDirty = true;
        this.calculateBreakdown();
    },

    onEditLineItem: function () {
        this.lineItemsDirty = true;
        this.calculateBreakdown();
    },

    onAmountTaxStatusSelected: function (amountTaxStatusFld, newValue, oldValue) {
        if (!this.dataLoaded) return;
        this.detailsData.AmountTaxStatus = newValue;
        this.previousAmountTaxStatus = oldValue;

        var that = this;
        function proceedWithChange() {
            that.calculateBreakdown();
            that.getLineItems().setTaxStatus(newValue);
            that.previousAmountTaxStatus = newValue;
        }

        // Make sure the user is aware of the impact of certain changes
        if (newValue === RM.Consts.TaxStatus.NON_TAXED && this.taxModificationsExist()) {
            RM.AppMgr.showYesNoMsgBox('This change will remove the modified tax information on all your line items, are you sure you want to do this?',
            function (result) {
                if (result === 'yes') {
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
    
    calculateBreakdown: function () {

        var formVals = this.getExpenseForm().getValues();
        var lineItems = this.getLineItems().getViewData();
        var vals = {
            CustomerId: formVals.CustomerId,
            //ExpenseDate: RM.util.Dates.encodeAsUTC(formVals.Date),
            AmountTaxStatus: formVals.AmountTaxStatus,
            PreviousAmountTaxStatus: this.previousAmountTaxStatus,
            LineItems: []
        };

        if (vals.PreviousAmountTaxStatus !== vals.AmountTaxStatus) {
            if (vals.AmountTaxStatus === RM.Consts.TaxStatus.NON_TAXED) {
                // House keeping. The calcs api doesn't handle removing things like the tax group and tax amounts when 
                // switching to NON-TAXED so we remove them first.
                lineItems = lineItems.map(function (item) {
                    item.TaxGroupId = null;
                    item.Tax = null;
                    item.TaxIsModified = false;
                    return item;
                });
            }
            else if (vals.PreviousAmountTaxStatus === RM.Consts.TaxStatus.NON_TAXED) {
                // User is changing from NON-TAXED to a Tax-incl state. Apply the default tax group to each of the line items.
                lineItems = lineItems.map(function (item) {
                    item.TaxGroupId = item.DefaultTaxGroupId;
                    return item;
                });
            }
        }

        // Send only the fields required by the calculation contract for line items
        vals.LineItems = lineItems.map(function (item) {
            return {
                ExpenseLineItemId: item.ExpenseLineItemId,
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

        //RM.AppMgr.saveServerRec('ExpenseCalc', true, vals,
		//	function response(respRecs) {
		//	    var respRec = respRecs[0];

		//	    var data = this.detailsData;
		//	    data.Amount = respRec.TotalIncludingTax;
		//	    data.AmountExTax = respRec.TotalExcludingTax;
		//	    data.Tax = respRec.Tax;
		//	    data.Subtotal = respRec.Subtotal;
		//	    data.DiscountTotal = respRec.Discount || 0;
		//	    data.Paid = respRec.AmountPaid;
		//	    data.BalanceDue = respRec.BalanceDue;

		//	    var lineItemsPanel = this.getLineItems();
		//	    lineItemsPanel.removeAllItems();

		//	    for (var i = 0; i < lineItems.length; i++) {
		//	        var currentLine = lineItems[i];

		//	        // find the result for the line
		//	        var resultLine = null;
		//	        Ext.Array.some(respRec.Items, function (item) {
		//	            if (item.ExpesneLineItemId === currentLine.ExpenseLineItemId) {
		//	                resultLine = item;
		//	                return true;
		//	            }
		//	        });

		//	        // If the item isn't in the response, it must be removed (project/customer filtering is potentially applied server-side)
		//	        if (!resultLine) {
		//	            lineItems[i] = null;
		//	        }
		//	        else {
		//	            // Map the calculated values across
		//	            Ext.apply(currentLine, resultLine);
		//	        }
		//	    }

		//	    // Clean out any deleted items
		//	    lineItems = Ext.Array.clean(lineItems);

		//	    lineItemsPanel.setTaxStatus(vals.AmountTaxStatus);
		//	    lineItemsPanel.addLineItems(lineItems);

		//	    this.displayBalanceDue();

		//	},
		//	this,
        //    function (eventMsg) {
        //        RM.AppMgr.showOkMsgBox(eventMsg);
        //        this.goBack();
        //    },
        //    'Loading...'
		//);
    },

    // Check all the lineItems for modifications to tax code or tax amount
    taxModificationsExist: function () {
        var lineItems = this.getLineItems().getViewData();
        var changesExist = false;

        Ext.Array.some(lineItems, function (item) {
            if (item.TaxIsModified || item.TaxGroupId !== item.DefaultTaxGroupId) {
                changesExist = true;
                return true;
            }
        });

        return changesExist;
    }


});