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
            if (RM.CashbookMgr.getExpensePreferences().ApprovalProcessEnabled) {
                switch (status) {
                    case RM.Consts.ExpenseStatus.DRAFT:
                        return 'Unpaid - Draft';
                    case RM.Consts.ExpenseStatus.APPROVED:
                        return 'Unpaid - Approved';
                }                
            }
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
	    if (RM.CashbookMgr.getExpensePreferences().ApprovalProcessEnabled) {
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
	    if (status === RM.Consts.ExpenseStatus.DRAFT) {
	        return true;
	    }
	    else {
	        return false;
	    }
	},

	showActions: function (expenseClaimId) {
	    var actions = RM.AppMgr.getAppControllerInstance('RM.controller.ExpenseActionsC');
	    actions.showView(expenseClaimId);
	},

	isExpenseStatusApprovable: function (status) {
	    return (status == RM.Consts.ExpenseStatus.DRAFT);
	},

	isExpenseStatusEmailable: function (status) {
	    //return (status == RM.Consts.ExpenseStatus.APPROVED) || (status == RM.Consts.ExpenseStatus.PAID);
	    return true;
	},

	sendMsg: function (cb, cbs, invoiceData, msgType) {
	    var emailExpense = RM.AppMgr.getAppControllerInstance('RM.controller.EmailExpenseC');
	    emailExpense.showView(cb, cbs, invoiceData, msgType);
	}
	
});