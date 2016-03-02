Ext.define('RM.controller.EmailExpenseC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.EmailExpense'],
    config: {
        refs: {
            emailExpense: 'emailexpense',
            emailExpenseForm: 'emailexpense formpanel',
            email: 'emailexpense emailfield[name=Email]',
            cc: 'emailexpense emailfield[name=CC]',
            bcc: 'emailexpense emailfield[name=BCC]',
            subject: 'emailexpense textfield[name=Subject]',
            message: 'emailexpense #emailForm textareafield',
            sentCont: 'emailexpense #sentcont',
            errorCont: 'emailexpense #errorcont',
            templateFld: 'emailexpense selectfield[name=ExpenseClaimTemplateId]'
        },
        control: {
            'emailexpense': {
                show: 'onShow',
                hide: 'onHide'
            },
            'emailexpense #back': {
                tap: 'back'
            },
            'emailexpense #send': {
                tap: 'onSend'
            },
            'emailexpense #continue': {
                tap: 'onContinue'
            },
            'emailexpense #retry': {
                tap: 'onRetry'
            },
            'emailexpense #cancel': {
                tap: 'onCancel'
            },
            'emailexpense #emailForm textareafield': {
                tap: 'showMessage'
            }
        }
    },

    showView: function (cb, cbs, expenseData, msgType) {
        this.goCb = cb;
        this.goCbs = cbs;
        this.expenseData = expenseData;
        this.msgType = msgType;
        this.messageText = '';
        this.dataLoaded = false;

        RM.ViewMgr.regFormBackHandler(this.back, this);

        var view = this.getEmailExpense();
        if (view) {
            view.setActiveItem(0);
        }
        else {
            view = { xtype: 'emailexpense' };
        }
        RM.ViewMgr.showPanel(view);
    },


    onShow: function () {
        if (this.messageText) return;
        if (this.dataLoaded) {
            return;
        }
        var emailExpenseForm = this.getEmailExpenseForm();
        emailExpenseForm.reset();        

        RM.ViewMgr.regFormBackHandler(this.back, this);

        RM.AppMgr.getServerRec('ExpenseMessagesTemplates', { ExpenseClaimId: this.expenseData.ExpenseClaimId },
            function (rec) {
                emailExpenseForm.setValues({ Email: this.expenseData.CustomerEmail, CC: rec.CC, BCC: rec.BCC, Subject: rec.Subject, Body: rec.Body });
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
        var store = Ext.data.StoreManager.lookup('ExpenseTemplates');
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('ExpenseTemplates'));

        store.clearFilter();
        store.filter('templateType', RM.Consts.DocTemplates.EXPENSE);

        RM.AppMgr.loadStore(store,
            function () {
                this.getTemplateFld().setValue(this.expenseData.TemplateId);
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
        var vals = this.getEmailExpenseForm().getValues();
        vals.ExpenseClaimId = this.expenseData.ExpenseClaimId;
        vals.MsgType = this.msgType;

        if (this.validateForm(vals)) {
            RM.AppMgr.saveServerRec('ExpenseMessages', true, vals,
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
        this.getEmailExpense().setActiveItem(1);
    },

    showEmailFail: function (eventMsg) {
        this.getErrorCont().setHtml('Error sending email.<br/>' + eventMsg);
        this.getEmailExpense().setActiveItem(2);
    },

    onContinue: function () {
        //RM.ViewMgr.backTo('invoicedetail');
        this.goCb.call(this.goCbs);
    },

    onRetry: function () {
        this.getEmailExpense().setActiveItem(0);
    },

    onCancel: function () {
        //RM.ViewMgr.backTo('invoicedetail');
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