Ext.define('RM.controller.EmailBillC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.EmailBill'],
    config: {
        refs: {
            emailBill: 'emailbill',
            emailBillForm: 'emailbill formpanel',
            email: 'emailbill emailfield[name=Email]',
            cc: 'emailbill emailfield[name=CC]',
            bcc: 'emailbill emailfield[name=BCC]',
            subject: 'emailbill textfield[name=Subject]',
            message: 'emailbill #emailForm textareafield',
            sentCont: 'emailbill #sentcont',
            errorCont: 'emailbill #errorcont',
            templateFld: 'emailbill selectfield[name=BillTemplateId]'
        },
        control: {
            'emailbill': {
                show: 'onShow',
                hide: 'onHide'
            },
            'emailbill #back': {
                tap: 'back'
            },
            'emailbill #send': {
                tap: 'onSend'
            },
            'emailbill #continue': {
                tap: 'onContinue'
            },
            'emailbill #retry': {
                tap: 'onRetry'
            },
            'emailbill #cancel': {
                tap: 'onCancel'
            },
            'emailbill #emailForm textareafield': {
                tap: 'showMessage'
            }
        }
    },

    showView: function (cb, cbs, billData, msgType) {
        this.goCb = cb;
        this.goCbs = cbs;
        this.billData = billData;
        this.msgType = msgType;
        this.messageText = '';
        this.dataLoaded = false;

        RM.ViewMgr.regFormBackHandler(this.back, this);

        var view = this.getEmailBill();
        if (view) {
            view.setActiveItem(0);
        }
        else {
            view = { xtype: 'emailbill' };
        }
        RM.ViewMgr.showPanel(view);
    },


    onShow: function () {
        if (this.messageText) return;
        if (this.dataLoaded) {
            return;
        }
        var emailBillForm = this.getEmailBillForm();
        emailBillForm.reset();

        RM.ViewMgr.regFormBackHandler(this.back, this);

        RM.AppMgr.getServerRec('BillMessagesTemplates', { BillId: this.billData.BillId },
            function (rec) {
                emailBillForm.setValues({ Email: this.billData.SupplierEmail, CC: rec.CC, BCC: rec.BCC, Subject: rec.Subject, Body: rec.Body });
                this.loadTemplates();
            },
            this,
            this.goBack,
            null,
            this.goBack
        );

        this.dataLoaded = true;
    },

    onHide: function () {
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },

    loadTemplates: function () {
        var store = Ext.data.StoreManager.lookup('BillTemplates');
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('BillTemplates'));

        store.clearFilter();
        store.filter('templateType', RM.Consts.DocTemplates.BILL);

        RM.AppMgr.loadStore(store,
            function () {
                this.getTemplateFld().setValue(this.billData.TemplateId);
            },
            this,
            this.goBack,
            null,
            this.goBack
        );
    },

    showMessage: function () {
        var message = this.getMessage().getValue();
        var label = this.getMessage().getLabel();
        RM.Selectors.showNoteText(
            label,
            true,
            'Done',
            message,
            function (messageText) {
                this.messageText = messageText;
                this.getMessage().setValue(messageText);
                RM.ViewMgr.back();
            },
            this
        );
    },

    validateForm: function (vals) {
        var isValid = true;

        //To reset label color
        this.getEmail().showValidation(true);
        this.getSubject().showValidation(true);

        if (vals.Email == '' && vals.Subject == '') {
            this.getEmail().showValidation(false);
            this.getSubject().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidFormMsg();
            return isValid;
        }

        if (vals.Email == '') {
            this.getEmail().showValidation(false);
            isValid = false;
        }

        if (!RM.AppMgr.validateEmail(vals.Email)) {
            this.getEmail().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidEmailMsg();
            return isValid;
        }

        if (this.checkForMultipleEmailAddresses(vals.Email)) {
            this.getEmail().showValidation(false);
            isValid = false;
            RM.AppMgr.showNoMultipleEmailMsg();
            return isValid;
        }

        if (vals.CC && !RM.AppMgr.validateEmail(vals.CC)) {
            this.getCc().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidEmailMsg();
            return isValid;
        }

        if (this.checkForMultipleEmailAddresses(vals.CC)) {
            this.getCc().showValidation(false);
            isValid = false;
            RM.AppMgr.showNoMultipleEmailMsg();
            return isValid;
        }

        if (vals.BCC && !RM.AppMgr.validateEmail(vals.BCC)) {
            this.getBcc().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidEmailMsg();
            return isValid;
        }

        if (this.checkForMultipleEmailAddresses(vals.BCC)) {
            this.getBcc().showValidation(false);
            isValid = false;
            RM.AppMgr.showNoMultipleEmailMsg();
            return isValid;
        }

        if (vals.Subject == '') {
            this.getSubject().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidFormMsg();
            return isValid;
        }

        if (!isValid) {
            RM.AppMgr.showInvalidFormMsg();
        }

        return isValid;
    },

    checkForMultipleEmailAddresses: function (fieldVal) {
        if (fieldVal.indexOf(',') !== -1 || fieldVal.indexOf(';') !== -1 || fieldVal.indexOf(' ') >= 1) {
            return true;
        }
    },

    onSend: function () {
        var vals = this.getEmailBillForm().getValues();
        vals.BillId = this.billData.BillId;
        vals.MsgType = this.msgType;

        if (this.validateForm(vals)) {
            RM.AppMgr.saveServerRec('BillMessages', true, vals,
               function (recs) {
                   this.showEmailSent(vals.Email);
               },
               this,
               function (recs, eventMsg) {
                   this.showEmailFail(eventMsg);
               }, 'Sending...'
           );
        }
    },

    showEmailSent: function (email) {
        this.getSentCont().setHtml('Email sent to ' + email);
        this.getEmailBill().setActiveItem(1);
    },

    showEmailFail: function (eventMsg) {
        this.getErrorCont().setHtml('Error sending email.<br/>' + eventMsg);
        this.getEmailBill().setActiveItem(2);
    },

    onContinue: function () {
        //RM.ViewMgr.backTo('billdetail');
        this.goCb.call(this.goCbs);
    },

    onRetry: function () {
        this.getEmailBill().setActiveItem(0);
    },

    onCancel: function () {
        //RM.ViewMgr.backTo('billdetail');
        this.goCb.call(this.goCbs);
    },

    goBack: function () {
        RM.ViewMgr.back();
    },

    back: function () {
        RM.AppMgr.showYesNoMsgBox("Are you sure you want to cancel sending email?",
                 function (btn) {
                     if (btn == 'yes') {
                         this.goBack();
                     }
                 },
                 this
               );
    }
});