Ext.define('RM.core.AppMgr', {

    singleton: true,  //or could create a globally shared instance the way that Ext.MessageBox does
    requires: ['RM.view.TestScreen', 'RM.core.PermissionsMgr', 'RM.core.EventMgr', 'RM.core.ViewMgr', 
    'RM.core.Selectors', 'RM.core.HomeSettingsMgr', 'RM.core.CashbookMgr', 'RM.core.ContactsMgr', 
    'RM.core.TimeSheetsMgr', 'RM.core.ExpensesMgr', 'RM.core.InvoicesMgr', 'RM.util.MathHelpers',
    'RM.core.SessionManager', 'RM.core.PayMgr'],

    init: function (application) {
        this.application = application;        
        this.isUserLoggedIn = false;
        
        //this.startUpTest();
        RM.EventMgr = RM.core.EventMgr;
        this.appTypeId = window.cordova ? RM.Consts.App.CORDOVA_CONTAINER : RM.Consts.App.WEB_CONTAINER;        
        RM.EventMgr.logEvent(RM.Consts.Events.OP, 1, 'am.i.1', 'Test', {MyVar:'My Data'});
        
        this.setupBaseApi();
        RM.SessionManager.init(application);                
        this.application.on( {'rm-sessionexpired': this.appPause, scope:this });
        
        RM.PermissionsMgr.init(application);         
        RM.ViewMgr.init(application);
        RM.Selectors.init(application);
        RM.ContactsMgr.init(application);        
        RM.TimeSheetsMgr.init(application);
        RM.ExpensesMgr.init(application);
        RM.InvoicesMgr.init(application);
        RM.PayMgr.init(application);
        
        this.addDeviceListeners();
        this.doPreflight();        
    },
    
    doPreflight: function() {        
        var self = this;
        
        // Set up a block covering the actual preflight execution logic
        var runPreflight = function(clientVersion) {
            // Make sure the custom headers are populated
            self.setHeaders(clientVersion);
            // Run the first service call
            RM.HomeSettingsMgr.load();
        }
        
        // If we're running inside cordova, use the plugin to get the current app version.
        // All plugin queries are async, that's why this is all so gnarly
        if(window.cordova && cordova.AppVersion) {
           cordova.AppVersion.getAppVersion(
           	// Success
               function (version) {
                   runPreflight(version);
               },
               // Failed
               function () {
                   runPreflight('?');
               }
           );
        }
        // Otherwise we're hosting in the web or simulator
        else {
            runPreflight('WEB');
        }        
    },
    
    setHeaders: function(clientVersion) {        
        Ext.Ajax.setDefaultHeaders({
            'X-APIV': RM.Consts.Api.VERSION,
            'X-CLIENTV': clientVersion
        }); 
    },
    
    runningOnDevice: function() {
        return this.appTypeId === RM.Consts.App.CORDOVA_CONTAINER;
    },
    
    addDeviceListeners: function(){
        
        if(this.appTypeId == RM.Consts.App.CORDOVA_CONTAINER){
            var me = this;
            
            document.addEventListener('pause', function(){me.appPause.call(me)}, false);
            document.addEventListener('resume',  function(){me.appResume.call(me)}, false);
        }
        
        if (Ext.os.is('Android')) {
            document.addEventListener('backbutton', function(e){ e.preventDefault(); RM.ViewMgr.onDeviceBack(); }, false); 
        }           
        
    },
    
    appPause: function(){
        RM.ViewMgr.appPause();
        this.lock();
    },
    
    appResume: function(){
        
    },
    
    isLoggedIn: function(){
        return this.isUserLoggedIn;
    },
    
    login: function () {
        
        var hasMobilePin = (localStorage.getItem('RmHasMobilePin') == 'true');

        if (hasMobilePin) {
            RM.ViewMgr.showEnterPin(
                localStorage.getItem('RmUserName'),
                localStorage.getItem('RmDisplayName'),
				function (loginDto) {
                    this.doAfterLogin(loginDto);
                    if (RM.CashbookMgr.getCashbookId()) {
                         RM.ViewMgr.back();
                    } 
                    else if(RM.PayMgr.getLoadPayOnAppResume()){
                        RM.ViewMgr.back();
                    }
                    else {
                        RM.CashbookMgr.selectCashBook();
                        //this.selectModule();       //Uncomment this line for select Module screen
                    }                                      
				},
				this,
                function(){
                    this.logout();
                }
			);
        }
        else {
            this.loginUserName();
        }
    },    
    
    selectModule: function(){
        RM.ViewMgr.showModules(
            function(moduleData){
                //alert(moduleData);
                if(moduleData.ModuleCode == 'reckonone'){    
                    RM.CashbookMgr.selectCashBook();                    
                }
                else
                {
                    //RM.PayMgr.showScreen("PayAmountInput");
                    RM.ViewMgr.showPayWithSlideNav();
                }
            },
            this
        
        );     
    },
    
    showScreen: function (screenName, screenData, callBack, callBackScope) {
        //alert('RM.controller.' + screenName + 'C');
        RM.AppMgr.getAppControllerInstance('RM.controller.' + screenName + 'C').showView(screenData, callBack, callBackScope);
    },    
    

    loginUserName: function () {
        RM.ViewMgr.showEnterUsername(
			function (loginDto) {
                this.doAfterLogin(loginDto);
			    RM.ViewMgr.showCreatePin(
                    function () {                           
                        RM.CashbookMgr.selectCashBook();
                        //this.selectModule();			//Uncomment this line for select Module screen
                    },
                    this
                );
			},
			this
		);
    },
    
    doAfterLogin: function(loginDto){
        this.userId = loginDto.UserId;
        this.isUserLoggedIn = true;
        RM.SessionManager.startSession(loginDto.SessionInfo);
        RM.EventMgr.setUserLogLevel(loginDto.LogLevel);
        
        if(loginDto.LoginAlert){
            var lastLoginAlertStr = localStorage.getItem('RmLastLoginAlert'), lastLoginAlert = null;
            if(lastLoginAlertStr){
                lastLoginAlert = Ext.decode(lastLoginAlertStr);                
            }
            
            if(!lastLoginAlert || (lastLoginAlert.AlertId != loginDto.LoginAlert.AlertId) || (loginDto.LoginAlert.RepeatInterval > 0 && Ext.Date.now() / 1000 - lastLoginAlert.LastShown > loginDto.LoginAlert.RepeatInterval)){
                this.showRMMsgPopup(loginDto.LoginAlert.Text, loginDto.LoginAlert.AlertType, [{text: 'OK', itemId: 'ok'}]);
                localStorage.setItem('RmLastLoginAlert',  Ext.encode({AlertId: loginDto.LoginAlert.AlertId, LastShown: Ext.Date.now() / 1000}));
            }
        }
    },

    lock: function(){
        this.logoutFromServer();
        this.login();
    },
    
    logout: function () {
        
        localStorage.removeItem('RmDisplayName');
        localStorage.removeItem('RmHasMobilePin');
        localStorage.removeItem('RmUserName');        
    
        RM.ViewMgr.clearBackStack();
        RM.CashbookMgr.unloadCashbook();
        this.logoutFromServer();
        this.login();
    },

    logoutFromServer: function(){
        if(this.isUserLoggedIn){
            Ext.Ajax.request({
                url: this.getApiUrl('Login'),
                method: 'Put',
                timeout: RM.Consts.Api.TIME_OUT,
                jsonData: { ReqCode: 'LO' }
            });        
            this.isUserLoggedIn = false;
        }
        RM.SessionManager.endSession();      
    },
    
    getUserName: function () {
        return localStorage.getItem('RmUserName');
    },

    getAppControllerInstance: function (name) {
        return this.application.getController(name);
    },
    
    getCashBookId: function(){
        return this.cashBookId;
    },

    getServerRecById: function (serverApiName, recId, cb, cbs, cbFail) {
        //apiUrl = this.getApiUrl(serverApiName) + '/' + recId;
        this.getServerRec(serverApiName + '/' + recId, {}, cb, cbs, cbFail);        
    },

    
    getServerRecs: function (serverApi, params, cb, cbs, cbFail, msg, cbNetFail) {
        var me = this;
        if(serverApi.substr(0,4) !== 'http') {
            // A named api has been supplied, resolve the url
            serverApi = me.getApiUrl(serverApi);
        }
          
        Ext.Ajax.request({
            url: serverApi,
            method: 'Get',
            params: params,
            timeout: RM.Consts.Api.TIME_OUT,
            success: function (response) {
                me.clearLoadingTimer();
                RM.ViewMgr.hideLoadingMask();
                var resp = Ext.decode(response.responseText);
                if (resp.success && cb){
                    cb.call(cbs, resp.recs);
                }
                else if (!resp.success && cbFail){
                    cbFail.call(cbs, resp.eventMsg);
                }                
            },
            failure: function(resp) {
                window.clearInterval(this.loadingTimer);
                RM.ViewMgr.hideLoadingMask();
                if(cbNetFail){
                    cbNetFail.call(cbs, resp);
                }                
                RM.AppMgr.handleServerCallFailure(resp);
            },
            scope: this
        }); 
        
        me.setLoadingTimer();        
    },
    
    getServerRec:  function (serverApi, params, cb, cbs, cbFail, msg, cbNetFail) {
        
        return this.getServerRecs(serverApi, params, 
            function(recs){ 
                if(cb){
                    cb.call(cbs, recs[0]);
                }
            }, 
            cbs, 
            cbFail,
            msg,
            cbNetFail
        );
        
    },
    
    
    saveServerRec: function (serverApiName, isCreate, dataDto, cb, cbs, cbFail, msg, cbNetFail) {

        this.clearLoadingTimer();
        
        RM.ViewMgr.showLoadingMask(msg ? msg : 'Saving...');
        Ext.Ajax.request({
            url: this.getApiUrl(serverApiName),
            method: isCreate ? 'Post' : 'Put',
            timeout: RM.Consts.Api.TIME_OUT,
            jsonData: dataDto,
            success: function (response) {
                RM.ViewMgr.hideLoadingMask();
                var resp = Ext.decode(response.responseText);
                if (resp.success && cb) {
                    cb.call(cbs, resp.recs, resp.eventMsg, resp.eventSubId, resp.eventTypeId);
                }
                else if (!resp.success && cbFail){
                    //alert('Error Saving ' + resp.msg);
                    cbFail.call(cbs, resp.recs, resp.eventMsg);
                }
                
            },
            failure: function (resp) {
                RM.ViewMgr.hideLoadingMask();
                if(cbNetFail  && resp.status != 401){ //put in initially for EnterPinC
                    cbNetFail.call(cbs, resp);
                }
                RM.AppMgr.handleServerCallFailure(resp);
            }
        });

    },
    
    deleteServerRec: function (serverApiName, cb, cbs, cbFail, msg, cbNetFail) {

        this.clearLoadingTimer();

        RM.ViewMgr.showLoadingMask(msg ? msg : 'Deleting...');
        Ext.Ajax.request({
            url: this.getApiUrl(serverApiName),
            method: 'Delete',
            timeout: RM.Consts.Api.TIME_OUT,
            success: function (response) {
                RM.ViewMgr.hideLoadingMask();
                var resp = Ext.decode(response.responseText);
                if (resp.success && cb) {
                    cb.call(cbs, resp.recs, resp.eventMsg, resp.eventSubId, resp.eventTypeId);
                }
                else if (!resp.success && cbFail) {
                    cbFail.call(cbs, resp.recs, resp.eventMsg);
                }

            },
            failure: function (resp) {
                RM.ViewMgr.hideLoadingMask();
                if (cbNetFail && resp.status != 401) {
                    cbNetFail.call(cbs, resp);
                }
                RM.AppMgr.handleServerCallFailure(resp);
            }
        });

    },

    setLoadingTimer: function(){
        this.clearLoadingTimer();
        RM.ViewMgr.showLoadingMask(); 
        return;
        
        this.loadingTimer = window.setInterval(
            function(){ 
                RM.ViewMgr.showLoadingMask();
            }
            ,3000);         
    },
    
    clearLoadingTimer: function(){
        if(this.loadingTimer){
            window.clearInterval(this.loadingTimer);
        }
    },
    
    loadStore: function(store, cb, cbs, cbFail, msg, cbNetFail){
        var me = this;
        me.setLoadingTimer();

        var loadComplete = function(recs, operation, success) {
            me.clearLoadingTimer();
            RM.ViewMgr.hideLoadingMask();
            if(cb){
                cb.call(cbs, recs, operation, success);
            }
        };        
        
        store.loadPage(1, {
            callback: function (recs, operation, success) {
               if(success) { 
                   loadComplete(recs, operation, success); 
               }
               else if(cbNetFail){
                   cbNetFail.call(cbs);
               }
            },
            scope: me
        });
        
    },
    
    onDataProxyException: function (proxy, resp, operation, eOpts) {
        //is called from RmBaseStore        
        this.handleServerCallFailure(resp);
        if(this.loadingTimer){
            window.clearInterval(this.loadingTimer);    
        }        
        RM.ViewMgr.hideLoadingMask();
    },    
    
    handleServerCallFailure: function(resp){
        if((navigator.connection && navigator.connection.type === 'none') || resp.status == 0) {  //First condition works for iOS, but on Android seem to get a Http 0 when network is off
            this.showCommsError("It looks like your device has no internet connection, please connect and try again.");    
            return;
        }
        
        if(resp.status == 401){
            this.login();
        }        
        else if(resp.statusText === 'communication failure') {
            this.showCommsError("The connection failed, please try again. If the problem persists please contact support.");    
        }
        else if(resp.status == 412){
            var respErr = Ext.decode(resp.statusText);
            //this.showErrorMsgBox(respErr.ErrDesc);
            this.showAppStop(respErr);
        }
        else {
            var statusText = resp.statusText ? ' ' + resp.statusText : '';
            this.showErrorMsgBox('There was an error, please try again. If the problem persists please contact support.<br/><br/> (' + resp.status + statusText + ')');    
        }
    },
    
    showCommsError: function(msgText){
        
        if(!this.showingCommsError){ //prevent showing 2 comms errors at same time - e.g. if say a form load makes more than 1 call to server and they both timeout
            this.showingCommsError = true;
            this.showOkMsgBox(
                msgText,
                function(){
                    this.showingCommsError = false;
                },
                this
            );
        }           
    },    
    
    setupBaseApi: function(){
        var apiLocation = localStorage.getItem('RmApiLocation'), apiType = localStorage.getItem('RmApiType');
        if(!apiLocation && this.appTypeId !== RM.Consts.App.WEB_CONTAINER){
            apiLocation = 'production';            
        }        
        
        this.apiLocation = apiLocation;
        
        if(apiLocation == 'staging'){            
            this.baseApiUrl = 'http://mobile.reckoncloud.com.au/api';
        }
        else if(apiLocation == 'production'){
            this.baseApiUrl = 'https://mobile.reckonone.com/api';            
        }
        else if(apiLocation == 'preproduction'){
            this.baseApiUrl = 'https://preprodmobile.reckonone.com/api';            
        }            
        else if(apiLocation == 'devserver'){
            this.baseApiUrl = 'http://r1mobiledev.reckon.com.au/api';            
        }
        else if(apiLocation == 'qaserver'){
            this.baseApiUrl = 'http://r1mobileqa.reckon.com.au/api';            
        }
        else if(apiLocation == 'devlocaliis'){
            this.baseApiUrl = 'http://localhost:/Reckon.Host.ReckonOneMobile/api';
        }        
        else {
            this.baseApiUrl = '/api';
        }
        
        if(apiType == 'test'){
           this.apiType = 'test';
        }
        else{
            this.apiType = 'normal';
        }        
        
    },

    getApiUrl: function (apiName) {
        return this.baseApiUrl + '/' + apiName + (this.apiType == 'normal' ? '' : 'test'); 
    },
    
    getBaseApiUrl: function () {
        return this.baseApiUrl;        
    },
    
    setBaseApi: function(apiVals){
        localStorage.setItem('RmApiLocation', apiVals.ApiLocation);
        localStorage.setItem('RmApiType', apiVals.ApiType);
        this.setupBaseApi();
    },
    
    getBaseApi: function(){
        return {ApiLocation: this.apiLocation, ApiType: this.apiType};
    },

    getUserId: function(){
      return this.userId;
    },
    
    getAppInfo: function(){
        
        var appInfo = {RmDeviceId:'0', AppTypeId: this.appTypeId, AppVersion: RM.Consts.App.VERSION};
        if(this.appTypeId == RM.Consts.App.CORDOVA_CONTAINER){
            appInfo.DeviceName = device.name;
            appInfo.DevicePlatform = device.platform;
            appInfo.DevicePlatformVers = device.version;
            appInfo.DeviceUuid = device.uuid;
        }
        return appInfo;        
    },

    getTaxCode: function (taxCode) {
        var rec = Ext.data.StoreManager.lookup('GSTCodes').findRecord('GSTCodeId', taxCode);
        return rec ? rec.data : null;
    },

    itemUpdated: function (itemType) {
        this.application.fireEvent('itemupdated', itemType);
    },

    getModuleData: function(){
        return [
			{ModuleCode: 'reckonone', Activated: true, ShortName: 'ONE', FullName: 'Reckon One', Description: 'Our customised cloud accounting software.<br/>Designed by you to fit your needs', Image: 'reckonone'}
			//{ModuleCode: 'reckonpay', Activated: false, ShortName: 'PAY', FullName: 'Reckon Pay', Description: 'Accept credit card payments on the go.<br/>Only available to Australian customers.',  Image: 'reckonpay'}
		];    
    },    
    
    showInvalidFormMsg: function(){
        //Ext.Msg.alert('Save', 'Please complete all mandatory fields.<br/>These have now been selected in <span style="color:red;">red</span>.', Ext.emptyFn);
        this.showErrorMsgBox('Please complete all mandatory fields.<br/>These have now been selected in <span style="color:red;">red</span>.');
       
    },
    
    showInvalidEmailMsg: function(){
        this.showErrorMsgBox('Please enter a valid email address.');
    },
    
    showNoMultipleEmailMsg: function(){
        this.showErrorMsgBox('Only one email address can be entered');
    },
    
    showInvalidURLMsg: function() {
        this.showErrorMsgBox('Please enter a valid Url, with no spaces or quotes.');
    },
    
    isFormValsEqual: function(formVals1, formVals2){        
        return Ext.encode(formVals1) == Ext.encode(formVals2);
        //see http://www.sencha.com/forum/showthread.php?59240-Compare-javascript-objects
        //http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
    },
    
    
    showAppStop: function(errCode, errMsg){
        var appStopC = RM.AppMgr.getAppControllerInstance('RM.controller.AppStopC');
        appStopC.showView(errCode, errMsg);  
    },
    
    showRMProgressPopup: function(titleText, msgText, icon, btnArray, cb, cbs){
        
        var iconPath = 'resources/images/rm-loading-img.gif';
        
        if(icon && icon !=''){
            iconPath = 'resources/images/rm-msgbox-'+icon+'.svg';            
        }
        
        var msgBox = Ext.create('RM.component.RMMsgPopup');
        msgBox.add({
                    xtype: 'image',
                    src: iconPath,
                    height: 50,
                    width: 255,
                    margin: '25 0 5 0'               
                }
        );
        msgBox.add({                    
                    xtype: 'component',
                    html: titleText,                    
                    margin: '5 0 5 0'                                  
                }
        );
        msgBox.add({                    
                    xtype: 'component',
                    html: msgText,                    
                    margin: '7 0 15 0'                                  
                }
        );
        
        if (btnArray.length) {
            for(i = 0; i < btnArray.length; i++){
                
                msgBox.add({                    
                    xtype: 'button',
                    text: btnArray[i].text,
                    itemId: btnArray[i].itemId,
                    handler: function(btn){
    				    msgBox.hide();
                        if(cb && cbs){
                            cb.call(cbs, btn.getItemId());
                        }
                    },
                    scope: this                    
                });
            }            
        }
        msgBox.show();
        return msgBox;
    },
    
    showRMMsgPopup: function(msgText, icon, btnArray, cb, cbs, options){
        
        var msgBox = Ext.create('RM.component.RMMsgPopup');
        if(!Ext.isEmpty(icon)){
            msgBox.add({
                        xtype: 'image',
                        src:'resources/images/rm-msgbox-' + icon + '.svg',
                        height: 55,
                        width: 65,
                        margin: '25 0 12 0'               
                    }
            );
        }
        msgBox.add({                    
                    xtype: 'component',
                    html: msgText,
                    padding: '0 20',
                    margin: '18 0 20 0'                                  
                }
        );
        
        if(options) { 
            if(options.hideBackground) { msgBox.getModal().setCls('rm-mask-obscured'); }            
        }
        
        if (btnArray.length) {
            for(i = 0; i < btnArray.length; i++){
                
                msgBox.add({                    
                    xtype: 'button',
                    text: btnArray[i].text,
                    itemId: btnArray[i].itemId,
                    cls: btnArray[i].cls || 'x-button-grey',
                    handler: function(btn){
    				    msgBox.hide();
                        RM.ViewMgr.deRegBackHandler();
                        if(cb && cbs){
                            cb.call(cbs, btn.getItemId());
                        }
                    },
                    scope: this                    
                });
            }            
        }
        RM.ViewMgr.hideKeyPad();
        msgBox.show();
        RM.ViewMgr.regBackHandler(
            function(){
                msgBox.hide();
                RM.ViewMgr.deRegBackHandler();
            }, 
            this
        );
        
    },
    
    showSuccessMsgBox: function(msgText, cb, cbs){
        this.showRMMsgPopup(msgText,'success', [{text: 'OK', itemId: 'ok'}], cb, cbs);
    },
    
    showFailureMsgBox: function(msgText, cb, cbs){
        this.showRMMsgPopup(msgText, 'error', [{text: 'RETRY', itemId: 'retry', cls: 'x-button-green'}, {text: 'CANCEL', itemId: 'cancel'}], cb, cbs);
    },
    
    showErrorMsgBox: function(msgText, cb, cbs){ 
        this.showRMMsgPopup(msgText,'error',[{text: 'OK', itemId: 'Yes'}], cb, cbs);
    },    
    
    showErrorMsgBoxOpaque: function(msgText, cb, cbs){ 
        this.showRMMsgPopup(msgText,'error', [{text: 'OK', itemId: 'Yes'}], cb, cbs, { hideBackground:true }); 
    },  
    
    showOkMsgBox: function(msgText, cb, cbs){ 
        this.showRMMsgPopup(msgText,'warning',[{text: 'OK', itemId: 'Yes'}], cb, cbs);        
    },    
    
    showOkCancelMsgBox: function(msgText, cb, cbs){        
        this.showRMMsgPopup(msgText,'warning',[{text: 'OK', itemId: 'ok', cls: 'x-button-green'}, {text: 'Cancel', itemId: 'cancel'}], cb, cbs);       
    },
    
    showYesNoMsgBox: function(msgText, cb, cbs){        
        this.showRMMsgPopup(msgText,'warning',[{text: 'Yes', itemId: 'yes', cls: 'x-button-green'}, {text: 'No', itemId: 'no'}], cb, cbs);        
    },
    
    showUnsavedChangesMsgBox: function(cb, cbs){
        this.showYesNoMsgBox('Do you want to save your changes?', cb, cbs);
    },
    showCustomiseButtonMsgBox: function (msgText,yesText,noText, cb, cbs) {
        this.showRMMsgPopup(msgText, 'warning', [{ text: yesText, itemId: 'yes', cls: 'x-button-green' }, { text: noText, itemId: 'no' }], cb, cbs);
    },
    
    isSimulator: function(){
        return !Ext.isDefined(device.model);
    },
    
    hoursToTime: function (hours) {

        var secs = hours * 60 * 60;

        hours = Math.floor(secs / (60 * 60))

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        //var divisor_for_seconds = divisor_for_minutes % 60;
        //var seconds = Math.ceil(divisor_for_seconds);

        var time = '';
        if (hours > 0)
            time += hours + 'h ';
        if (minutes > 0)
            time += minutes + 'm'

        return time;
    },

    minsToTime: function(totalMins){
        
      var hours =   Math.floor(totalMins / 60), mins = (hours > 0) ? totalMins % 60 : totalMins, timeStr = '';
     
      if(hours > 0){
          timeStr = hours + 'h ';
      }

      if(mins > 0){
          timeStr += mins + 'm';          
      }
      
       return timeStr.trim();        
    },    
    
    numberPrecision: function (value) {
        if (Ext.isNumber(value)) {
            return value.toFixed(2);
        }
    },

    numberWithCommas: function (value, places) {        
        if (Ext.isNumber(value)) { 
            value = RM.util.MathHelpers.roundToEven(value, places); 
        }
        else {
            value = 0;
        }
        
        // Some hackery here. This regex doesn't handle a number without a decimal point, and I can't fathom it without a negative 
        // lookbehind which JS doesn't support. The workaround is to always have a decimal place in the string and remove afterwards 
        // if it's not required.
        var withCommas = value.toFixed(places || 1).replace(/\B(?=(\d{3})+\.)/g, ",");
        if(!places) withCommas = withCommas.replace('.0','');   
        
        return withCommas;
    },
    
    valueWithCommas: function(value){
        value = Math.round(value);
        return value.toString().replace(/\B(?=(\d{3})+\.)/g, ",");        
    },

    formatCurrency: function(value, places, accountancyFormat){        
        if (isNaN(value)){
            value = 0;
        }   
        
        if(!places && places !==0) { 
            places = 2; 
        }      
        
        var negSign = (value.toFixed(places) < 0);         
        var withCommas = this.numberWithCommas(Math.abs(value), places);    
        if(withCommas == 0){
            return '$' + withCommas;
        }        
        value = '$' + withCommas;        
        if(negSign && accountancyFormat){
            return '(' + value + ')';
        }        
        return (((negSign) ? '-' : '') + value);       
    },
    
    unformatCurrency: function(value) {
        return parseFloat(value.replace(/(\()?(-)?(\$)?(,)?(\))?/g, ''));
    },
    
    /*saveSettings: function (settings, cb, cbs) {
        
        RM.ViewMgr.showLoadingMask('Saving...');
        
        Ext.Ajax.request({
            url: this.getApiUrl('Settings'),
            method: 'PUT',
            jsonData: settings,
            success: function (response) {
                if (cb)
                    cb.call(cbs, Ext.decode(response.responseText).success);
            },
            failure: function (resp) {
                alert('Request Failed with Http Response ' + resp.status);
                RM.ViewMgr.hideLoadingMask();
            }
        });
    },*/    
    
    capitalizeString: function(str) {
        str = (str + '').toLowerCase();
        return str.replace(/\b([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });        
    },
    
    validateEmail: function(inputVal) {        
        var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
        if (pattern.test(inputVal)) {         
            return true;
        }        
        else {   
            return false; 
        }
    },
    
    validateURL: function(inputVal) {	
        return inputVal.indexOf('.') > -1 && inputVal.indexOf('"') === -1 && inputVal.indexOf(' ') == -1;
    },
    
    startUpTest: function(){
        //following line is required for testing screens below when not using login()
        Ext.data.StoreManager.lookup('GSTCodes').setData([{ GSTCodeId: "7654913f-9486-419c-9752-8c0c2ec91e85", GSTCode: "GST", ShortDescription: "GST on sales", Rate: 10 }, { GSTCodeId: "2d540317-a3a8-4382-be26-94528b6b67d0", GSTCode: "FRE", ShortDescription: "Other GST Free", Rate: 0.0 }, { GSTCodeId: "3cb9ee30-7325-4234-b20b-c2913af9edcd", GSTCode: "EXP", ShortDescription: "GST free exports", Rate: 0.0}]);
        Ext.data.StoreManager.lookup('AccountingCategories').setData([{AccountingCategoryId: '4BE5F10D-F9BA-41E2-AC52-CD575D5B2154', Name:'Contract Work'}, {AccountingCategoryId: '39FA1C88-FAAB-4D2F-AF15-D8916BB68AE4', Name:'Supplies'}]);
        
        Ext.create('RM.view.TestScreen', {xtype: 'testscreen', fullscreen:true});
        //Ext.Msg.alert('', 'No internet connection found', Ext.emptyFn); return;
       
        //RM.Selectors.showItems(true, null, true, function(){}, function(){});
        
        /*RM.ViewMgr.showCreatePin(
        function () {

        },
        this
        );*/

        /*RM.ViewMgr.showModules(
            function(moduleData){
                alert(moduleData.ModuleCode);
            },
            this
        );*/
        
        //RM.InvoicesMgr.showAcceptPayment('00000001-0000-0000-0000-000000000000', 467.67);
        //RM.TimeSheetsMgr.showTimeSheetDetail(null, function () { }, this);
        //RM.ViewMgr.showMainNavContainer();
        //RM.ViewMgr.showTimeSheets();
        //RM.ViewMgr.showExpenses();

        //RM.InvoicesMgr.showHistory('00000001-0000-0000-0000-000000000000');
        //RM.InvoicesMgr.emailInvoice('00000001-0000-0000-0000-000000000000');
         /*RM.InvoicesMgr.showInvoiceTimeSelect(
            function () {
    
    
            },
            this
        );*/
        /*RM.InvoicesMgr.showInvoiceDetail(
        { InvoiceId: '00000001-0000-0000-0000-000000000000' },
        function () {


        },
        this
        );*/
        
        /*RM.InvoicesMgr.showCustomDiscount(
        function(){
			
			
        },
        this		
        );*/

        //RM.ViewMgr.showMainNavContainer();
        /*RM.Selectors.showItems(
        true,
        null,
        false,
        function(){
			
			
        },
        this		
        );*/
        /*RM.Selectors.showItemDetail(
        {SaleTaxCodeId:'2D540317-A3A8-4382-BE26-94528B6B67D0'},
        function(closeType, itemData){
			
			
        },
        this
        );*/           
        
        
    }

});
