Ext.define('RM.controller.PinAuthenticationC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.PinAuthentication'],
    config: {
        refs: {
            pinAuthentication: 'pinauthentication',
            title: 'pinauthentication #title',
            msg: 'pinauthentication #msg',
            pinKeypad: 'pinauthentication pinkeypad'
        },
        control: {
            'pinauthentication': {
                show: 'onShow',
                hide: 'onHide'
            },
            'pinauthentication pinkeypad': {
                pinentered: 'onPinEntered'
            },
            'pinauthentication #back': {
                tap: 'onBack'
            }
        }

    },

    showView: function (userName, displayName, cb, cbs, cbFail) {
        this.incorrectPinCount = 0;
        this.userName = userName;
        this.displayName = displayName;
        this.goCb = cb;
        this.goCbs = cbs;
        this.goCbFail = cbFail;
        var view = this.getPinAuthentication();
        if (!view)
            view = { xtype: 'pinauthentication' };
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
        RM.AppMgr.saveServerRec('Login', true, { ReqCode: 'LI', UserName: this.userName, MobilePin: pin, CashbookId: RM.CashbookMgr.getCashbookId() },
			function (recs) {
                var rec = recs[0];
				if (rec.StatusCode.toUpperCase() === 'LI') {
					this.goCb.call(this.goCbs);
				}
				else {
                    this.incorrectPinCount++;
					RM.AppMgr.showErrorMsgBox('The PIN you entered is incorrect for ' + this.displayName + '.', function () {
                        if(this.incorrectPinCount >= 3){
                            this.goCbFail.call(this.goCbs);
                        }
                        else{
                            this.getPinKeypad().clearPin();                      
                        }						
					}, this);
				}
			},
			this,
            function(recs, eventMsg){
                this.getPinKeypad().clearPin();
                RM.AppMgr.showOkMsgBox(eventMsg);
            },
            'Logging in...',
            function(){ //callback if network error
                this.getPinKeypad().clearPin();                
            }
		);   
    },

    gotoStep1: function () {
        this.pinStep = 1;
        this.getPinKeypad().clearPin();
        this.getTitle().setHtml('Vendor PIN');
        this.getMsg().setCls('rm-intromsg');
        this.getMsg().setHtml('Enter PIN to confirm signature');
    },

    onBack: function () {
        
        if (this.pinStep === 1) {
            RM.ViewMgr.back();
        }
        else {
            this.gotoStep1();
        }
        
    }

});