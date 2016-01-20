Ext.define('RM.controller.BillDetailC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.util.FormUtils', 'RM.util.Dates'],

    config: {
        refs: {
            billDetail: 'billdetail',
            billTitle: 'billdetail #title',
            saveBtn: 'billdetail #save',
            lineItems: 'billdetail billlineitems',
            billForm: 'billdetail #billForm',
            balanceDue: 'billdetail #balanceDue',
            billNumberFld: 'billdetail textfield[name=BillNumber]',
            notesFld: 'billdetail textfield[name=Notes]',
            supplierFld: 'billdetail textfield[name=SupplierName]',
            dueDateFld: 'billdetail extdatepickerfield[name=DueDate]',
            dateFld: 'billdetail extdatepickerfield[name=BillDate]',
            refNrFld: 'billdetail textfield[name=Ref]',
            amountsFld: 'billdetail extselectfield[name=AmountTaxStatus]',
            billStatus: 'billdetail #billStatus'            
        },
        control: {
            'billdetail': {
                show: 'onShow',
                hide: 'onHide'
            },
            'billdetail #back': {
                tap: 'back'
            },
            'billdetail #save': {
                tap: 'onSave'
            },
            'billdetail #options': {
                tap: 'onOptions'
            },
            'billdetail #billForm textfield': {
                tap: 'onFieldTap'
            },
            'billdetail extselectfield[name=AmountTaxStatus]': {
                change: 'onAmountTaxStatusSelected'
            },
            'billdetail #addItem': {
                tap: 'onAddItem'
            },
            'billdetail billlineitems': {
                addlineitem: 'onAddLineItem',
                editlineitem: 'onEditLineItem',
                deletelineitem: 'onDeleteLineItem'
            },
            'billdetail #balBreakdown': {
                tap: 'onBalanceBreakdown'
            },
            'billdetail #invActions': {
                tap: 'onOptions'
            }            
        }
    },

    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);
    },

    isEditable: function () {
        return RM.BillsMgr.isBillStatusEditable(this.detailsData.Status) &&
        RM.PermissionsMgr.canAddEdit('Bills');// &&
        //(!Ext.isDefined(this.detailsData.SaveSupport) || this.detailsData.SaveSupport) &&
        //(this.detailsData.Amount === this.detailsData.Balance);
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
            today.setHours(0, 0, 0, 0);

            this.detailsData = Ext.applyIf(this.detailsData, {
                Status: RM.BillsMgr.getInitialBillStatus(),
                AmountTaxStatus: RM.CashbookMgr.getTaxPreferences().SalesFigures,
                BillDate: today,
                Discount: 'None',
                Amount: 0,
                DiscountTotal: 0,
                Tax: 0,
                Subtotal: 0,
                Paid: 0,
                BalanceDue: 0,
                SaveSupport: true
                
            });
                        
        }

        var view = this.getBillDetail();
        if (!view) {
            view = { xtype: 'billdetail' };
        }
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        RM.ViewMgr.regFormBackHandler(this.back, this);

        var dateField = this.getDateFld();
        this.getBillTitle().setHtml(this.isCreate ? 'Add bill' : 'View bill');

        this.applyViewEditableRules();
        this.getBillDetail().setActionsHidden(this.isCreate);

        if (!this.dataLoaded) {

            if (!this.isCreate) {
                this.loadFormData();
            }
            else {
                
                var billForm = this.getBillForm();
                this.getBillNumberFld().setHidden(true);
                var data = this.detailsData;
                if (data.SupplierId) {
                    this.getLineItems().setSupplierId(data.SupplierId);
                }

                billForm.reset();
                billForm.setValues(data);
                this.applyTaxRules();
                this.previousAmountTaxStatus = data.AmountTaxStatus;
                this.getBalanceDue().setHtml('');
                this.initialFormValues = billForm.getValues();
                this.getLineItems().setSupplierId(null);
                this.getLineItems().setBillDate(this.getDateFld().getValue());
                this.getLineItems().setTaxStatus(data.AmountTaxStatus);
                this.getBillStatus().setHtml(RM.BillsMgr.getBillStatusText(data.Status));

                // Check that the default date in the picker isn't before the lock off date
                //var curDateValue = dateField.getValue();
                //var lockOffDate = RM.CashbookMgr.getLockOffDate();
                //if (curDateValue.getTime() <= lockOffDate.getTime()) {
                //    lockOffDate.setDate(lockOffDate.getDate() + 1);
                //    dateField.updateValue(lockOffDate);
                //}

                this.dataLoaded = true;
            }
        }

    },

    onHide: function () {
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },

    onItemUpdated: function (itemType) {
        if (itemType == 'bill' && !this.isCreate) {
            this.dataLoaded = false;
        }
    },

    onSave: function (button) {
        if (this.isFormDirty()) {
            this.save();
        }
        else {
            this.goBack();
        }
    },

    applyViewEditableRules: function () {
        var editable = this.isEditable();
        this.getSaveBtn().setHidden(!editable);
        if (!editable) { RM.util.FormUtils.makeAllFieldsReadOnly(this.getBillForm()); }
        this.getLineItems().setIsEditable(editable);
    },

    applyTaxRules: function () {
        var amounts = this.getAmountsFld();
        var taxPrefs = RM.CashbookMgr.getTaxPreferences();
        amounts.setReadOnly(!this.isEditable() || !taxPrefs.AllowUserIncludeTax);
        if (!this.isEditable() || !taxPrefs.AllowUserIncludeTax) {
            amounts.setCls('rm-flatfield-disabled');
        }
        if (this.isCreate) {
            // New bill behaviour
            if (taxPrefs.IsTaxTracking) {
                amounts.setHidden(false);
                amounts.setValue(taxPrefs.SalesFigures);
            }
            else {
                amounts.setHidden(true);
                amounts.setValue(RM.Consts.TaxStatus.NON_TAXED);
            }
        }
        else {
            // Existing bill behaviour
            var showAmounts = taxPrefs.IsTaxTracking || amounts.getValue() !== RM.Consts.TaxStatus.NON_TAXED;
            amounts.setHidden(!showAmounts);
        }
    },

    loadFormData: function () {
        RM.AppMgr.getServerRecById('Bills', this.detailsData.BillId,
			function (data) {
			    this.getBillNumberFld().setHidden(false);
			    //To reset readonly property when bill status is changed back to draft, fix for bug#25428               
			    if (data.Status === RM.Consts.BillStatus.DRAFT) {
			        this.getDateFld().setReadOnly(false);
			        this.getRefNrFld().setReadOnly(false);
			    }

			    if (data.Status === RM.Consts.BillStatus.APPROVED && data.BalanceDue < data.Amount) {
			        this.getBillStatus().setHtml(RM.BillsMgr.getPartiallyPaidBillStatusText());
			    }
			    else {
			        this.getBillStatus().setHtml(RM.BillsMgr.getBillStatusText(data.Status));
			    }

			    var billForm = this.getBillForm();
			    this.getLineItems().removeAllItems();
			    this.detailsData = data;
			    if (data.DueDate != null) {
			        data.DueDate = RM.util.Dates.decodeAsLocal(data.DueDate);
			    }

			    if (data.BillDate != null) {
			        data.BillDate = RM.util.Dates.decodeAsLocal(data.BillDate);
			    }
			    
			    data.Discount = (data.DiscountPerc && data.DiscountPerc != 0) ? data.DiscountPerc + '%' : 'None';
			    data.Discount = (data.DiscountAmount && data.DiscountAmount != 0) ? RM.AppMgr.formatCurrency(data.DiscountAmount, 2) : data.Discount;
			    this.noteText = data.Notes; //Enables preserving of new lines when going from textfield to textarea
			    this.paymentDetailsText = data.PaymentDetails;

			    data.Notes = data.Notes ? data.Notes.replace(/(\r\n|\n|\r)/g, ' ') : ''; //ensures new lines will be shown as spaces as Notes on form is previewed in one line. newlines entered in mobile seem to use \n where as entered in web app seem to use \r
			    billForm.setValues(data);

			    this.applyTaxRules();
			    this.previousAmountTaxStatus = data.AmountTaxStatus;

			    this.applyViewEditableRules(); //needs to be called before adding line items below so that line items can have delete x hidden if necessary

			    var lineItemsPanel = this.getLineItems();
			    lineItemsPanel.addLineItems(data.LineItems);
			    lineItemsPanel.setSupplierId(data.SupplierId);
			    lineItemsPanel.setTaxStatus(data.AmountTaxStatus);
			    lineItemsPanel.setBillDate(data.Date);
			    this.lineItemsDirty = false;

			    this.displayBalanceDue();
			    this.initialFormValues = billForm.getValues();
			    this.getBillDetail().setActionsHidden(false);

			    this.dataLoaded = true;
			    if (data.ViewNotice) {
			        RM.AppMgr.showOkMsgBox(data.ViewNotice);
			    }
			},
			this,
            function (eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
                this.goBack();
            }
		);
    },

    isFormDirty: function () {
        return this.lineItemsDirty || !RM.AppMgr.isFormValsEqual(this.getBillForm().getValues(), this.initialFormValues);
    },

    onFieldTap: function (tf) {
        var fldName = tf.getName();

        if (fldName == 'Notes') {
            this.showNotes();
        }
        
        else if (this.isEditable()) {
            if (fldName == 'SupplierName') {
                RM.Selectors.showSuppliers(
    				function (data) {
    				    //tf.setValue(data.Name);
    				    this.getBillForm().setValues({ SupplierId: data.SupplierId, SupplierName: data.Name });
    				    
    				    this.getLineItems().setSupplierId(data.SupplierId);
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
    				    if (newVal != oldVal) {
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

    onBillDateChanged: function (dateField, newValue, oldValue) {
        if (!this.dataLoaded) return;
        //  Recalculate the bill tax amounts, since tax rates are date dependent
        this.calculateBreakdown();
        this.getLineItems().setBillDate(newValue);
    },

    showNotes: function () {

        RM.Selectors.showNoteText(
            'Notes',
            this.isEditable(),
            'Save',
            this.noteText,
            function (noteText) {
                RM.ViewMgr.back();
                this.noteText = noteText;
                this.getNotesFld().setValue(noteText.replace(/(\r\n|\n|\r)/g, ' '));
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

    onEditLineItem: function () {
        this.lineItemsDirty = true;
        this.calculateBreakdown();
    },

    calculateBreakdown: function () {

        var formVals = this.getBillForm().getValues();
        var lineItems = this.getLineItems().getViewData();
        var vals = {
            SupplierId: formVals.SupplierId,
            BillDate: RM.util.Dates.encodeAsUTC(formVals.BillDate),
            AmountTaxStatus: formVals.AmountTaxStatus,
            PreviousAmountTaxStatus: this.previousAmountTaxStatus,
            LineItems: []
        };

        if (formVals.Discount.indexOf('%') > -1) {
            vals.DiscountPercentage = formVals.Discount.replace('%', '');
        }
        else if (formVals.Discount.indexOf('$') > -1) {
            vals.DiscountAmount = formVals.Discount.replace('$', '');
        }

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
                BillLineItemId: item.BillLineItemId,
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

        RM.AppMgr.saveServerRec('BillCalc', true, vals,
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
			        Ext.Array.some(respRec.Items, function (item) {
			            if (item.BillLineItemId === currentLine.BillLineItemId) {
			                resultLine = item;
			                return true;
			            }
			        });

			        // If the item isn't in the response, it must be removed (project/supplier filtering is potentially applied server-side)
			        if (!resultLine) {
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
            function (eventMsg) {
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
        RM.BillsMgr.showBalanceBreakdown(this.detailsData);
    },

    onBillActions: function () {
        if (this.isCreate) {
            RM.AppMgr.showOkMsgBox('Bill Actions are only available after saving new bills.');
        }
        else {
            RM.BillsMgr.showActions(this.detailsData);
        }
    },

    goBack: function () {
        this.detailsCb.call(this.detailsCbs, 'back');
        RM.ViewMgr.back();
        this.getLineItems().removeAllItems();
        this.dataLoaded = false;
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

    onOptions: function () {
        if (this.isFormDirty()) {
            RM.AppMgr.showOkCancelMsgBox('You must save your changes to continue, save now?',
                function (btn) {
                    if (btn == 'ok') {
                        this.save(this.onBillActions);
                    }
                },
                this
            );
        }
        else {
            this.onBillActions();
        }
    },

    validateForm: function (vals) {
        var isValid = true;

        if (!vals.SupplierId) {
            this.getSupplierFld().showValidation(false);
            isValid = false;
        }

        this.getLineItems().validateForm(); //still return isValid = true even if no line items, as the 'No items have been added to this bill.' will be shown in save()

        if (!isValid) {
            RM.AppMgr.showInvalidFormMsg();
        }

        return isValid;
    },

    save: function (afterSaveCallback) {
        var formVals = this.getBillForm().getValues();
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

        if (this.validateForm(vals)) {
            if (formVals.LineItems.length > 0) {
                // Some line item admin
                var lineNumber = 1;
                formVals.LineItems.forEach(function (item) {
                    item.lineNo = lineNumber;

                    // Remove the temporary Id for any new items, since the server is way too trusting
                    if (item.IsNew) {
                        delete item.BillLineItemId;
                    }

                    // Set the line numbers to handle new or deleted items
                    lineNumber += 1;
                });

                this.detailsCb.call(this.detailsCbs, 'save', vals);
                this.saveBill(afterSaveCallback, vals);
            }
            else {
                RM.AppMgr.showErrorMsgBox('No items have been added to this bill.');
            }
        }
    },

    saveBill: function (afterSaveCallback, vals)
    {
        RM.AppMgr.saveServerRec('Bills', this.isCreate, vals,
                    function (recs) {
                        RM.AppMgr.itemUpdated('bill');

                        if (afterSaveCallback) {
                            if (this.isCreate) {
                                this.detailsData.BillId = recs[0].BillId;
                                this.detailsData.TemplateId = recs[0].TemplateId;
                            }
                            this.detailsData.SupplierId = vals.SupplierId;
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
    },

    saveBill: function (afterSaveCallback, vals) {
        RM.AppMgr.saveServerRec('Bills', this.isCreate, vals,
                    function (recs) {
                        RM.AppMgr.itemUpdated('bill');

                        if (afterSaveCallback) {
                            if (this.isCreate) {
                                this.detailsData.BillId = recs[0].BillId;
                                this.detailsData.TemplateId = recs[0].TemplateId;
                            }
                            this.detailsData.SupplierId = vals.SupplierId;
                            this.detailsData.AccountsReceivableCategoryId = recs[0].AccountsReceivableCategoryId;
                            // Clear the loaded flag to force a reload of bill information when the view is shown again                            
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
