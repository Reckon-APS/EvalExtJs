Ext.define('RM.core.ViewMgr', {
    alternateClassName: 'RM.ViewMgr',
    singleton: true, 
	requires: ['RM.view.Main', 'RM.view.MainNavContainer', 'RM.view.Modules', 'RM.component.RMMsgPopup', 'RM.util.Device'],
    defaultBackAnimation : { type: 'slide', direction: 'right'},
	
    init: function (application) {
		this.app = application;
		this.appBackStack = new Array();
		this.mainView = Ext.create('RM.view.Main');
		this.mainNavContainer = Ext.create('RM.view.MainNavContainer');
        this.setUpNavigationListeners();
	},
	
	back: function(anim){
        //To hide keypad while navigating back in Android
        this.hideKeyPad();
        RM.AppMgr.clearLoadingTimer();
               
		if(this.appBackStack.length <= 1 && RM.AppMgr.isLoggedIn() && this.dashboardShown){
            this.appBackStack.pop();
            this.showDashboard(anim);
			return;
		}
        
		var view = this.appBackStack.pop();
        
		anim = anim || this.defaultBackAnimation;   
        // Clean up the popped view after animation completes        
        view.onAfter('erased', function() {
            if(this.xtype !== 'slidenavigationview'){
                this.destroy();
            } 
        });        
        
        this.showPanel2(this.appBackStack[this.appBackStack.length - 1], anim);		
	},

    backTo: function(backToXtype, anim){
		//To hide keypad while navigating back in Android
		this.hideKeyPad();

        anim = anim || this.defaultBackAnimation;          
        
        // Keep track of all of the views removed, and make sure that they're all destroyed in order after 
        // the currently visible one animates out        
        var topView = this.appBackStack.pop();
        var poppedViews = [ topView ]; 
        topView.onAfter('erased', function() {
                    poppedViews.forEach(function(item) {
                        item.destroy();
                    });
                });  
        
        // Walk down the view stack, removing each view until we find the one requested
        while(this.appBackStack.length > 0) {        
            var view = this.appBackStack.pop();                        
            // if this is the requested view, then show it and break out
            if(view.getXTypes().split('/').pop() === backToXtype){
                this.showPanel(view, anim);
                break;
            }
            // otherwise just add it to the list to be removed
            poppedViews.push(view);                                   
        }         

    },

    appPause: function(){
        document.activeElement.blur();  // Fix for above issue in iOS
        if(this.backHandler){
           this.backHandler.call(this.backHandlerScope);
        }                
    },    
    
    onDeviceBack: function(){
        
        this.showBackStack('onDeviceBack');
        
        if(this.backHandler){
           this.backHandler.call(this.backHandlerScope);
        }
        else if(this.formBackHandler){
           this.formBackHandler.call(this.formBackHandlerScope);
        }        
        else if(!this.mainNavContainer.isClosed()){
          this.mainNavContainer.closeContainer();
        }
        else if(this.mainNavContainer.isItemSelected('Cashbooks')){
            this.confirmExitApp();
        }
        else if(this.appBackStack.length <= 1 && RM.AppMgr.isLoggedIn() && this.dashboardShown && !this.isDashboardShowing()){            
            this.showPanel2(this.mainNavContainer, { type: 'slide', direction: 'right'});
            this.mainNavContainer.setSelectedItem('Dashboard');
        }
        else if (this.appBackStack.length <= 1 || (this.getActiveView() && this.getActiveView().xtype == 'enterpin')) {
            this.confirmExitApp();
        }
        else {
          this.back();
        }
       
    },
    
    confirmExitApp: function(){
        if(!this.confirmExitMsgShowing){
            this.confirmExitMsgShowing = true;
            RM.AppMgr.showYesNoMsgBox("Are you sure you want to exit?",
              function(btn){
                  this.confirmExitMsgShowing = false;
                  if(btn == 'yes'){
                      navigator.app.exitApp();
                  }                  
              },
              this
            );            
        }
    },

    regBackHandler: function(handler, scope){
        this.backHandler = handler;
        this.backHandlerScope = scope;
    },

    deRegBackHandler: function(){
        this.backHandler = null;
        this.backHandlerScope = null;
    },
    
    //form back handler was added to handle case when device back is tapped when on a form allowing that form to have a back method called so it can check with user in case form data needs to be saved
    //however there really needs to be a back handler stack as select fields or popup selectors (in case of invoice details) will need to reg a back handler as well - at the momen they call regBackHandler
    regFormBackHandler: function(handler, scope){
        this.formBackHandler = handler;
        this.formBackHandlerScope = scope;        
    },

    deRegFormBackHandler: function(handler){
        if(handler == this.formBackHandler){
            this.formBackHandler = null;
            this.formBackHandlerScope = null;
        }  
    },        
    
    showCoreSettings: function(){
		var coreSettingsC = RM.AppMgr.getAppControllerInstance('RM.controller.CoreSettingsC');
		coreSettingsC.showView();	        
    },
    
    showModules: function(cb, cbs){
		var modulesC = RM.AppMgr.getAppControllerInstance('RM.controller.ModulesC');
		modulesC.showView(cb, cbs);     
    },
    
    showModuleSignup: function(moduleId){
		var moduleSignupC = RM.AppMgr.getAppControllerInstance('RM.controller.ModuleSignupC');
		moduleSignupC.showView(moduleId);            
    },

    showMyPreferences: function(){
		var myPrefC = RM.AppMgr.getAppControllerInstance('RM.controller.MyPreferencesC');
		myPrefC.showView();        
    },
    
    showDashboard: function(anim){
        this.dashboardShown = true;
        this.mainNavContainer.setSelectedItem('Dashboard');
        this.showPanel(this.mainNavContainer, anim);
    },
    
    showPayWithSlideNav: function(anim){
        this.mainNavContainer.reloadItems("reckonpay");
        this.mainNavContainer.list.getComponent(0).setTitle('<div class="rm-slidenav-menu-title">Reckon Pay</div> <div class="rm-slidenav-menu-subtitle"></div>');   
        this.mainNavContainer.setSelectedItem('PayAmountInput');
        
        RM.AppMgr.getAppControllerInstance('RM.controller.PayAmountInputNavC').showView();
        this.showPanel(this.mainNavContainer, anim);
        RM.PayMgr.setLoadPayOnAppResume(true);			//to load Pay screen when screen gets locked and resuming app 
    },
    
    showPayFromOne: function(anim, data, cb, cbs){        
        RM.AppMgr.getAppControllerInstance('RM.controller.PayAmountInputBackC').showView(data, cb, cbs);
        RM.PayMgr.setLoadPayOnAppResume(true);			//to load Pay screen when screen gets locked and resuming app 
    },
    
    isDashboardShowing: function(){
        return this.mainNavContainer.isItemSelected('Dashboard');
    },
    
    showBills: function(anim){
        this.mainNavContainer.setSelectedItem('Bills');
        this.showPanel(this.mainNavContainer, anim);
    },

	showInvoices: function(anim){
		this.mainNavContainer.setSelectedItem('Invoices');
        this.showPanel2(this.mainNavContainer, anim);
	},

	showTimeSheets: function(anim){
		this.mainNavContainer.setSelectedItem('Timesheets');
        this.showPanel(this.mainNavContainer, anim);
	},
	
	showExpenses: function(anim){
		this.mainNavContainer.setSelectedItem('Expenses');
        this.showPanel(this.mainNavContainer, anim);
	},    
    
    closeMainNav: function(){
        this.mainNavContainer.closeContainer();
    },

	showPanel: function (panel, anim) {
		 //To hide keypad just before pushing view on stack
        this.hideKeyPad();
        var p = this.mainView.add(panel);
		this.appBackStack.push(p);
		//this.showBackStack('showPanel');
        if (!anim)
            anim = { type: 'slide', direction: 'left' };
        this.mainView.getLayout().setAnimation(RM.Device.supportsAnimations() ? anim : null);
        this.mainView.setActiveItem(p);
    },
	
	showPanel2: function(panel, anim){
        //To hide keypad just before pushing view on stack
        this.hideKeyPad();
        var p = this.mainView.add(panel);
		//this.appBackStack.push(p);
		//this.showBackStack('showPanel');
        if (!anim)
            anim = { type: 'slide', direction: 'left' };
        this.mainView.getLayout().setAnimation(RM.Device.supportsAnimations() ? anim : null);
        this.mainView.setActiveItem(p);		
	},
	
    clearBackStack: function(){
        this.appBackStack = new Array();        
    },
    
	showBackStack: function(msg){

        console.log(msg);
        console.log('stack length = ' + this.appBackStack.length);
		for(var i = 0; i < this.appBackStack.length; i++){
			console.log('  ' + this.appBackStack[i].getXTypes().split('/').pop());
		}
	},
	
	showLoadingMask: function(msg){
         //To hide keypad 
        this.hideKeyPad();
		//Ext.Viewport.setMasked({ xtype: 'loadmask', message: msg ? msg : 'Loading...'});	
        this.mainView.setMasked({ xtype: 'loadmask', message: msg ? msg : 'Loading...'});
	},
    
    showMask: function(){        
        this.mainView.setMasked({ xtype: 'mask'});
    },
	
	hideLoadingMask: function(){
		//Ext.Viewport.setMasked(false);
        this.mainView.setMasked(false);        
        this.invalidateWebView();
	},
	
	showLogin: function(cb, cbs){
		//this.showPanel2({xtype:'login'});
		var loginC = RM.AppMgr.getAppControllerInstance('RM.controller.LoginC');
		loginC.showView(cb, cbs);		
	},
	
	showCreatePin: function(cb, cbs){
		var createPinC = RM.AppMgr.getAppControllerInstance('RM.controller.CreatePinC');
		createPinC.showView(cb, cbs);		
	},		
	
	showEnterPin: function(userName, displayName, cb, cbs, cbFail){
		var enterPinC = RM.AppMgr.getAppControllerInstance('RM.controller.EnterPinC');
		enterPinC.showView(userName, displayName, cb, cbs, cbFail);		
	},
    
	showForgotPassword: function(){
		var forgotPassC = RM.AppMgr.getAppControllerInstance('RM.controller.ForgotPasswordC');
		forgotPassC.showView();		
	},
	
	showEnterUsername: function(cb, cbs){
		var enterUsername = RM.AppMgr.getAppControllerInstance('RM.controller.EnterUsernameC');
		enterUsername.showView(cb, cbs);		
	},	
    
	showMainNavContainer: function(title, subtitle, anim){
        this.mainNavContainer.reloadItems("reckonone");
        this.mainNavContainer.list.getComponent(0).setTitle('<div class="rm-slidenav-menu-title">' + title + '</div> <div class="rm-slidenav-menu-subtitle">' + subtitle + '</div>');        
		RM.ViewMgr.showPanel(this.mainNavContainer, anim);
        this.clearBackStack();
	},    
	
    showEmailReminder: function(){
        return false;
    },
    
    hideKeyPad: function() {
        document.activeElement.blur();
        try {
            if(cordova) cordova.plugins.SoftKeyboard.hide();
        } catch(e) { }
    },
    
    showKeyPad: function() {
        try {
            if(cordova) cordova.plugins.SoftKeyboard.show();
        } catch(e) { }
    },
    
    ifKeypadVisible: function(thenCb, elseCb) {
        var safeThen = thenCb || function() {};
        var safeElse = elseCb || function() {};
        try {
            cordova.plugins.SoftKeyboard.isShowing(
                function(result) {
                    if (result) safeThen();
                    else safeElse();
                }, 
                safeElse
                );        
        }
        catch (e) { 
            safeElse();
        }        
    },
    
    setPostAnimationCallback: function(anim, callback) {
        if(!anim.listeners) { anim.listeners = {}; }
        anim.listeners.animationend = callback;
    },
    
    setUpNavigationListeners: function() {
        this.mainNavContainer.addListener('itemselected', 
                                          function(item) { 
                                              this.navigationHandler(item, this.activeView); 
                                          }, 
                                          this
        );
        
        this.mainView.addListener('activeitemchange', 
                                  function (container, newView, oldView) {                                      
                                      this.navigationHandler(newView, oldView);
                                  },
                                  this
        );
    },
    
    getActiveView: function() {
        return this.activeView;
    },
    
	navigationHandler: function(newView, oldView) {
        newView = this.viewOrActiveSlideNavChild(newView); 
        //to stop app from firing 'rm-activeviewchanged' twice
        if(this.activeView === newView){
            return;
        }
        oldView = this.viewOrActiveSlideNavChild(oldView);
        this.activeView = newView;
        this.app.fireEvent('rm-activeviewchanged', newView, oldView);        
    },
    
    viewOrActiveSlideNavChild: function(view) {
        if (view.xtype === 'slidenavigationview' || (view.superclass && view.superclass.xtype === 'slidenavigationview')) {
            return this.mainNavContainer.getActiveItem().raw;
        }
        else {
            return view;
        }
    },
    
    invalidateWebView: function() {
        if(Ext.os.is.Android && cordova) {
            try {
                cordova.plugins.Redraw.invalidateWebView();
            } 
            catch(e) { }
        }
    },
    
    blockUI: function() {
        Ext.Viewport.mask({transparent:true});
    },
    
    unblockUI: function() {
        Ext.Viewport.unmask();
    },
    
    blockUIFor: function(timeoutMs) {
        var me = this;
        me.blockUI();
        setTimeout(function() {
            me.unblockUI();
        }, timeoutMs);
    }
});
