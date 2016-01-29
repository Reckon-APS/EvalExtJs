Ext.define('RM.core.BillsMgr', {
    alternateClassName: 'RM.BillsMgr',
    singleton: true,

    requires: ['RM.view.BillDetail', 'RM.view.History', 'RM.component.ChooseInvoiceDiscount', 'RM.view.CreateItem'],

    init: function (application) {

    },

    getInitialBillStatus: function () {
        if (RM.CashbookMgr.getBillPreferences().ApprovalProcessEnabled) {
            return RM.Consts.BillStatus.DRAFT;
        }
        else {
            return RM.Consts.BillStatus.APPROVED;
        }
    },

    getPartiallyPaidBillStatusText: function () {
        return 'PART-PAID';
    },

    getBillStatusText: function (status) {

        switch (status) {
            case RM.Consts.BillStatus.DRAFT:
                return 'DRAFT';
            case RM.Consts.BillStatus.APPROVED:
                return RM.CashbookMgr.getBillPreferences().ApprovalProcessEnabled ? 'APPROVED' : 'UNPAID';
            case RM.Consts.BillStatus.PAID:
                return 'PAID';
        }

        return 'UNKNOWN';
    },

    isBillStatusApprovable: function (status) {
        return (status == RM.Consts.BillStatus.DRAFT);
    },

    isBillStatusPayable: function (status) {
        return (status == RM.Consts.BillStatus.APPROVED) || (status == RM.Consts.BillStatus.PARTIALLY_PAID);
    },

    isBillStatusEditable: function (status) {
        return (status == this.getInitialBillStatus());
    },

    isBillStatusEmailable: function (status) {
        //return (status == RM.Consts.BillStatus.APPROVED) || (status == RM.Consts.BillStatus.PARTIALLY_PAID) || (status == RM.Consts.BillStatus.PAID);
        return true;
    },

    showBillDetail: function (isCreate, data, cb, cbs, callbackViewName) {
        var billDetailC = RM.AppMgr.getAppControllerInstance('RM.controller.BillDetailC');
        billDetailC.showView(isCreate, data, cb, cbs, callbackViewName);
    },

    showBillLineItem: function (editable, supplierId, options, detailsData, cb, cbs) {
        var billLineItem = RM.AppMgr.getAppControllerInstance('RM.controller.BillLineItemC');
        billLineItem.showView(editable, supplierId, options, detailsData, cb, cbs);
    },

    showActions: function (billId) {
        var actions = RM.AppMgr.getAppControllerInstance('RM.controller.BillActionsC');
        actions.showView(billId);
    },

    sendMsg: function (cb, cbs, billData, msgType) {
        var emailBill = RM.AppMgr.getAppControllerInstance('RM.controller.EmailBillC');
        emailBill.showView(cb, cbs, billData, msgType);
    },

    showSupplierBills: function (billsTitle, supplierId, supplierName, sortVal) {
        var supplierBillsC = RM.AppMgr.getAppControllerInstance('RM.controller.SupplierBillsC');
        supplierBillsC.showView(billsTitle, supplierId, supplierName, sortVal);
    },

    showBalanceBreakdown: function (data) {
        var balBreakdown = RM.AppMgr.getAppControllerInstance('RM.controller.BillBalanceBreakdownC');
        balBreakdown.showView(data);
    },

    showAcceptPayment: function (billData) {
        RM.AppMgr.getAppControllerInstance('RM.controller.AcceptPaymentC').showView(billData);
    }
});