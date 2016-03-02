Ext.define('RM.controller.CreatePinC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.CreatePin'],
    config: {
        refs: {
            createPin: 'createpin',
            title: 'createpin #title',
            msg: 'createpin #msg',
            pinKeypad: 'createpin pinkeypad'
        },
        control: {
            'createpin': {
                show: 'onShow',
                hide: 'onHide'
            },
            'createpin pinkeypad': {
                pinentered: 'onPinEntered'
            },
            'createpin #back': {
                tap: 'onBack'
            }
        }

    },

    showView: function (cb, cbs) {
        this.goCb = cb;
        this.goCbs = cbs;
        var view = this.getCreatePin();
        if (!view)
            view = { xtype: 'createpin' };
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        RM.ViewMgr.regBackHandler(this.onBack, this);
        this.gotoStep1();
    },

    onHide: function () {
        RM.ViewMgr.deRegBackHandler();
    },

    onPinEntered: function (pin) {
        if (this.pinStep == 1) {
            this.pinStep = 2;
            this.pin = pin;
            this.getPinKeypad().clearPin();
            this.getTitle().setHtml('Confirm PIN');
            this.getMsg().setHtml('Please confirm your PIN');
        }
        else if (pin == this.pin) {
            RM.AppMgr.saveServerRec('MobilePin', true, { MobilePin: pin },
			    function () {
			        localStorage.setItem('RmHasMobilePin', true);
			        this.goCb.call(this.goCbs);
			    },
			    this,
                function(recs, eventMsg){
                    RM.AppMgr.showOkMsgBox(eventMsg);
                },
                'Setting pin...',
                function(){ //callback if network error
                    this.getPinKeypad().clearPin();                
                }
		    );
        }
        else {
            this.getPinKeypad().clearPin();
            this.getTitle().setHtml('Re-enter PIN');
            this.getMsg().setHtml('PIN numbers did not match, please retry');
            this.getMsg().setCls('rm-errormsg');
            this.pinStep = 1
        }
    },

    gotoStep1: function () {
        this.pinStep = 1;
        this.getPinKeypad().clearPin();
        this.getTitle().setHtml('Create a PIN');
        this.getMsg().setCls('rm-intromsg');
        this.getMsg().setHtml('Please assign a 4 digit PIN for security');
    },

    onBack: function () {
        
        if (this.pinStep == 1) {
            RM.ViewMgr.back();
        }
        else {
            this.gotoStep1();
        }
        
    }

});