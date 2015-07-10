Ext.define('RM.controller.TimeSheetWeeklyC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.TimeSheetWeekly','RM.component.TimeEntryDayRow'],
    config: {
        refs: {
            timeSheetWeekly: { selector: 'timesheetweekly', xtype: 'timesheetweekly', autoCreate: true },
            saveBtn: 'timesheetweekly #save',
            timeSheetForm: 'timesheetweekly #timeSheetForm',
            customerId: 'timesheetweekly hiddenfield[name=CustomerId]',
            projectId: 'timesheetweekly hiddenfield[name=ProjectId]',
            billableCheckbox: 'timesheetweekly rmtogglefield[name=Billable]',
            itemName: 'timesheetweekly #itemName',            
            loadBtn: 'timesheetweekly #loadbtn',
            resetBtn: 'timesheetweekly #resetbtn'
        },
        control: {
            'timesheetweekly': {
                show: 'onShow',
                hide: 'onHide'
            },
            'timesheetweekly #back': {
                tap: 'back'
            },
            'timesheetweekly #save': {
                tap: 'save'
            },
            'timesheetweekly #timeSheetForm exttextfield': {
                tap: 'onFieldTap'
            },
            'timesheetweekly #timeSheetForm textfield[name=CustomerName]': {
                change: 'onCustomerChange'
            },
            loadBtn: {
                tap: 'onLoadBtnTap'
            },
            resetBtn: {
                tap: 'onResetBtnTap'
            }
        }
    },

    init: function () {
        this.callParent(arguments);
        this.serverApiName = 'TimeEntries';
    },

    showView: function (weekDaysArray, cb, cbs) {
        //this.weekDaysRowsAdded = false;        
        this.cb = cb;
        this.cbs = cbs;
        var me = this;
        this.initialFormValues = null;
        this.selectionCriteria = null;
        this.editedFieldValues = null;

        this.startDate = weekDaysArray[0];
        this.endDate = weekDaysArray[6];
        var view = this.getTimeSheetWeekly();
        //to load this screen faster on Android phones, don't change timeout value
        setTimeout(function () {
            for (var i = 0; i < weekDaysArray.length; i++) {
                var row = view.add({
                    xtype: 'timeentrydayrow',
                    scrollable: null,
                    disabled: true
                });
                row.setValues({ Date: weekDaysArray[i] });
            }
            view.add({ xtype: 'component', cls: 'rm-field-border-top' });            
            me.initialFormValues = me.getAllFormValues();
        }, 250);
        this.applyBillablePermission();
        RM.ViewMgr.showPanel(view);
    },
    
    onShow: function () {
        RM.ViewMgr.regFormBackHandler(this.back, this);       
    },

    onHide: function () {
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },

    applyBillablePermission: function () {
        this.getBillableCheckbox().setDisabled(!RM.PermissionsMgr.canBillEntry('Timesheets') || !this.getCustomerId().getValue());
    },

    loadTimeData: function () {
        var me = this;
        var formVals = this.getTimeSheetForm().getValues();
        formVals.Billable = this.getBillableCheckbox().getValue();
        formVals.StartDate = this.startDate;
        formVals.EndDate = this.endDate;

        RM.AppMgr.getServerRecs(this.serverApiName + '/WeeklyTimeEntry', {
            startdate: this.startDate,
            enddate: this.endDate,
            customerId: formVals.CustomerId,
            projectId: formVals.ProjectId,
            itemId: formVals.ItemId,
            billable: this.getBillableCheckbox().getValue()
            },
			function response(respRecs) {
			    me.setWeekDaysData(respRecs);
			},
			this,
            function (eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
                me.goBack();
            },
            'Loading...'
		);
    },

    onLoadBtnTap: function () {
        if (!this.getItemName().getValue()) {
            this.getItemName().showValidation(false);
            RM.AppMgr.showErrorMsgBox('Please select an Item.');
            return;
        }
        this.getLoadBtn().setText('Reselect criteria and tap to reset entries');
        this.turnWeekdaysEditMode(true);
        this.showDateFieldAsDisabledLabel(false);

        var selectionCriteria = this.getTimeSheetForm().getValues();
        if (!RM.AppMgr.isFormValsEqual(selectionCriteria, this.selectionCriteria)) {
            this.selectionCriteria = selectionCriteria;
            this.loadTimeData();
        } else {
            this.setWeekDaysData(this.editedFieldValues);
        }        
    },

    onResetBtnTap: function () {
        this.editedFieldValues = this.readWeekDaysData();
        this.turnWeekdaysEditMode(false);
        this.showDateFieldAsDisabledLabel(true);
        this.applyBillablePermission();
    },

    turnWeekdaysEditMode: function(editVal){
        this.getTimeSheetForm().setDisabled(editVal);
        this.disableWeekDaysRows(!editVal);
        this.getResetBtn().setHidden(!editVal);
        this.getLoadBtn().setHidden(editVal);
        this.getSaveBtn().setHidden(!editVal);
    },

    isFormDirty: function () {
        return !RM.AppMgr.isFormValsEqual(this.getAllFormValues(), this.initialFormValues);
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
				    //this.detailsData.TaxTypeId = rec.SaleTaxCodeId;
				    this.getTimeSheetForm().setValues({ ItemId: rec.ItemId, ItemName: rec.ItemPath });
				},
				this,
                RM.Consts.ChargeableItemTypes.SERVICE
			);
        }        
    },

    onCustomerChange: function () {
        this.applyBillablePermission();
    },

    goBack: function () {
        RM.ViewMgr.back();        
    },

    back: function () {
        if (this.isFormDirty()) {
            RM.AppMgr.showUnsavedChangesMsgBox(
                function (btn) {
                    if (btn == 'yes') {
                        this.save();
                    }
                    else {
                        this.goBack();
                    }
                },
                this
            );
        }
        else {
            this.goBack();
        }
    },

    getWeekDaysData: function(){
        var timeSheetWeekly = this.getTimeSheetWeekly();
        var weekDaysRows = timeSheetWeekly.query('timeentrydayrow');
        var weekDaysData = new Array();
        for (var i = 0; i < weekDaysRows.length; i++) {
            var formVals = weekDaysRows[i].getValues();
            if (formVals.Duration && !RM.TimeSheetsMgr.isTimesheetInvoicedOrBilled(formVals.Status)) {
                weekDaysData.push(formVals);
            }
        }
        return weekDaysData;
    },

    readWeekDaysData: function() {
        var timeSheetWeekly = this.getTimeSheetWeekly();
        var weekDaysRows = timeSheetWeekly.query('timeentrydayrow');
        var weekDaysData = new Array();
        for (var i = 0; i < weekDaysRows.length; i++) {
                weekDaysData.push(weekDaysRows[i].getValues());
        }
        return weekDaysData;
    },
    
    setWeekDaysData: function (dataArray) {
        var timeSheetWeekly = this.getTimeSheetWeekly();
        var weekDaysRows = timeSheetWeekly.query('timeentrydayrow');
        for (var i = 0; i < dataArray.length; i++) {
            dataArray[i].Date = new Date(dataArray[i].Date);
            weekDaysRows[i].setValues(dataArray[i]);
            weekDaysRows[i].setDisabled(RM.TimeSheetsMgr.isTimesheetInvoicedOrBilled(dataArray[i].Status));
        }
    },

    showDateFieldAsDisabledLabel: function(val) {
        var timeSheetWeekly = this.getTimeSheetWeekly();
        var weekDaysRows = timeSheetWeekly.query('timeentrydayrow');
        if (val) {
            val = 'rm-flatfield-disabled-label-look';
        } else {
            val = ['rm-flatfield-as-label'];
        }
        for (var i = 0; i < weekDaysRows.length; i++) {
            weekDaysRows[i].down('[name=Date]').setCls(val);  
        }
    },
    
    disableWeekDaysRows: function(val){
        var timeSheetWeekly = this.getTimeSheetWeekly();
        var weekDaysRows = timeSheetWeekly.query('timeentrydayrow');
        for (var i = 0; i < weekDaysRows.length; i++) {
            weekDaysRows[i].setDisabled(val);
            weekDaysRows[i].down('[name=Date]').setDisabled(true);  //to disable Date field forever
        }
    },

    validateWeekDaysData: function (weekDaysData) {
        if (weekDaysData.length <= 0) {
            return false;
        }
        return true;
    },

    getAllFormValues: function(){
        var formVals = this.getTimeSheetForm().getValues();
        formVals.Billable = this.getBillableCheckbox().getValue();
        formVals.WeekDaysData = this.getWeekDaysData();
        return formVals;
    },

    save: function () {
        var formVals = this.getAllFormValues();                

        if (this.validateForm(formVals)) {
            RM.AppMgr.saveServerRec(this.serverApiName, true, formVals,
               function () {
                   RM.AppMgr.showSuccessMsgBox('Timesheet saved', function () {
                       RM.AppMgr.itemUpdated('timesheet');
                       RM.ViewMgr.backTo('slidenavigationview');
                   }, this);
                   RM.AppMgr.itemUpdated('timesheet');
               },
               this,
               function (recs, eventMsg) {
                   RM.AppMgr.showOkMsgBox(eventMsg);
               }
           );
        }        
    },

    validateForm: function (vals) {
        var isValid = true;

        if (!vals.ItemName) {
            this.getItemName().showValidation(false);
            isValid = false;
        }

        if (!this.validateWeekDaysData(vals.WeekDaysData)) {
            RM.AppMgr.showInvalidDurationMsg();
            isValid = false;
            return isValid;
        }

        if (!isValid) {
            RM.AppMgr.showInvalidFormMsg();
        }

        return isValid;
    }

});