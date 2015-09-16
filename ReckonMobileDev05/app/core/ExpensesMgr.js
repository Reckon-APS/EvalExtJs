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

	getExpenseLineItemStatusText: function(status){
	    switch (status) {
	        case RM.Consts.ExpenseLineItemStatus.UNBILLABLE:
	            return 'Unbillable';
	        case RM.Consts.ExpenseLineItemStatus.BILLABLE:
	            return 'Billable';
	        case RM.Consts.ExpenseLineItemStatus.INVOICED:
	            return 'Invoiced';
	        case RM.Consts.ExpenseLineItemStatus.BILLED:
	            return 'Billed';
	    }
	    return 'Unallocated';
	},

	getInitialExpenseStatus: function () {
	    if (RM.CashbookMgr.getPurchasePreferences().ApprovalProcessEnabled) {
	        return RM.Consts.ExpenseStatus.DRAFT;
	    }
	    else {
	        return RM.Consts.ExpenseStatus.APPROVED;
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