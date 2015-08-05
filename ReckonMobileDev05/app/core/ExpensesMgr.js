Ext.define('RM.core.ExpensesMgr', {
    alternateClassName: 'RM.ExpensesMgr',
    singleton: true,
	
	requires: ['RM.view.ExpenseDetail'],

    init: function (application) {
        RM.EventMgr.logEvent(1, 'startup', this.self.getName(), 'init', '1');
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
	}
	
});