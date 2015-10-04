Ext.define('RM.controller.ExpenseLineItemC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.ExpenseLineItem', 'RM.util.FormUtils', 'RM.util.PseudoGuid', 'RM.util.MathHelpers'],
    config: {
        refs: {
            itemDetail: 'expenselineitem',
            itemTitle: 'expenselineitem #title',
            addBtn: 'expenselineitem #add',
            itemForm: 'expenselineitem #itemForm',
            status: 'expenselineitem #status',
            description: 'expenselineitem field[name=Description]',
            unitPrice: 'expenselineitem field[name=UnitPrice]',
            quantity: 'expenselineitem field[name=Quantity]',
            taxCode: 'expenselineitem field[name=TaxGroupId]',
            tax: 'expenselineitem field[name=Tax]',
            amount: 'expenselineitem field[name=Amount]',
            itemNameFld: 'expenselineitem field[name=ItemName]',
            accountFld: 'expenselineitem field[name=AccountName]',
            projectId: 'expenselineitem field[name=ProjectId]',
            customerId: 'expenselineitem field[name=CustomerId]',
            supplierId: 'expenselineitem field[name=SupplierId]',
            itemId: 'expenselineitem field[name=ItemId]',
            projectName: 'expenselineitem field[name=ProjectName]',
            customerName: 'expenselineitem field[name=CustomerName]',
            dateFld: 'expenselineitem field[name=ExpenseClaimDate]',
            billableFld: 'expenselineitem field[name=IsBillable]'
        },
        control: {
            'expenselineitem': {
                show: 'onShow',
                hide: 'onHide'
            },
            'expenselineitem #itemForm exttextfield': {
                tap: 'onFieldTap'
            },
            'expenselineitem #back': {
                tap: 'back'
            },
            'expenselineitem #add': {
                tap: 'add'
            },
            unitPrice: {
                valueChange: 'unitPriceChanged'
            },
            tax: {
                valueChange: 'taxAmountChanged'/*,
                clearicontap: function() { this.taxAmountChanged(null,null); }*/
            },
            taxCode: {
                change: 'taxCodeChanged'
            },
            quantity: {
                valueChange: 'quantityChanged'
            },            
            projectName: {
                clearicontap: 'projectCleared'
            },
            amount: {
                valueChange: 'amountChanged'
            },
            dateFld: {
                change: 'dateChanged'
            },
            customerName: {
                change: 'onCustomerChanged'
            },
            billableFld: {
                change: 'onBillableChanged'
            }
        }
    },

    isTaxInclusive: function () {
        return this.taxStatusCode === RM.Consts.TaxStatus.INCLUSIVE;
    },

    isTaxTracking: function () {
        return this.taxStatusCode !== RM.Consts.TaxStatus.NON_TAXED;
    },

    isAccountLine: function () {
        return this.detailsData.AccountId && this.detailsData.AccountId !== RM.Consts.EmptyGuid;
    },

    isItemLine: function () {
        return this.detailsData.ItemId && this.detailsData.ItemId !== RM.Consts.EmptyGuid;
    },

    showView: function (editable, customerId, options, detailsData, cb, cbs) {
        this.ignoreEvents = false;
        this.isEditable = editable;
        this.customerId = customerId;
        this.projectId = options.projectId;
        this.taxStatusCode = options.taxStatus;
        this.detailsCb = cb;
        this.detailsCbs = cbs;
        
        this.isCreate = false;
        this.detailsData = Ext.clone(detailsData);        

        this.detailsData.ExpenseClaimDate = RM.util.Dates.decodeAsLocal(this.detailsData.ExpenseClaimDate.toString());
        this.detailsData.CustomerId = RM.AppMgr.isValidGuid(options.customerId) ? options.customerId : this.detailsData.CustomerId;
        this.detailsData.CustomerName = options.customerName || this.detailsData.CustomerName;
        this.detailsData.ProjectId = RM.AppMgr.isValidGuid(options.projectId) ? options.projectId : this.detailsData.ProjectId;
        this.detailsData.ProjectName = options.projectName || this.detailsData.ProjectName;

        if (options.isCreate) {
            this.isCreate = true;
            this.detailsData.IsNew = true;
            this.detailsData.ExpenseClaimLineItemId = RM.util.PseudoGuid.next();
            this.detailsData.UnitPriceAccuracy = 2;
            this.detailsData.Quantity = null;
            this.detailsData.TaxGroupId = null;
            this.detailsData.TaxIsModified = false;            
        }       

        var view = this.getItemDetail();

        this.initShow = false;

        if (!view) {
            view = { xtype: 'expenselineitem' };
        }

        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        RM.ViewMgr.regFormBackHandler(this.back, this);

        //Load country specific labels
        var countrySettings = RM.CashbookMgr.getCountrySettings();
        this.getTax().setLabel(countrySettings.LineItemTaxLabel);
        this.getTaxCode().setLabel(countrySettings.LineItemTaxCodeLabel);

        var itemForm = this.getItemForm();

        this.getAddBtn().setHidden(!this.isEditable);
        this.getAddBtn().setText(this.isCreate ? 'Add' : 'Save');
        this.getTax().setReadOnly(!RM.CashbookMgr.getTaxPreferences().AllowTaxEdit);

        this.getStatus().setHidden(false);
        //this.getStatus().setHtml(RM.ExpensesMgr.getExpenseLineItemStatusText(this.detailsData.Status));

        if (!RM.CashbookMgr.getTaxPreferences().AllowTaxEdit) {
            this.getTax().addCls(['rm-flatfield-disabled']);
        }

        if (!this.isEditable) { this.makeViewReadonly(); }

        if (!this.initShow) {
            itemForm.reset();
            itemForm.setValues(this.detailsData);
            //this.setDiscountDisplayValue(this.detailsData.DiscountPercentage, this.detailsData.DiscountAmount);

            var priceDisplayValue = RM.util.MathHelpers.roundToEven(this.isTaxInclusive() ? this.detailsData.UnitPrice : this.detailsData.UnitPriceExTax, this.detailsData.UnitPriceAccuracy);
            this.getUnitPrice().setValue(priceDisplayValue);

            if (!this.isTaxTracking()) {
                this.getItemDetail().hideTaxFields();
            }
            else {
                var taxCodeSelected = this.detailsData.TaxGroupId !== null;
                this.getItemDetail().setTaxAmountAccessible(taxCodeSelected);
            }

            this.setTaxModified(this.detailsData.TaxIsModified);

            if (this.isItemLine()) {
                this.getItemDetail().showDetailsFields();
                this.showItemFields();
            }
            if (this.isAccountLine()) {
                this.getItemDetail().showDetailsFields();
                this.showAccountFields();
            }

            this.initialFormValues = itemForm.getValues();
            this.initShow = true;
        }

        this.setEditableBasedOnExpenseHeader();
    },

    onHide: function () {
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },

    isFormDirty: function () {
        return !RM.AppMgr.isFormValsEqual(this.getItemForm().getValues(), this.initialFormValues);
    },

    makeViewReadonly: function () {
        RM.util.FormUtils.makeAllFieldsReadOnly(this.getItemForm());
    },

    setEditableBasedOnExpenseHeader: function () {
        this.getProjectName().setDisabled(this.detailsData.ProjectName && RM.AppMgr.isValidGuid(this.projectId));
        this.getCustomerName().setDisabled(this.detailsData.CustomerName && RM.AppMgr.isValidGuid(this.customerId));
        this.setBillableFldAccess();
    },

    setTaxModified: function (isModified) {
        this.detailsData.TaxIsModified = isModified;
        this.getItemDetail().setTaxModified(isModified);
    },

    onFieldTap: function (tf) {
        if (this.isEditable) {
            if (tf.getName() == 'ProjectName') {
                RM.Selectors.showProjects(
                    this.customerId,
                    null,
    				function (data) {
    				    var currentValue = this.getProjectId().getValue();
    				    if (currentValue !== data.ProjectId) {
    				        this.projectChanged(data, currentValue);
    				    }
    				},
    				this
    			);
            }
            else if (tf.getName() == 'CustomerName') {
                RM.Selectors.showCustomers(
                    this.getProjectId().getValue(),
                    function (data) {
                        var currentValue = this.getCustomerId().getValue();
                        if (currentValue !== data.CustomerId) {
                            this.customerChanged(data, currentValue);
                        }
                    },
                    this,
                    'project'
                );
            }
            else if(tf.getName() == 'SupplierName'){
                RM.Selectors.showSuppliers(
                    function (data) {
                        var currentValue = this.getSupplierId().getValue();
                        if (currentValue !== data.SupplierId) {
                            this.supplierChanged(data, currentValue);
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
    				    this.showItemFields();
    				    this.itemChanged(data[0]);
    				},
    				this,
                    null,
                    RM.Consts.ChargeableItemPurchaseSoldType.PURCHASEDONLY
    			);
            }
            else if (tf.getName() == 'AccountName') {
                RM.Selectors.showAccounts(
                    false,
    				function (data) {
    				    this.showAccountFields();
    				    this.itemChanged(data[0]);
    				},
    				this
    			);
            }
        }
    },

    showAccountFields: function () {
        this.getAccountFld().setCls('rm-flatfield');
        this.getItemTitle().setHtml('Account details');
        this.getItemNameFld().setHidden(true);
        this.getUnitPrice().setHidden(true);
        //this.getDiscount().setHidden(true);
        this.getAmount().setReadOnly(!this.isEditable);
        if (!this.isEditable) {
            this.getAmount().addCls(['rm-flatfield-disabled']);
        }
        else {
            this.getAmount().setCls('rm-flatfield');
        }
    },

    showItemFields: function () {
        this.getItemTitle().setHtml('Item details');
        this.getAccountFld().setHidden(true);
    },

    goBack: function () {
        RM.ViewMgr.back();
    },

    back: function () {
        if (this.isFormDirty()) {
            RM.AppMgr.showUnsavedChangesMsgBox(
                function (btn) {
                    if (btn == 'yes') {
                        this.add();
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


    validateForm: function (vals) {
        var isValid = true;

        // Field-specific validations
        if (!vals.ItemId && !this.getItemNameFld().getHidden()) {
            this.getItemNameFld().showValidation(false);
            isValid = false;
        }

        if (!vals.AccountId && !this.getAccountFld().getHidden()) {
            this.getAccountFld().showValidation(false);
            isValid = false;
        }

        if (this.isItemLine() && !Ext.isNumber(vals.UnitPriceExTax)) {
            this.getUnitPrice().showValidation(false);
            isValid = false;
        }

        if (!isValid) {
            RM.AppMgr.showInvalidFormMsg();
        }

        // More general validations (non-deterministic which field should be corrected)
        if (!vals.Amount) {
            RM.AppMgr.showOkMsgBox("Amount cannot be zero");
            isValid = false;
        }

        return isValid;
    },

    add: function () {
        // Make sure we aren't waiting on an async action like item calculation
        if (this.ignoreControlEvents() || this.pendingUnitPriceChange()) return;
        var ITEM_TYPE_CHARGEABLE_ITEM = 1;

        var formVals = this.getItemForm().getValues();
        // Remove the form fields that are display values only, and shouldn't override detailsData
        if (!this.isAccountLine()) delete formVals.Amount;
        delete formVals.UnitPrice;
        delete formVals.Tax;
        //delete formVals.Discount;

        if (!this.isTaxTracking()) delete formVals.TaxGroupId;

        var item = Ext.apply(this.detailsData, formVals);
        item.ItemType = ITEM_TYPE_CHARGEABLE_ITEM;
        item.LineText = item.Description || item.ItemName || item.AccountName;

        // Unit price fields aren't used for Account lines
        if (this.isAccountLine()) {
            delete item.UnitPrice;
            delete item.UnitPriceAccuracy;
            delete item.UnitPriceExTax;
            delete item.UnitPriceTax;
        }

        if (this.validateForm(item)) {
            this.detailsCb.call(this.detailsCbs, [item]);
            RM.ViewMgr.back();
        }

    },

    customerChanged: function(newCustomerData, oldCustomerId){
        this.getItemForm().setValues({
            CustomerId: newCustomerData.ContactId,
            CustomerName: newCustomerData.Description
        });

        this.customerId = newCustomerData.ContactId;
    },

    supplierChanged: function (newSupplierData, oldSupplierId) {
        this.getItemForm().setValues({
            SupplierId: newSupplierData.SupplierId,
            SupplierName: newSupplierData.Name
        });
    },

    projectChanged: function (newProjectData, oldProjectId) {
        this.getItemForm().setValues({
            ProjectId: newProjectData.ProjectId,
            ProjectName: newProjectData.ProjectPath
        });

        this.projectId = newProjectData.ProjectId;

        // If an item is already selected, check if it has a rate override for the new project
        var currentItem = this.getItemId().getValue();
        if (currentItem) {
            RM.AppMgr.getServerRecs('Items/GetByProject',
            {
                id: currentItem,
                projectId: newProjectData.ProjectId
            },
            function (result) {
                if (result && result.length === 1) {
                    // There is a project rate for this item, apply it
                    this.setNewUnitPriceExTax(result[0].SalePrice);
                }
            },
            this);
        }
    },

    projectCleared: function () {
        // The project field has been cleared using the clearIcon, we have to remove the Id also
        this.getProjectId().setValue(null);

        // Now retrieve the default unit price
        var currentItem = this.getItemId().getValue();
        if (currentItem) {
            RM.AppMgr.getServerRecs('Items/GetById',
            {
                id: currentItem
            },
            function (result) {
                if (result && result.length === 1) {
                    this.setNewUnitPriceExTax(result[0].SalePrice);
                }
            },
            this);
        }
    },

    itemChanged: function (newItem) {
        // An item has been selected from the list:
        // Reset item fields
        this.detailsData.ItemName = newItem.Name;
        this.detailsData.AccountName = newItem.Name;
        this.detailsData.DefaultTaxGroupId = newItem.SaleTaxCodeId;
        this.detailsData.UnitPriceExTax = newItem.UnitPriceExTax;
        this.setTaxModified(false);

        this.ignoreEvents = true;

        var taxCode = newItem.SaleTaxCodeId ? newItem.SaleTaxCodeId : newItem.DefaultTaxGroupId;
        var description = newItem.SalesDescription ? newItem.SalesDescription : newItem.Description;

        this.getItemForm().setValues({
            ItemId: newItem.ItemId,
            AccountId: newItem.AccountingCategoryId,
            ItemName: newItem.ItemPath,
            AccountName: newItem.Name,
            TaxGroupId: this.isTaxTracking() && taxCode ? taxCode : null,
            Description: description,
            UnitPrice: this.isTaxInclusive() ? '' : newItem.UnitPriceExTax
        });

        this.ignoreEvents = false;

        var that = this;
        this.getServerCalculatedValues('Item', function () {
            // Make sure the details fields are visible after an item is selected
            that.getItemDetail().showDetailsFields();
        });
    },

    unitPriceChanged: function (newValue, oldValue) {
        // Only respond to changes triggered by the user, not events triggered during page loading
        if (this.ignoreControlEvents()) return;

        // Emptying the field is treated as a 0 unit price
        newValue = newValue || 0;

        // Store the number of decimals the amount is captured with
        var splitNumber = newValue.toString().split('.');
        if (splitNumber.length == 2 && splitNumber[1].length > 1) {
            this.detailsData.UnitPriceAccuracy = splitNumber[1].length;
        }
        else {
            this.detailsData.UnitPriceAccuracy = 2;
        }

        if (!this.isTaxInclusive()) {
            // Update the tax exclusive unit price shadowing the unit price field
            this.detailsData.UnitPriceExTax = newValue;
        }
        this.getServerCalculatedValues('UnitPrice');
    },

    taxAmountChanged: function (newValue, oldValue) {
        if (this.ignoreControlEvents()) return;

        if (!newValue && newValue !== 0) {
            this.detailsData.TaxIsModified = false;
        }
        else {
            this.detailsData.TaxIsModified = true;
        }

        this.getServerCalculatedValues('Tax');
    },

    taxCodeChanged: function (field, newValue, oldValue) {
        this.getItemDetail().setTaxAmountAccessible(newValue !== null);

        if (this.ignoreControlEvents()) return;

        this.setTaxModified(false);
        this.getServerCalculatedValues('Tax');
    },

    quantityChanged: function () {
        if (this.ignoreControlEvents()) return;
        this.getServerCalculatedValues('Quantity');
    },

    amountChanged: function (newValue, oldValue) {
        // Only respond to changes triggered by the user, not events triggered during page loading
        if (this.ignoreControlEvents()) return;
        this.setTaxModified(false);
        this.getServerCalculatedValues('Amount');
    },

    getServerCalculatedValues: function (triggerField, completeCallback) {

        var formVals = this.getItemForm().getValues();

        // build a dummy expense
        var expense = {
            AmountTaxStatus: this.taxStatusCode,
            PreviousAmountTaxStatus: this.taxStatusCode,
            CustomerId: formVals.CustomerId,            
            LineItems: []
        };

        // set a single line item using current details        
        var lineItem = {
            // Flag the item as Status New, since this forces the server to calculate what the default tax for the item is (but not necessarily apply it)
            ChangeStatus: 2,
            ItemId: formVals.ItemId,
            AccountId: formVals.AccountId,
            Quantity: formVals.Quantity,
            TaxGroupId: this.isTaxTracking() ? formVals.TaxGroupId : null,
            TaxIsModified: this.detailsData.TaxIsModified,
            Tax: this.detailsData.TaxIsModified ? formVals.Tax : null,
            UnitPriceExTax: this.detailsData.UnitPriceExTax,
            // For Account lines the amount itself is editable and has to be passed through.
            TaxExclusiveTotalAmount: this.detailsData.AmountExTax,
            ExpenseClaimDate: formVals.ExpenseClaimDate
        };       

        switch (triggerField) {
            case 'UnitPrice':
                lineItem.UnitPrice = this.getUnitPrice().getValue() || 0;
                lineItem.UnitPriceIsModified = true;
                break;
            case 'Quantity':
                lineItem.QuantityIsModified = true;
                break;
           
            case 'Amount':
                var taxExclTotal = this.getAmount().getValue();
                // Calc service only accepts tax excl total amount, if we're showing amounts Gross we have to calculate the Net figure
                if (this.isTaxInclusive() && lineItem.TaxGroupId) {
                    var taxCode = RM.AppMgr.getTaxCode(lineItem.TaxGroupId);
                    if (taxCode) {
                        taxExclTotal = this.getAmount().getValue() / (100 + taxCode.Rate) * 100;
                    }
                }
                lineItem.TaxExclusiveTotalAmount = taxExclTotal;
                break;
        }

        expense.LineItems.push(lineItem);

        // call the expense calculation method
        this.ignoreEvents = true;
        RM.AppMgr.saveServerRec('ExpenseCalc', true, expense,
			function response(responseRecords) {
			    var calculated = responseRecords[0].Items[0];

			    this.detailsData.UnitPriceExTax = calculated.UnitPriceExTax || 0;
			    this.detailsData.UnitPrice = calculated.UnitPrice;
			    this.detailsData.Amount = calculated.Amount;
			    this.detailsData.AmountExTax = calculated.AmountExTax;
			    this.detailsData.AmountTax = calculated.AmountTax;
			    this.detailsData.Tax = calculated.Tax;
			    
			    this.setTaxModified(calculated.TaxIsModified);

			    // Now, the values displayed in the UI are rounded to the requisite number of decimals - THESE UI VALUES ARE NOT PERSISTED
			    var displayedUnitPrice = RM.util.MathHelpers.roundToEven(this.isTaxInclusive() ? calculated.UnitPrice : this.detailsData.UnitPriceExTax, this.detailsData.UnitPriceAccuracy);
			    this.getItemForm().setValues({
			        UnitPrice: displayedUnitPrice,
			        Amount: RM.util.MathHelpers.roundToEven(calculated.Amount, 2),
			        Tax: RM.util.MathHelpers.roundToEven(calculated.Tax, 2)
			    });

			    // Crazy workaround for a timing issue that occurs when using the clearIcon to reset the tax amount on android. The control will refocus itself before the new value is applied,
			    // which causes another change event to be triggered when you focus elsewhere after this code has applied the default calculated value.
			    this.getTax().blur();

			    this.ignoreEvents = false;
			    if (completeCallback) completeCallback();
			},
			this,
            function (eventMsg) {
                //TODO: what to do if the calc call fails, hmmm
                alert(eventMsg);
                this.ignoreEvents = false;
            },
            'Working...'
		);
    },

    ignoreControlEvents: function () {
        // Only respond to changes triggered by the user, not events triggered during control loading
        if (!this.initShow || this.ignoreEvents) return true;
    },

    setNewUnitPriceExTax: function (unitPriceExTax) {
        // If the value is the same as the current one, then there is nothing to do
        if (this.detailsData.UnitPriceExTax === unitPriceExTax) return;

        // Setting a new unit price ex tax means we have to reset the unit price displayed and call the calculation service
        this.ignoreEvents = true;
        this.setTaxModified(false);
        this.detailsData.UnitPriceExTax = unitPriceExTax;
        this.getUnitPrice().setValue(this.isTaxInclusive() ? '' : unitPriceExTax);
        this.ignoreEvents = false;
        this.getServerCalculatedValues();
    },

    // Check if the value in the unit price or tax fields is out of line with that in the current details data. This can happen in Android when the change event
    // fires after the button click event on the toolbar.
    pendingUnitPriceChange: function () {
        // Check if the unit price even exists yet (in the case where Add is clicked before even selecting an Item)               
        if (this.detailsData.UnitPrice === undefined) return false;

        var pendingPrice, pendingTax = false;
        if (this.isTaxInclusive()) {
            pendingPrice = this.getUnitPrice().getValue() !== RM.util.MathHelpers.roundToEven(this.detailsData.UnitPrice, this.detailsData.UnitPriceAccuracy);
        }
        else {
            pendingPrice = this.getUnitPrice().getValue() !== RM.util.MathHelpers.roundToEven(this.detailsData.UnitPriceExTax, this.detailsData.UnitPriceAccuracy);
        }

        // This check seems redundant, but tax can be set to null if the tax code is not set. If it isn't then the amount entered and displayed will only be to two decimals.
        pendingTax = this.detailsData.Tax !== this.getTax().getValue() && RM.util.MathHelpers.roundToEven(this.detailsData.Tax, 2) !== this.getTax().getValue();

        if (pendingPrice) RM.Log.debug('price change pending');
        if (pendingTax) RM.Log.debug('tax change pending');

        return pendingPrice || pendingTax;
    },

    dateChanged: function () {
        if (!this.detailsData.ExpenseClaimDate) {
            return;
        }
        var headerDate = new Date(this.detailsData.ExpenseClaimDate);
        var expenseLineDate = new Date(this.getDateFld().getValue());
        if (expenseLineDate.getTime() > headerDate.getTime()) {
            Ext.toast('Expense line date cannot be later than expense header date.', 3000);
            this.getDateFld().setValue(headerDate);
        }
    },

    onCustomerChanged: function () {
        this.setBillableFldAccess();
    },

    setBillableFldAccess: function () {
        this.getBillableFld().setDisabled(!this.getCustomerName().getValue());
        //set billable field to false when customer is removed
        if (!this.getCustomerName().getValue()) {
            this.getBillableFld().setValue(false);
        }        
    },

    onBillableChanged: function (billableFld) {
        if(billableFld.getValue()){
            this.detailsData.Status = RM.Consts.ExpenseLineItemStatus.BILLABLE;
        }            
        else {
            this.detailsData.Status = RM.Consts.ExpenseLineItemStatus.UNBILLABLE;
        }
        this.getStatus().setHtml(RM.ExpensesMgr.getExpenseLineItemStatusText(this.detailsData.Status));
    }

});
