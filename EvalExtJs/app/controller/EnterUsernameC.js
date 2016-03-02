Ext.define('RM.controller.EnterUsernameC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.EnterUsername'],
    config: {
        refs: {
            enterUserName: 'enterusername',
            userName: 'enterusername textfield[name=UserName]',
            password: 'enterusername textfield[name=Password]',
            optionsBtn: 'enterusername #options'
        },
        control: {
            'enterusername': {
                show: 'onShow'
            },
            'enterusername #login': {
                tap: 'onLogin'
            },
            'password' : {
                keyup: 'onPasswordKeyUp'  
            },
            'enterusername #options': {
                tap: 'onOptions'
            }
        }

    },

    showView: function (cb, cbs) {
        this.pin = '';
        this.goCb = cb;
        this.goCbs = cbs;
        var view = this.getEnterUserName();
        if (!view)
            view = { xtype: 'enterusername' };
        RM.ViewMgr.showPanel(view);
        //<debug>
        localStorage.setItem('RmShowSettings', true);
        //</debug>
    },

    onShow: function () {
        this.getUserName().setValue(RM.AppMgr.getUserName());
        this.getPassword().setValue('');
        //RM.ViewMgr.clearBackStack();
        RM.AppMgr.logoutFromServer();
    },

    onOptions: function () {

        var menu = Ext.create('RM.component.DropdownOverlay');
        var menuItems = new Array();
        var options = [ /*{
            text: 'Signup for One',
            value: 'reckonone'
        },{
            text: 'Signup for Pay',
            value: 'reckonpay'
        },*/ {
            text: 'Forgotten password',
            value: 'forgotlogin'
        }, {
            text: 'Core settings',
            value: 'coresettings',
            hidden: !(localStorage.getItem('RmShowSettings')) && RM.AppMgr.runningOnDevice()
        }];
        if (options.length) {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                var btn = {
                    xtype: 'button',
                    itemId: option.value,
                    text: option.text,                    
                    ui: 'rm_btnaslistrowmainmenu',
                    hidden: option.hidden
                };
                menuItems.push(btn);
            }
        }

        menu.show(this.getOptionsBtn(), this.onDropdownMenuItemSelect, this, menuItems, 'tr-br');

    },

    onDropdownMenuItemSelect: function (optionId) {
        
        switch(optionId){
            case 'reckonone': case 'reckonpay':
                //RM.ViewMgr.showModuleSignup(optionId);
            
                window.open(RM.HomeSettingsMgr.getSetting('SignupUrl'), '_blank', 'location=no');
                break;
            
            case 'forgotlogin':
                RM.ViewMgr.showForgotPassword();
                break;
            
            case 'coresettings':
                RM.ViewMgr.showCoreSettings();
                break;
        }
     
    },     
    
    onPasswordKeyUp: function(field, e) {
        if (e.event.keyCode == 13) {
            this.onLogin();
        }
    },
    
    onLogin: function () {
        
        var activeElement = document.activeElement;    //RR - For Android devices, to hide keypad on login button tap.
        activeElement.blur();
        
        var userName = this.getUserName().getValue(), password = this.getPassword().getValue();

        if ((userName && userName != '') && (password  && password!='')) {
            
            // Awful hackery because we can't get a role for support power users
            if(userName === 'setmeup' && password === 'Mak3!t5o') {
                this.getUserName().setValue('');
                this.getPassword().setValue('');
                localStorage.setItem('RmShowSettings', true);
                RM.ViewMgr.showCoreSettings();                
            }
            else {
                RM.AppMgr.saveServerRec('Login', true, { ReqCode: 'LI', UserName: userName, Password: password },
                    function (recs, eventMsg) {
                        var rec = recs[0];
                        if(rec.StatusCode.toUpperCase() == 'LI'){
                            localStorage.setItem('RmUserName', userName);
                            localStorage.setItem('RmDisplayName', rec.DisplayName);
                            this.goCb.call(this.goCbs, rec);
                        }
                        else{
                            RM.AppMgr.showErrorMsgBox(eventMsg);
                        }
                    },
                    this,
                    function(recs, eventMsg){
                        RM.AppMgr.showOkMsgBox(eventMsg);
                    },
                    'Logging in...'
                );            
            }
        }
        else {
            RM.AppMgr.showErrorMsgBox('Please enter your username and password');
        }

    }

});
