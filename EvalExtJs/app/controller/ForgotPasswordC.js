Ext.define('RM.controller.ForgotPasswordC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.ForgotPassword'],
    config: {
        refs: {
            forgotPassword: 'forgotpassword',
            email: 'forgotpassword #email',
            userName: 'forgotpassword #username',
            successMsg: 'forgotpassword #successMsg',
            failMsg: 'forgotpassword #failMsg'
        },
        control: {
            'forgotpassword #back': {
                tap: 'back'
            },
            'forgotpassword #send': {
                tap: 'onSend'
            },
            'forgotpassword #continue': {
                tap: 'onContinue'
            },
            'forgotpassword #ok': {
                tap: 'onOk'
            }
        }

    },

    showView: function () {
        
        var view = this.getForgotPassword();
        if (view) {
            view.setActiveItem(0);
        }
        else {
            view = { xtype: 'forgotpassword' };
        }
        RM.ViewMgr.showPanel(view);
        this.getEmail().reset();
    },
    
    validateForm: function(){     
        var isValid = true;
        var emailAddress = this.getEmail().getValue();
        var userName = this.getUserName().getValue();
        
        //To reset label color
        this.getEmail().showValidation(true);
        this.getUserName().showValidation(true);
        
        if(emailAddress == '' && userName == ''){
            this.getEmail().showValidation(false);
            this.getUserName().showValidation(false);
            isValid = false;
            RM.AppMgr.showInvalidFormMsg();
            return isValid;
        }
        
        if(emailAddress == ''){
             this.getEmail().showValidation(false);
             isValid = false;
         }      
        
        if(userName == ''){
             this.getUserName().showValidation(false);
             isValid = false;
             RM.AppMgr.showInvalidFormMsg();
             return isValid;
         }   
        
         if(!RM.AppMgr.validateEmail(emailAddress)){             
             this.getEmail().showValidation(false);
             isValid = false;   
             RM.AppMgr.showInvalidEmailMsg();
             return isValid;
         }
         
        if(!isValid){            
            RM.AppMgr.showInvalidFormMsg();
        }
         
        return isValid;
    },

    onSend: function () {
        
        if(this.validateForm()){
            RM.AppMgr.saveServerRec('LoginMessages', true, { MsgType: 'resetpassword', UserName: this.getUserName().getValue(), Email: this.getEmail().getValue()},
            function (recs) {
                this.showSuccess();
            },
            this,
            function (recs, errMsg) {
                this.showFail(errMsg);
            },
            'Sending email'
        );   
        }
             
        
        /*
        Ext.Ajax.request({
            url: RM.AppMgr.getApiUrl('LoginMessages'),
            method: 'POST',
            jsonData: { MsgType: 'resetpassword', UserName: this.getEmail().getValue() },
            success: function (response) {
                Ext.Viewport.setMasked(false);
                var resp = Ext.decode(response.responseText);

                if (resp.success) {
                    this.showSuccess();
                }
                else {
                    this.showFail(resp.msg);
                }
            },
            scope: this
        });
        */


    },

    showSuccess: function () {
        this.getSuccessMsg().setHtml('An email has been sent to your inbox with your password reset details.');
        this.getForgotPassword().setActiveItem(1);
    },

    showFail: function (errorMsg) {
        this.getFailMsg().setHtml(errorMsg);
        this.getForgotPassword().setActiveItem(2);
    },

    onContinue: function () {
        RM.ViewMgr.back();
    },

    onOk: function () {
        this.getForgotPassword().setActiveItem(0);
    },

    back: function () {
        RM.ViewMgr.back();
    }

});