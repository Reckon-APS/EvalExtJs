Ext.define('RM.controller.EnterPinC', {
	extend: 'Ext.app.Controller',

	requires: ['RM.view.EnterPin', 'RM.component.PinOptions'],
	config: {
		refs: {
			enterPin: 'enterpin',
			msg: 'enterpin #msg',
			optionsBtn: 'enterpin #options',
			pinKeypad: 'enterpin pinkeypad'
		},
		control: {
			'enterpin': {
				show: 'onShow'
			},
			'enterpin #options': {
				tap: 'onOptions'
			},
			'enterpin pinkeypad': {
				pinentered: 'onPinEntered'
			}
		}

	},

	showView: function (userName, displayName, cb, cbs, cbFail) {

        RM.ViewMgr.hideKeyPad();
        
        this.incorrectPinCount = 0;
		this.userName = userName;
		this.displayName = displayName;
		this.pin = '';
		this.goCb = cb;
		this.goCbs = cbs;
        this.goCbFail = cbFail;
		var view = this.getEnterPin();
		if (view) {
			this.onShow();
		}
		else {
			view = { xtype: 'enterpin' };
		}

        if(RM.ViewMgr.getActiveView() !== view) {
           RM.ViewMgr.showPanel(view);
        }
	},

	onShow: function () {
		this.getMsg().setHtml('Signed in as ' + this.displayName);
        this.getMsg().setCls('rm-intromsg');
		this.getPinKeypad().clearPin();
        //RM.ViewMgr.clearBackStack();
        RM.AppMgr.logoutFromServer();
	},

	onPinEntered: function (pin) {
		RM.AppMgr.saveServerRec('Login', true, { ReqCode: 'LI', UserName: this.userName, MobilePin: pin, CashbookId: RM.CashbookMgr.getCashbookId() },
			function (recs) {
                var rec = recs[0];
				if (rec.StatusCode.toUpperCase() == 'LI') {
					this.afterLogin(rec);
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

    afterLogin: function(rec){
         if (RM.CashbookMgr.getCashbookId()){
             RM.CashbookMgr.loadLastCashbook( 
                 function() { 
                     this.goCb.call(this.goCbs, rec);
                 },
                 this,
                 function(recs, eventMsg){
                     this.getPinKeypad().clearPin();
                     RM.CashbookMgr.unloadCashbook(); //give user a chance to choose another cashbook in case repeated problem of reloading current cashbook - e.g. maybe permission changed
                     RM.AppMgr.showErrorMsgBox(eventMsg);
                 },
                 function(){
                     this.getPinKeypad().clearPin();
                 }
             );             
             
         }
        else{
            this.goCb.call(this.goCbs, rec);
        }        
    },
    
    
	onOptions: function () {
		var menu = Ext.create('RM.component.DropdownOverlay');
		var menuItems = new Array();
		var options = [
			{
				text: 'Other user',
				value: 'otheruser'
			}, {
				text: 'Forgotten PIN',
				value: 'forgotpin'
			}
		];
		if (options.length) {
			for (var i = 0; i < options.length; i++) {
				var option = options[i];
				//if (this.getText() == option.text) continue;
				var btn = {
					xtype: 'button',
					itemId: option.value,
					text: option.text,					
					ui: 'rm_btnaslistrowmainmenu'
				};
				menuItems.push(btn);
			}
		}

		menu.show(this.getOptionsBtn(),this.onDropdownMenuItemSelect, this, menuItems, 'tr-br');
		//menu.show(this.getOptionsBtn().getParent(), this.onDropdownMenuItemSelect, this, menuItems, 'tr-br');
	},

	onDropdownMenuItemSelect: function (optionId) {
		if (optionId == 'otheruser') {
			RM.AppMgr.logout();
		}
		else if (optionId == 'forgotpin') {
			localStorage.removeItem('RmHasMobilePin');
			RM.AppMgr.logout();
		}
	}

});