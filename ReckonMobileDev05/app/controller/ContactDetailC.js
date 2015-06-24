Ext.define('RM.controller.ContactDetailC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.ContactDetail'],
    config: {
        refs: {
            contactDetail: 'contactdetail',
            contactTitle: 'contactdetail #title',
            saveBtn: 'contactdetail #save',
            contactForm: 'contactdetail #contactForm',
            descriptionFld: 'contactdetail textfield[name=Description]',
            customerOrSupplier: 'contactdetail #customerOrSupplier',
            businessOrIndividual: 'contactdetail #businessOrIndividual',
            addressHeader: 'contactdetail #addressHeader',
            detailHeader: 'contactdetail #detailHeader',
            businessName: 'contactdetail field[name=BusinessName]',
            branchName: 'contactdetail field[name=BranchName]',
            abn: 'contactdetail field[name=ABN]',
            firstName: 'contactdetail field[name=FirstName]',
            surname: 'contactdetail field[name=Surname]',
            phoneContainer: 'contactdetail #phoneContainer',
            faxContainer: 'contactdetail #faxContainer',
            email: 'contactdetail field[name=Email]',
            web: 'contactdetail field[name=Web]',
            notesFld: 'contactdetail field[name=Notes]',
            postalAddress: 'contactdetail #postalAddress',
            businessAddress: 'contactdetail #businessAddress',
            sameAddress: 'contactdetail field[name=SameAddress]',
            postalAddressCountry: 'contactdetail #postalAddress field[name=PostalAddress.Country]',
            businessAddressCountry: 'contactdetail #businessAddress field[name=BusinessAddress.Country]',
            termsFld: 'contactdetail textfield[name=Terms]',
            creditLimitFld: 'contactdetail textfield[name=CreditLimit]'
        },
        control: {
            'contactdetail': {
                show: 'onShow',
                hide: 'onHide'
            },
            'contactdetail #back': {
                tap: 'back'
            },
            'contactdetail #save': {
                tap: 'onSave'
            },
            'contactdetail #customerOrSupplier': {
                change: 'onCustomerOrSupplierSelect'
            },
            'contactdetail #businessOrIndividual': {
                change: 'onBusinessOrIndividualSelect'
            },
            'contactdetail #postalAddressSelectField': {
                change: 'onPostalAddressSelect'
            },
            'contactdetail #businessAddressSelectField': {
                change: 'onBusinessAddressSelect'
            },
            notesFld: {
                tap: 'showNotes'
            },
            sameAddress: {
                change: 'sameAddressChanged'
            },
            'contactdetail #postalAddress field': {
                change: 'onPostalAddressChanged'
            },
            termsFld: {
                itemloaded: 'showHideClearIconOnTermsField'
            }
        }

    },

    showView: function (isCreate, data, cb, cbs, callbackViewName) {
        this.isCreate = isCreate;
        this.isEditable = true;
        this.detailsData = data ? data : {};
        this.detailsCb = cb;
        this.detailsCbs = cbs;
        this.callbackViewName = callbackViewName;
        this.dataLoaded = false;

        var view = this.getContactDetail();
        if (!view) {
            view = { xtype: 'contactdetail' };
        }
        this.formattedNoteValue = null; //prevent showing note text from last contact        
        RM.ViewMgr.showPanel(view);
    },

    isFormDirty: function () {
        return !RM.AppMgr.isFormValsEqual(this.getContactForm().getValues(), this.initialFormValues);
    },

    onShow: function () {
        RM.ViewMgr.regFormBackHandler(this.back, this);
        this.getContactTitle().setHtml(this.isCreate ? 'Add contact' : 'View contact');
        this.loadCountrySpecificDetails();        
        this.cashbookHasDefaultTerm = false;
        //Load the terms list from the store
        var store = this.getTermsFld().getStore();
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('Terms'));
        store.getProxy().setExtraParams({ Id: RM.CashbookMgr.getCashbookId() });
        RM.AppMgr.loadStore(store, this.setCashbookDefaultTerm, this);

        if (!this.dataLoaded) {
            var contactForm = this.getContactForm(), businessOrIndividual = this.getBusinessOrIndividual();

            //simply setting the field disabled works in simulator but doesn't display value in iOS
            businessOrIndividual.setReadOnly(!this.isCreate);
            if (!this.isCreate) {
                businessOrIndividual.addCls('rm-flatfield-disabled');
            }

            if (!this.isCreate) {
                this.loadFormData();
            }
            else {
                var data = {};
                contactForm.setValues(data);
                this.getCustomerOrSupplier().setValue(null);
                this.getBusinessOrIndividual().setValue(null);
                this.detailsData.IsPerson = null;
                this.detailsData.IsCustomer = null;
                this.detailsData.IsSupplier = null;
                this.initialFormValues = contactForm.getValues();                              
                this.dataLoaded = true;
            }
        }        
    },

    //Hide term field clear icon if there is a term set on cashbook 
    showHideClearIconOnTermsField: function(){
        if (this.cashbookHasDefaultTerm) {
            this.getTermsFld().hideClearIcon();
        }
    },

    //callback function to load store request, used for loading term while creating a new record
    setCashbookDefaultTerm: function () {
        var me = this;
        var store = this.getTermsFld().getStore();
        if (me.isCreate) { this.getTermsFld().setValue(null); }
        store.each(function (item) {
            if (item.data.IsSelected) {
                if (me.isCreate) { me.getTermsFld().setValue(item.data.TermID); }
                me.getTermsFld().hideClearIcon();
                me.cashbookHasDefaultTerm = true;
            }
        });
    },

    onHide: function () {
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },

    onSave: function (button) {
        if (this.isFormDirty()) {
            this.save();
        }
        else {
            this.goBack();
        }
    },

    //Set cashbook default term when no default term set on contact while loading contact data  
    setDefaultTermWhenNoTermSet: function () {
        var me = this;
        var store = this.getTermsFld().getStore();
        store.each(function (item) {
            if (item.data.IsSelected) {
                me.getTermsFld().setValue(item.data.TermID);
                me.getTermsFld().hideClearIcon();
                me.cashbookHasDefaultTerm = true;
            }
        });
    },

    setEditable: function (editable) {
        this.isEditable = editable;
        this.getSaveBtn().setHidden(!editable);
        if (!editable) { RM.util.FormUtils.makeAllFieldsReadOnly(this.getContactForm()); }
    },

    loadCountrySpecificDetails: function () {
        var countrySettings = RM.CashbookMgr.getCountrySettings();
        this.getAbn().setLabel(countrySettings.TaxLabel);
        this.showCountrySpecificPostalFields();
        this.showCountrySpecificBusinessFields();
    },

    showCountrySpecificPostalFields: function () {
        var countrySettings = RM.CashbookMgr.getCountrySettings();
        var addressFields = countrySettings.AddressLabels.split(' ');
        this.hideAllPostalAddressFields(true);
        for (var i = 0; i < addressFields.length; i++) {
            this.showPostalAddressField(addressFields[i]);
        }
    },

    showCountrySpecificBusinessFields: function () {
        var countrySettings = RM.CashbookMgr.getCountrySettings();
        var addressFields = countrySettings.AddressLabels.split(' ');
        this.hideAllBusinessAddressFields(true);
        for (var i = 0; i < addressFields.length; i++) {
            this.showBusinessAddressField(addressFields[i]);
        }
    },

    hideAllPostalAddressFields: function (boolValue) {
        var contactDetail = this.getContactDetail();
        contactDetail.down('field[name=PostalAddress.Address1]').setHidden(boolValue);
        contactDetail.down('field[name=PostalAddress.Address2]').setHidden(boolValue);
        contactDetail.down('field[name=PostalAddress.Suburb]').setHidden(boolValue);
        contactDetail.down('field[name=PostalAddress.Town]').setHidden(boolValue);
        contactDetail.down('field[name=PostalAddress.State]').setHidden(boolValue);
        contactDetail.down('field[name=PostalAddress.PostCode]').setHidden(boolValue);
        contactDetail.down('field[name=PostalAddress.Country]').setHidden(boolValue);
    },

    hideAllBusinessAddressFields: function (boolValue) {
        var contactDetail = this.getContactDetail();
        contactDetail.down('field[name=BusinessAddress.Address1]').setHidden(boolValue);
        contactDetail.down('field[name=BusinessAddress.Address2]').setHidden(boolValue);
        contactDetail.down('field[name=BusinessAddress.Suburb]').setHidden(boolValue);
        contactDetail.down('field[name=BusinessAddress.Town]').setHidden(boolValue);
        contactDetail.down('field[name=BusinessAddress.State]').setHidden(boolValue);
        contactDetail.down('field[name=BusinessAddress.PostCode]').setHidden(boolValue);
        contactDetail.down('field[name=BusinessAddress.Country]').setHidden(boolValue);
    },

    showPostalAddressField: function (fieldName) {
        var contactDetail = this.getContactDetail();
        switch (fieldName) {
            case 'Line1':
                contactDetail.down('field[name=PostalAddress.Address1]').setHidden(false);
                break;
            case 'Line2':
                contactDetail.down('field[name=PostalAddress.Address2]').setHidden(false);
                break;
            case 'Suburb':
                contactDetail.down('field[name=PostalAddress.Suburb]').setHidden(false);
                break;
            case 'Town':
                contactDetail.down('field[name=PostalAddress.Town]').setHidden(false);
                break;
            case 'State':
                contactDetail.down('field[name=PostalAddress.State]').setHidden(false);
                break;
            case 'Postcode':
                contactDetail.down('field[name=PostalAddress.PostCode]').setHidden(false);
                break;
        }
    },

    showBusinessAddressField: function (fieldName) {
        var contactDetail = this.getContactDetail();
        switch (fieldName) {
            case 'Line1':
                contactDetail.down('field[name=BusinessAddress.Address1]').setHidden(false);
                break;
            case 'Line2':
                contactDetail.down('field[name=BusinessAddress.Address2]').setHidden(false);
                break;
            case 'Suburb':
                contactDetail.down('field[name=BusinessAddress.Suburb]').setHidden(false);
                break;
            case 'Town':
                contactDetail.down('field[name=BusinessAddress.Town]').setHidden(false);
                break;
            case 'State':
                contactDetail.down('field[name=BusinessAddress.State]').setHidden(false);
                break;
            case 'Postcode':
                contactDetail.down('field[name=BusinessAddress.PostCode]').setHidden(false);
                break;
        }
    },

    loadFormData: function () {
        RM.AppMgr.getServerRecById('Contacts', this.detailsData.ContactId,
			function (data) {
			    this.formattedNoteValue = data.Notes;
			    // Strip newlines and display the notes unformatted in the textbox
			    data.Notes = data.Notes ? data.Notes.replace(/(\r\n|\n|\r)/g, ' ') : '';

			    var contactForm = this.getContactForm();
			    contactForm.setValues(data);
			    this.setNestedPropertyValues(this.getBusinessAddress(), data, 'BusinessAddress');
			    this.setNestedPropertyValues(this.getPostalAddress(), data, 'PostalAddress');
			    this.loadFieldsData(data);
			    this.initialFormValues = contactForm.getValues();
			    if (Ext.isDefined(data.SaveSupport) && !data.SaveSupport) {
			        this.setEditable(false);
			    }
			    if (data.ViewNotice) {
			        RM.AppMgr.showOkMsgBox(data.ViewNotice);
			    }

			    this.dataLoaded = true;
			},
			this,
            function (eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
                this.goBack();
            }
		);
    },

    validateForm: function (vals) {
        var isValid = true;
        if (vals.IsCustomer == null && vals.IsSupplier == null) {
            //this.getCustomerOrSupplier().setLabelCls('rm-manfld-notset-lbl');
            this.getCustomerOrSupplier().showValidation(false);
            isValid = false;
        }

        if (vals.IsPerson == null) {
            this.getBusinessOrIndividual().showValidation(false);
            isValid = false;
        }

        if (vals.IsPerson == true && !vals.FirstNameBranchName) {
            this.getFirstName().showValidation(false);
            isValid = false;
        }

        if (vals.IsPerson == true && !vals.SurnameBusinessName) {
            this.getSurname().showValidation(false);
            isValid = false;
        }

        if (vals.IsPerson == false && !vals.SurnameBusinessName) {
            this.getBusinessName().showValidation(false);
            isValid = false;
        }

        if (!vals.Description) {
            this.getDescriptionFld().showValidation(false);
            isValid = false;
        }

        if (vals.Email !== '' && !RM.AppMgr.validateEmail(vals.Email)) {
            this.getEmail().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidEmailMsg();
            return isValid;
        }

        if (vals.Web !== '' && !RM.AppMgr.validateURL(vals.Web)) {
            this.getWeb().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidURLMsg();
            return isValid;
        }

        if (!isValid) {
            RM.AppMgr.showInvalidFormMsg();
        }

        return isValid;
    },

    save: function () {

        var vals = this.getContactForm().getValues();
        vals.IsPerson = this.detailsData.IsPerson;
        if (vals.IsPerson === true) {
            vals.FirstNameBranchName = vals.FirstName;
            vals.SurnameBusinessName = vals.Surname;
        }
        else {
            vals.FirstNameBranchName = vals.BranchName;
            vals.SurnameBusinessName = vals.BusinessName;
        }
        delete vals.FirstName;
        delete vals.Surname;
        delete vals.BranchName;
        delete vals.BusinessName;

        vals.IsCustomer = this.detailsData.IsCustomer;
        vals.IsSupplier = this.detailsData.IsSupplier;
        vals.IsActive = true;                             //Set this to field value when contact state field is added back to contact detail form

        // Save the fully formatted notes value, not the unformatted one displayed in the textbox
        vals.Notes = this.formattedNoteValue;

        // Some fernagling to get the address fields populated properly
        this.unFlattenProperty(vals, 'BusinessAddress');
        this.unFlattenProperty(vals, 'PostalAddress');


        //For Address type National: 1, delete Country field from request data 
        if (vals.PostalAddress.Address === 1) {
            delete vals.PostalAddress.Country;
        }
        if (vals.BusinessAddress.Address === 1) {
            delete vals.BusinessAddress.Country;
        }        

        if (this.validateForm(vals)) {
            delete vals.CustomerOrSupplier;
            delete vals.BusinessOrIndividual;

            RM.AppMgr.saveServerRec('Contacts', this.isCreate, vals,
    			function (val) {
    			    if (this.callbackViewName && this.callbackViewName == 'Customers') {
    			        this.detailsCb.call(this.detailsCbs, val);
    			    }
    			    RM.AppMgr.itemUpdated('contact');
    			    RM.ViewMgr.back();
    			},
    			this,
                function (recs, eventMsg) {
                    RM.AppMgr.showOkMsgBox(eventMsg);
                }
    		);
        }
    },

    goBack: function () {
        this.detailsCb.call(this.detailsCbs, 'back');
        RM.ViewMgr.back();
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

    showNotes: function () {

        RM.Selectors.showNoteText(
            'Notes',
            this.isEditable && !this.getContactForm().addEditDenied,
            'SAVE',
            this.formattedNoteValue || '',
            function (noteText) {
                RM.ViewMgr.back();
                this.formattedNoteValue = noteText;
                this.getNotesFld().setValue(noteText.replace(/(\r\n|\n|\r)/g, ' '));
            },
            this
        );

    },

    onPostalAddressSelect: function (selectfield, newValue, oldValue) {
        //National: 1 International:2
        //If National, show fields from Cashbook's CountrySettings.AddressLabels
        //If International, show all fields 
        if (newValue === 1) {
            this.showCountrySpecificPostalFields();
        } else {
            this.hideAllPostalAddressFields(false);
        }
    },

    onBusinessAddressSelect: function (selectfield, newValue, oldValue) {
        //National: 1 International:2
        //If National, show fields from Cashbook's CountrySettings.AddressLabels
        //If International, show all fields 
        if (newValue === 1) {
            this.showCountrySpecificBusinessFields();
        } else {
            this.hideAllBusinessAddressFields(false);
        }
    },

    onCustomerOrSupplierSelect: function () {
        var selection = this.getCustomerOrSupplier().getSelectedOptions();
        if (selection && selection.Customer) {
            this.detailsData.IsCustomer = true;
        }
        if (selection && selection.Supplier) {
            this.detailsData.IsSupplier = true;
        }
        
        //hide and reset paymentterms and creditlimit fields when supplier is selected 
        this.getTermsFld().setHidden(!this.detailsData.IsCustomer);
        this.getCreditLimitFld().setHidden(!this.detailsData.IsCustomer);
        if (!this.detailsData.IsCustomer) {
            this.getTermsFld().setValue(null);
            this.getCreditLimitFld().setValue('');
        }
    },

    onBusinessOrIndividualSelect: function () {
        var selection = this.getBusinessOrIndividual().getValue();

        if (selection == 'Business') {
            this.detailsData.IsPerson = false;
            this.getDetailHeader().setHtml('<h3 class="rm-m-1 rm-hearderbg">Business details</h3>');
            this.getBusinessName().setHidden(false);
            this.getBranchName().setHidden(false);
            this.getFirstName().setHidden(true);
            this.getSurname().setHidden(true);
        }
        else {
            this.detailsData.IsPerson = true;
            this.getDetailHeader().setHtml('<h3 class="rm-m-1 rm-hearderbg">Individual details</h3>');
            this.getBusinessName().setHidden(true);
            this.getBranchName().setHidden(true);
            this.getFirstName().setHidden(false);
            this.getSurname().setHidden(false);
        }

        this.getContactDetail().showDetailsFields();
    },

    sameAddressChanged: function (field, sameAddress) {
        var enableFields = true;
        if (sameAddress == 'Yes') {
            // Copy all the postal address fields into the business ones
            this.copyPostalToBusiness();
            enableFields = false;
        }

        this.getBusinessAddress().getItems().items.forEach(function (item) {
            if (item.getName && item.getName().indexOf('BusinessAddress.') === 0) {
                item.setReadOnly(!enableFields);
                item.setPlaceHolder(enableFields ? 'enter' : '');
            }
        });
    },

    onPostalAddressChanged: function () {
        if (this.getSameAddress().getValue()) {
            this.copyPostalToBusiness();
        }
    },

    copyPostalToBusiness: function () {
        var contactDetail = this.getContactDetail();
        contactDetail.down('field[name=BusinessAddress.Address]').setValue(this.getContactDetail().down('field[name=PostalAddress.Address]').getValue());
        contactDetail.down('field[name=BusinessAddress.Address1]').setValue(this.getContactDetail().down('field[name=PostalAddress.Address1]').getValue());
        contactDetail.down('field[name=BusinessAddress.Address2]').setValue(this.getContactDetail().down('field[name=PostalAddress.Address2]').getValue());
        contactDetail.down('field[name=BusinessAddress.Suburb]').setValue(this.getContactDetail().down('field[name=PostalAddress.Suburb]').getValue());
        contactDetail.down('field[name=BusinessAddress.Town]').setValue(this.getContactDetail().down('field[name=PostalAddress.Town]').getValue());
        contactDetail.down('field[name=BusinessAddress.State]').setValue(this.getContactDetail().down('field[name=PostalAddress.State]').getValue());
        contactDetail.down('field[name=BusinessAddress.PostCode]').setValue(this.getContactDetail().down('field[name=PostalAddress.PostCode]').getValue());
        contactDetail.down('field[name=BusinessAddress.Country]').setValue(this.getContactDetail().down('field[name=PostalAddress.Country]').getValue());
    },

    loadFieldsData: function (data) {

        var selection = {};
        if (data.IsCustomer) {
            selection.Customer = true;
        }
        if (data.IsSupplier) {
            selection.Supplier = true;
        }
        this.getCustomerOrSupplier().setSelectedOptions(selection);        

        if (data.IsPerson == true) {
            this.getBusinessOrIndividual().setValue('Individual');
            this.getFirstName().setValue(data.FirstNameBranchName);
            this.getSurname().setValue(data.SurnameBusinessName);
        }
        else {
            this.getBusinessOrIndividual().setValue('Business');
            this.getBusinessName().setValue(data.SurnameBusinessName);
            this.getBranchName().setValue(data.FirstNameBranchName);
        }

        if (data.PostalAddress.Address === 1 || data.PostalAddress.Address === 0) {
            this.getPostalAddressCountry().setHidden(true);
        }
        else {
            this.getPostalAddressCountry().setHidden(false);
        }
        if (data.BusinessAddress.Address === 1 || data.BusinessAddress.Address === 0) {
            this.getBusinessAddressCountry().setHidden(true);
        }
        else {
            this.getBusinessAddressCountry().setHidden(false);
        }
        if (data.Terms == null) {
            this.setDefaultTermWhenNoTermSet();
        }
    },

    // Populate all fields in the container that are to be bound to properties of the valuesObject.parentProperty object
    // e.g. parentProperty.Address1, parentProperty.Address2 etc, using the field name as the binding identifier
    setNestedPropertyValues: function (container, valuesObject, parentProperty) {
        var fieldName, childProperty, containerItems;
        var dottedProperty = parentProperty + '.';

        containerItems = container.getItems().items;
        containerItems.forEach(function (item) {
            // Make sure this item is a field that has a Name getter
            fieldName = item.getName ? item.getName() : null;

            // It also has to be bound to a child property of parentProperty
            if (!fieldName || fieldName.indexOf(dottedProperty) !== 0) return;

            // We have a winner, set the field value accordingly
            childProperty = fieldName.replace(dottedProperty, '');
            item.setValue(valuesObject[parentProperty][childProperty]);
        });
    },

    // Find all properties on the object that start with "propertyName." and hydrate 
    // them into an object literal property of the same name
    unFlattenProperty: function (object, propertyName) {
        var property, dottedName;
        dottedName = propertyName + ".";

        object[propertyName] = object[propertyName] || {};
        for (property in object) {
            if (property.indexOf(dottedName) === 0) {
                object[propertyName][property.replace(dottedName, '')] = object[property];
                delete object[property];
            }
        }

    }

});
