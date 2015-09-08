Ext.define('RM.core.ExpensesMgr', {
    alternateClassName: 'RM.ExpensesMgr',
    singleton: true,	
	requires: ['RM.view.ExpenseDetail'],

    init: function (application) {

    },
	
	showExpenseDetail: function(data, cb, cbs){
		var expenseDetailC = RM.AppMgr.getAppControllerInstance('RM.controller.ExpenseDetailC');
		expenseDetailC.showView(data, cb, cbs);
	},

	getExpenseStatusText: function (status) {
        if (status === RM.Consts.ExpenseStatus.PAID) {
	        return 'Paid';
	    }
	    else {
	        return 'Unpaid';
	    }
	},

	showExpenseLineItem: function (editable, customerId, isCreate, detailsData, cb, cbs) {
	    var invLineItem = RM.AppMgr.getAppControllerInstance('RM.controller.ExpenseLineItemC');
	    invLineItem.showView(editable, customerId, isCreate, detailsData, cb, cbs);
	},

	isStatusEditable: function (status) {
	    if (status === RM.Consts.ExpenseStatus.PAID) {
	        return false;
	    }
	    else {
	        return true;
	    }
	}
	
});