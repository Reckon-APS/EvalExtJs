Ext.define('RM.core.PayMgr', {
    alternateClassName: 'RM.PayMgr',
    singleton: true,
    requires: ['RM.core.ViewMgr','RM.core.PermissionsMgr'],  
    
    config: {
        loadPayOnAppResume: null     //to check and load Pay screen when screen gets locked and resuming app 
    },

    init: function (application) {
        
    },
    
    showScreen: function (screenName, screenData, callBack, callBackScope) {   
        RM.AppMgr.showScreen.apply(this, arguments); 
    },
    
    postPreferences: function(preferences, callBack, callBackScope)
    {
        RM.AppMgr.saveServerRec('PayTransactionPreferences', true, preferences,
		    function () {       
		        callBack.call(callBackScope);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    getPreferences: function(callBack, callBackScope){
        RM.AppMgr.getServerRecs('PayTransactionPreferences', [],
		    function (data) {    
                callBack.call(callBackScope,data);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    createTransaction: function(transaction, callBack, callBackScope)
    {
        RM.AppMgr.saveServerRec('PayTransaction', true, transaction,
		    function () {       
                RM.AppMgr.itemUpdated('invoice');
		        callBack.call(callBackScope);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    getTransaction: function(transactionId, callBack, callBackScope){
        RM.AppMgr.getServerRec('PayTransaction', transactionId,
		    function () {                    
		        callBack.call(callBackScope);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    getTransactions: function(callBack, callBackScope){
        RM.AppMgr.getServerRecs('PayTransaction', [],
		    function () {                    
		        callBack.call(callBackScope);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    sendReceipt: function(receipt, callBack, callBackScope){
        RM.AppMgr.saveServerRec('PayTransactionReceipt', true, receipt,
		    function () {                    
		        callBack.call(callBackScope);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    createRefund: function(refundTransaction, callBack, callBackScope){
        RM.AppMgr.saveServerRec('PayTransaction', true, refundTransaction,
		    function () {                    
		        callBack.call(callBackScope);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    createTransactionHistory: function(transactionHistory, callBack, callBackScope){
        RM.AppMgr.saveServerRec('PayTransactionHistory', true, transactionHistory,
		    function () {                    
		        callBack.call(callBackScope);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    showPinAuthentication: function(userName, displayName, cb, cbs, cbFail){
		var pinAuthenticationC = RM.AppMgr.getAppControllerInstance('RM.controller.PinAuthenticationC');
		pinAuthenticationC.showView(userName, displayName, cb, cbs, cbFail);		
	},
    
    readTransactionHistory: function(transactionHistoryId, callBack, callBackScope){
        RM.AppMgr.getServerRec('PayTransactionHistory', true, transactionHistoryId,
		    function () {                    
		        callBack.call(callBackScope);
		    },
		    this,
            function(recs, eventMsg){
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
	    );
    },
    
    showChooseDiscountPopup: function (val, cb, cbs, title) {
        var discPopup = Ext.create('RM.component.ChooseInvoiceDiscount');
        discPopup.show(
            val,
			function (disc) {
			    if (disc == 'custom')
			        this.showCustomDiscount(val, cb, cbs, title);
			    else
			        cb.call(cbs, disc);
			},
			this,
        	title
		);
    },
    
    showCustomDiscount: function (val, cb, cbs, title) {
        var custDisc = RM.AppMgr.getAppControllerInstance('RM.controller.CustomDiscountC');
        custDisc.showView(val, cb, cbs, title);
    }
});