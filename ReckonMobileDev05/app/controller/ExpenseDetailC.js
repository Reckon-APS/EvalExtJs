Ext.define('RM.controller.ExpenseDetailC', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            expenseDetail: 'expensedetail',
            expenseTitle: 'expensedetail #title',
            saveBtn: 'expensedetail #save',
            expenseForm: 'expensedetail #expenseForm',
            customerId: 'expensedetail hiddenfield[name=CustomerId]',
            supplierId: 'expensedetail hiddenfield[name=SupplierId]',
            projectId: 'expensedetail hiddenfield[name=ProjectId]',
            description: 'expensedetail #description',
            billableCheckbox: 'expensedetail rmtogglefield[name=Billable]',
            historyFld: 'expensedetail #history',
            //photoBtn: 'expensedetail #photo',
            dateFld: 'expensedetail extdatepickerfield[name=Date]',
            amountFld:  'expensedetail exttextfield[name=Amount]',
            itemFld:  'expensedetail exttextfield[name=ItemName]',
            supplierFld:  'expensedetail exttextfield[name=SupplierName]'
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
            }
        }
    },

    init: function () {
        this.serverApiName = 'Expenses';
    },

    showView: function (data, cb, cbs) {
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
            this.getHistoryFld().setHidden(this.isCreate);
            var expenseForm = this.getExpenseForm();
            if (!this.isCreate) {
                RM.AppMgr.getServerRecById(this.serverApiName, this.detailsData.ExpenseId,
					function (data) {
                        //data.HasReceiptPhoto = true;
					    this.detailsData = data;                        
					    data.Date = new Date(data.Date);
					    //delete data.Notes;
                        //data.SaleTaxCodeId = data.TaxTypeId;
					    //expenseForm.setValues(data);
                        this.noteText = data.Notes; //Enables preserving of new lines when going from textfield to textarea
                        data.Notes = data.Notes ? data.Notes.replace(/(\r\n|\n|\r)/g, ' ') : '';
                        expenseForm.setValues(data);
					    this.getBillableCheckbox().setValue(data.Billable);
                        this.setPhotoBtnIcon();
                        this.initialFormValues = expenseForm.getValues();
                        this.hasExistingReceiptPhoto = data.HasReceiptPhoto;
					},
					this
				);
            }
            else{                
                expenseForm.reset();
                expenseForm.setValues(this.detailsData);
                //this.setPhotoBtnIcon();
                this.initialFormValues = expenseForm.getValues();               
            }
            this.dataLoaded = true;
        }

        //this.getExpenseForm().setValues(this.detailsData);
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

        if (tf.getName() == 'CustomerName') {
            RM.Selectors.showCustomers(
                this.getProjectId().getValue(),
				function (data) {
				    //tf.setValue(data.Name);
				    this.getExpenseForm().setValues({ CustomerId: data.ContactId, CustomerName: data.Description });
				},
				this
			);
        }
        else if (tf.getName() == 'ProjectName') {
            RM.Selectors.showProjects(
                this.getCustomerId().getValue(),
                this.getSupplierId().getValue(),
				function (data) {
				    //tf.setValue(data.Name);	
				    this.getExpenseForm().setValues({ ProjectId: data.ProjectId, ProjectName: data.ProjectPath});
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
        else if (tf.getName() == 'SupplierName') {
            RM.Selectors.showSuppliers(
				function (data) {
				    //tf.setValue(data.Name);
				    this.getExpenseForm().setValues({ SupplierId: data.SupplierId, SupplierName: data.Name });
				},
				this
			);
        }
        else if (tf.getName() == 'Notes') {
            this.editDescription();
        }
        else if (tf.getItemId() == 'history') {
            RM.Selectors.showHistory('Expense', RM.Consts.HistoryTypes.EXPENSE, this.detailsData.ExpenseId);
        }         

    },

    editDescription: function(){
        
        var isEditable = true; //change this when doing expense business rules
        
        RM.Selectors.showNoteText(
            'Description',
            isEditable,
            'OK',
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
            SupplierId: vals.SupplierId,
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
        postData += this.genFormDataFld('SupplierId', vals.SupplierId, boundary);
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
    }
    

});