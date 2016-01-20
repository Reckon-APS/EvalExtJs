Ext.define('RM.controller.BillLineItemC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.BillLineItem', 'RM.util.FormUtils', 'RM.util.PseudoGuid', 'RM.util.MathHelpers'],
    config: {
        refs: {
            itemDetail: 'billlineitem',
            itemTitle: 'billlineitem #title',
            addBtn: 'billlineitem #add',
            itemForm: 'billlineitem #itemForm',
            description: 'billlineitem field[name=Description]',
            unitPrice: 'billlineitem field[name=UnitPrice]',
            quantity: 'billlineitem field[name=Quantity]',
            discount: 'billlineitem field[name=Discount]',
            taxCode: 'billlineitem field[name=TaxGroupId]',
            tax: 'billlineitem field[name=Tax]',
            amount: 'billlineitem field[name=Amount]',
            itemNameFld: 'billlineitem field[name=ItemName]',
            accountFld: 'billlineitem field[name=AccountName]',
            projectId: 'billlineitem field[name=ProjectId]',
            itemId: 'billlineitem field[name=ItemId]',
            projectName: 'billlineitem field[name=ProjectName]',
        },
        control: {
            'billlineitem': {
                show: 'onShow',
                hide: 'onHide'
            },
            'billlineitem #itemForm exttextfield': {
                tap: 'onFieldTap'
            },
            'billlineitem #back': {
                tap: 'back'
            },
            'billlineitem #add': {
                tap: 'add'
            },
            unitPrice: {
                valueChange: 'unitPriceChanged'
            },
            tax: {
                valueChange: 'taxAmountChanged'/*,
                clearicontap: function() { this.taxAmountChanged(null,null); }*/
            },
            'taxCode': {
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
            },
            amount: {
                valueChange: 'amountChanged'
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

    showView: function (editable, supplierId, options, detailsData, cb, cbs) {
        this.ignoreEvents = false;
        this.isEditable = editable;
        this.supplierId = supplierId;
        this.taxStatusCode = options.taxStatus;
        this.billDate = options.billDate;
        this.detailsCb = cb;
        this.detailsCbs = cbs;

        if (!options.isCreate) {
            this.isCreate = false;
            this.detailsData = Ext.clone(detailsData);
        }
        else {
            this.isCreate = true;
            this.detailsData = {
                IsNew: true,
                BillLineItemId: RM.util.PseudoGuid.next(),
                UnitPriceAccuracy: 2,
                Quantity: null,
                TaxGroupId: null,
                TaxIsModified: false
            };
        }

        var view = this.getItemDetail();

        this.initShow = false;

        if (!view) {
            view = { xtype: 'billlineitem' };
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

        if (!RM.CashbookMgr.getTaxPreferences().AllowTaxEdit) {
            this.getTax().addCls(['rm-flatfield-disabled']);
        }

        if (!this.isEditable) { this.makeViewReadonly(); }

        if (!this.initShow) {
            itemForm.reset();
            itemForm.setValues(this.detailsData);
            this.setDiscountDisplayValue(this.detailsData.DiscountPercentage, this.detailsData.DiscountAmount);

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

        if (this.isCreate && !(this.getItemNameFld().getValue() || this.getAccountFld().getValue())) {
            this.hideAddOption();
        }
        else {
            this.showAddOption();
        }
    },

    hideAddOption: function () {
        this.getAddBtn().setHidden(true);
    },

    showAddOption: function () {
        this.getAddBtn().setHidden(!this.isEditable);
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

    setTaxModified: function (isModified) {
        this.detailsData.TaxIsModified = isModified;
        this.getItemDetail().setTaxModified(isModified);
    },

    setDiscountDisplayValue: function (discountPercent, discountAmount) {
        var discount;
        if (discountPercent) {
            discount = discountPercent + '%';
        }
        else if (discountAmount) {
            discount = RM.AppMgr.formatCurrency(discountAmount, 2);
        }
        else {
            discount = 'None';
        }
        this.getDiscount().setValue(discount);
    },

    onFieldTap: function (tf) {
        if (this.isEditable) {
            if (tf.getName() == 'Discount') {
                RM.ViewMgr.hideKeyPad();
                var discVal = tf.getValue();
                RM.InvoicesMgr.showChooseDiscountPopup(
                    'None' ? 0 : discVal,
    				function (disc) {
    				    tf.setValue(disc == 0 ? 'None' : disc);
    				},
    				this
    			);
            }
            else if (tf.getName() == 'ProjectName') {
                RM.Selectors.showProjects(
                    this.supplierId,
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
        this.getDiscount().setHidden(true);
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
        if (vals.Amount < 0) {
            RM.AppMgr.showOkMsgBox("The item amount can't be negative, please check discount & item amount.");
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
        delete formVals.Discount;

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

    projectChanged: function (newProjectData, oldProjectId) {
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
        this.detailsData.DefaultTaxGroupId = newItem.PurchaseTaxCodeId;
        this.detailsData.UnitPriceExTax = newItem.UnitPriceExTax;
        this.setTaxModified(false);

        this.ignoreEvents = true;

        var taxCode = newItem.PurchaseTaxCodeId ? newItem.PurchaseTaxCodeId : newItem.DefaultTaxGroupId;
        var description = newItem.SalesDescription ? newItem.SalesDescription : newItem.Description;

        this.getItemForm().setValues({
            ItemId: newItem.ItemId,
            AccountId: newItem.AccountingCategoryId,
            ItemName: newItem.ItemPath,
            AccountName: newItem.Name,
            TaxGroupId: this.isTaxTracking() && taxCode ? taxCode : null,
            Description: description,
            UnitPrice: this.isTaxInclusive() ? '' : newItem.UnitPriceExTax,
            BillDate: formVals.BillDate()
        });

        if (newItem.PurchasePrice) {
            this.setNewUnitPriceExTax(newItem.PurchasePrice);
        }

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

    discountChanged: function (field, newValue, oldValue) {
        if (this.ignoreControlEvents()) return;

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
        // build a dummy bill
        var bill = {
            AmountTaxStatus: this.taxStatusCode,
            PreviousAmountTaxStatus: this.taxStatusCode,
            SupplierId: this.supplierId,
            BillDate: this.billDate,
            LineItems: []
        };

        // set a single line item using current details
        var formVals = this.getItemForm().getValues();
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
            TaxExclusiveTotalAmount: this.detailsData.AmountExTax
        };

        // Only pass the ex-tax discount amount if not using a percentage
        if (this.detailsData.DiscountPercentage) {
            lineItem.DiscountPercentage = this.detailsData.DiscountPercentage;
        }
        else {
            lineItem.DiscountAmountExTax = this.detailsData.DiscountAmountExTax;
            lineItem.DiscountAmountTax = this.detailsData.DiscountAmountTax;
        }

        switch (triggerField) {
            case 'UnitPrice':
                lineItem.UnitPrice = this.getUnitPrice().getValue() || 0;
                lineItem.UnitPriceIsModified = true;
                break;
            case 'Quantity':
                lineItem.QuantityIsModified = true;
                break;
            case 'Discount':
                if (!lineItem.DiscountPercentage) {
                    lineItem.DiscountAmount = this.isTaxInclusive() ? this.detailsData.DiscountAmount : this.detailsData.DiscountAmountExTax;
                    lineItem.DiscountAmountExTax = this.isTaxInclusive() ? null : this.detailsData.DiscountAmount;
                    lineItem.DiscountAmountTax = null;
                }
                lineItem.DiscountIsModified = true;
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

        bill.LineItems.push(lineItem);

        // call the bill calculation method
        this.ignoreEvents = true;
        RM.AppMgr.saveServerRec('BillCalc', true, bill,
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
    }

});
