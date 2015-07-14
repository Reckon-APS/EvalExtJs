Ext.define('RM.controller.TimeSheetDetailC', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            timeSheetDetail: 'timesheetdetail',
            timeSheetTitle: 'timesheetdetail #title',
            saveBtn: 'timesheetdetail #save',
            timeSheetForm: 'timesheetdetail #timeSheetForm',
            customerId: 'timesheetdetail hiddenfield[name=CustomerId]',
            customerName: 'timesheetdetail textfield[name=CustomerName]',
            projectId: 'timesheetdetail hiddenfield[name=ProjectId]',
            billable: 'timesheetdetail checkboxfield',
            description: 'timesheetdetail #description',
            billableCheckbox: 'timesheetdetail rmtogglefield[name=Billable]',
            itemName: 'timesheetdetail #itemName',
            duration: 'timesheetdetail #duration',
            dateFld: 'timesheetdetail extdatepickerfield[name=Date]',
            loadBtn: 'timesheetdetail #loadbtn',
            resetBtn: 'timesheetdetail #resetbtn',
            deleteBtn: 'timesheetdetail #deletebtn',
            status: 'timesheetdetail #status'
        },
        control: {
            'timesheetdetail': {
                show: 'onShow',
                hide: 'onHide'
            },
            'timesheetdetail #back': {
                tap: 'back'
            },
            'timesheetdetail #save': {
                tap: 'save'
            },
            'timesheetdetail #timeSheetForm exttextfield': {
                tap: 'onFieldTap'
            },
            'timesheetdetail #timeSheetForm textfield[name=CustomerName]':{
                change: 'onCustomerChange'
            },
            loadBtn: {
                tap: 'onLoadBtnTap'
            },
            resetBtn: {
                tap: 'onResetBtnTap'
            },deleteBtn : {
                tap: 'onDelete'
            }
        }
    },

    init: function () {
        this.serverApiName = 'TimeEntries';
    },

    showView: function (data, cb, cbs) {
        this.isCreate = (data == null);
        this.detailsData = data;
        this.detailsCb = cb;
        this.detailsCbs = cbs;
        
        this.noteText = '';

        this.dataLoaded = false;
        if (this.isCreate)
            this.detailsData = {Date: new Date()}; // { TaxTypeId: '52c59eb2-7dc3-411b-848a-27c4aa7378b7', UserId: '00000000-0000-0000-0000-000000000000', StatusCode: 'b' };

        var view = this.getTimeSheetDetail();
        if (!view){
            view = { xtype: 'timesheetdetail' };
        }           
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        RM.ViewMgr.regFormBackHandler(this.back, this);
        this.getTimeSheetTitle().setHtml(this.isCreate ? 'Add entry' : 'View entry');

        if (!this.dataLoaded) {
            var timesheetForm = this.getTimeSheetForm();
            timesheetForm.reset();
            if (!this.isCreate) {
                RM.AppMgr.getServerRecById(this.serverApiName, this.detailsData.TimeEntryId,
					function (data) {
					    this.detailsData = data;
					    data.Date = new Date(data.Date);
					    //delete data.Notes;
                        //data.SaleTaxCodeId = data.TaxTypeId;					    
                        this.noteText = data.Notes; //Enables preserving of new lines when going from textfield to textarea                        
                        data.Notes = data.Notes ? data.Notes.replace(/(\r\n|\n|\r)/g, ' ') : '';
                        timesheetForm.setValues(data);
                        this.getBillableCheckbox().setValue(data.Billable);
                        this.getStatus().setHidden(false);
                        this.getStatus().setHtml(RM.TimeSheetsMgr.getTimeSheetStatusText(data.Status));
                        this.openInEditMode();
                        this.applyViewEditableRules();
                        this.applyBillablePermission();
					    this.initialFormValues = timesheetForm.getValues();
					},
					this
				);
            }
            else{
                timesheetForm.reset();
                timesheetForm.setValues(this.detailsData);
                this.applyBillablePermission();
                this.initialFormValues = timesheetForm.getValues();
            }
            this.dataLoaded = true;
        }
        
    },

    isEditable: function () {
        return (!RM.TimeSheetsMgr.isTimesheetInvoicedOrBilled(this.detailsData.Status) && RM.PermissionsMgr.canAddEdit('Timesheets'));
    },

    applyViewEditableRules: function () {
        var editable = this.isEditable();
        this.getSaveBtn().setHidden(!editable);
        this.getDeleteBtn().setHidden((!editable && !this.isCreate) || !RM.PermissionsMgr.canDelete('Timesheets'));
        this.getTimeSheetForm().setDisabled(!editable);
        this.applyBillablePermission();
    },

    applyBillablePermission: function(){
        this.getBillableCheckbox().setDisabled(RM.TimeSheetsMgr.isTimesheetInvoicedOrBilled(this.detailsData.Status) || !RM.PermissionsMgr.canBillEntry('Timesheets') || !this.getCustomerName().getValue());
    },

    openInEditMode: function() {
        this.getResetBtn().setHidden(true);
        this.getLoadBtn().setHidden(true);
        this.getSaveBtn().setHidden(false);
        this.getDescription().setHidden(false);
        this.getDuration().setHidden(false);
    },
    
    onHide: function(){
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },

    loadTimeData: function (cb, cbs) {
        var me = this;
        var formVals = this.getTimeSheetForm().getValues();

        RM.AppMgr.getServerRecs(this.serverApiName + '/WeeklyTimeEntry', {
                startdate: formVals.Date,
                enddate: formVals.Date,
                customerId: formVals.CustomerId,
                projectId: formVals.ProjectId,
                itemId: formVals.ItemId,
                billable: this.getBillableCheckbox().getValue()
            },
			cb,
            cbs,
            function (eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
                me.goBack();
            },
            'Loading...'
		);
    },

    setTimeData: function (data) {
        this.detailsData = data;
        var invoicedOrBilled = RM.TimeSheetsMgr.isTimesheetInvoicedOrBilled(data.Status);
        this.getSaveBtn().setHidden(invoicedOrBilled);
        this.getDeleteBtn().setHidden(invoicedOrBilled || this.isCreate);
        this.getDuration().setValue(data.Duration);
        this.getDescription().setValue(data.Notes);
        this.getDuration().setDisabled(invoicedOrBilled);
        this.getDescription().setDisabled(invoicedOrBilled);
        this.noteText = data.Notes;
    },

    turnTimeEditMode: function(editVal) {
        this.getTimeSheetForm().setDisabled(editVal);
        this.getDuration().setDisabled(!editVal);
        this.getDescription().setDisabled(!editVal);
        this.getResetBtn().setHidden(!editVal);
        this.getLoadBtn().setHidden(editVal);
        this.getSaveBtn().setHidden(!editVal);        
    },

    onLoadBtnTap: function () {
        if (!this.getItemName().getValue()) {
            this.getItemName().showValidation(false);
            RM.AppMgr.showErrorMsgBox('Please select an Item.');
            return;
        }
        this.getDuration().setHidden(false);
        this.getDescription().setHidden(false);
        this.getLoadBtn().setText('Reselect criteria and tap to reset entry');
        this.turnTimeEditMode(true);
        this.loadTimeData(function(respRecs) {
            this.setTimeData(respRecs[0]);
        }, this);
    },

    onResetBtnTap: function () {
        this.turnTimeEditMode(false);
        this.applyBillablePermission();
    },

    onDelete: function () {
        RM.AppMgr.showYesNoMsgBox("Do you want to delete the timesheet?",
            function (result) {
                if (result === 'yes') {
                    RM.AppMgr.deleteServerRec(this.serverApiName +'/'+ this.detailsData.TimeEntryId,
                        function () {
                            RM.AppMgr.itemUpdated('timesheet');
                            RM.AppMgr.showSuccessMsgBox('Timesheet deleted.');
                            RM.ViewMgr.backTo('slidenavigationview');
                        },
                        this,
                        function (recs, eventMsg) {
                            RM.AppMgr.showOkMsgBox(eventMsg);
                        }
                    );
                }
            }, this);
    },
    
    isFormDirty: function(){        
        return !RM.AppMgr.isFormValsEqual(this.getTimeSheetForm().getValues(), this.initialFormValues);        
    },    

    onFieldTap: function (tf) {
        if (tf.getName() == 'CustomerName') {
            RM.Selectors.showCustomers(
                this.getProjectId().getValue(),
				function (data) {
				    this.getTimeSheetForm().setValues({ CustomerId: data.ContactId, CustomerName: data.Description });				    
				},
				this
			);
        }
        else if (tf.getName() == 'ProjectName') {
            RM.Selectors.showProjects(
                this.getCustomerId().getValue(),
                null,
				function (data) {
				    this.getTimeSheetForm().setValues({ ProjectId: data.ProjectId, ProjectName: data.ProjectPath });
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
				    this.detailsData.TaxTypeId = rec.SaleTaxCodeId;//data[0].TaxCodeId;
				    //this.getTimeSheetForm().setValues({ ItemId: data[0].ItemId, ItemName: data[0].Name, SaleTaxCodeId: data[0].SaleTaxCodeId });
                    this.getTimeSheetForm().setValues({ ItemId: rec.ItemId, ItemName:rec.ItemPath});
				},
				this,
                RM.Consts.ChargeableItemTypes.SERVICE
			);
        }
        else if (tf.getName() == 'Notes') {
            this.editDescription();
        }
        else if (tf.getItemId() == 'history') {
            RM.Selectors.showHistory('Timesheet', RM.Consts.HistoryTypes.TIME, this.detailsData.TimeEntryId);
        }        

    },

    onCustomerChange: function(){
        this.applyBillablePermission();
    },
    
    editDescription: function(){      
        var editable = this.isEditable() && !this.getDescription().getDisabled();

        RM.Selectors.showNoteText(
            'Notes',
            editable,
            'SAVE',
            this.noteText,
            function(noteText){
                RM.ViewMgr.back();
                this.noteText = noteText; //Enables preserving of new lines when going from textfield to textarea
                this.getDescription().setValue(noteText.replace(/(\r\n|\n|\r)/g, ' '));
            },
            this
        );
        
    },    

    goBack: function(){
        this.detailsCb.call(this.detailsCbs, 'back');
        RM.ViewMgr.back();
        this.dataLoaded = false;    
    },    
    
    back: function () {

        if(this.isFormDirty() && this.isEditable()){
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

    save: function () {
        var formVals = this.getTimeSheetForm().getValues();
        //formVals.TaxTypeId = formVals.SaleTaxCodeId;
        formVals.Billable = this.getBillableCheckbox().getValue();
        var vals = Ext.applyIf(formVals, this.detailsData);        
        vals.Notes = this.noteText;
                
        if (this.validateForm(vals)) {
            if (!this.isCreate) {
                this.loadTimeData(function(respRecs) {
                    if (!respRecs[0].Duration || this.isCombinationSameAsOriginal(vals)) {
                        this.saveTimeSheet(vals);
                    } else {
                        Ext.toast('Timesheet with the same combination already exists.', 3000);
                    }
                }, this);
            } 
            else {
                this.saveTimeSheet(vals);
            }
        }
    },

    isCombinationSameAsOriginal: function(editedFields) {
        if (this.initialFormValues.CustomerId === editedFields.CustomerId
            && this.initialFormValues.ProjectId === editedFields.ProjectId
            && this.initialFormValues.ItemId === editedFields.ItemId
            && this.initialFormValues.Billable === editedFields.Billable
            && this.initialFormValues.Date === editedFields.Date) {
            return true;
        }
        return false;
    },

    saveTimeSheet: function (vals) {
        RM.AppMgr.saveServerRec(this.serverApiName, this.isCreate, vals,
                   function () {
                       RM.AppMgr.showSuccessMsgBox('Timesheet saved', function () {
                           RM.ViewMgr.backTo('slidenavigationview');
                       }, this);
                       RM.AppMgr.itemUpdated('timesheet');
                   },
                   this,
                   function (recs, eventMsg) {
                       RM.AppMgr.showOkMsgBox(eventMsg);
                   }
               );
    },
    
    validateForm: function(vals){        
        var isValid = true;
        
        if(!vals.ItemName){            
            this.getItemName().showValidation(false);
            isValid = false;            
        }
        
        if(!vals.Duration){
            this.getDuration().showValidation(false);
            RM.AppMgr.showInvalidDurationMsg();
            isValid = false;
            return isValid;
        }
        
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
        
        return isValid;
   }

});