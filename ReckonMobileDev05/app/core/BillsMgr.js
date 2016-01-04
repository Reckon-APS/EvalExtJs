Ext.define('RM.core.BillsMgr', {
    alternateClassName: 'RM.BillsMgr',
    singleton: true,

    requires: ['RM.view.BillDetail', 'RM.view.History', 'RM.component.ChooseInvoiceItem', 'RM.component.ChooseInvoiceDiscount', 'RM.view.CreateItem', 'RM.view.InvoiceTimeSelectDetail'],

    init: function (application) {

    },

    getInitialBillStatus: function () {
        if (RM.CashbookMgr.getSalesPreferences().ApprovalProcessEnabled) {
            return RM.Consts.InvoiceStatus.DRAFT;
        }
        else {
            return RM.Consts.InvoiceStatus.APPROVED;
        }
    },

    getBillStatusText: function (status) {

        switch (status) {
            case RM.Consts.InvoiceStatus.DRAFT:
                return 'DRAFT';
            case RM.Consts.InvoiceStatus.APPROVED:
                return RM.CashbookMgr.getSalesPreferences().ApprovalProcessEnabled ? 'APPROVED' : 'UNPAID';
            case RM.Consts.InvoiceStatus.PAID:
                return 'PAID';
        }

        return 'UNKNOWN';
    },

    isBillStatusApprovable: function (status) {
        return (status == RM.Consts.InvoiceStatus.DRAFT);
    },

    isBillStatusPayable: function (status) {
        return (status == RM.Consts.InvoiceStatus.APPROVED) || (status == RM.Consts.InvoiceStatus.PARTIALLY_PAID);
    },

    isBillStatusEditable: function (status) {
        return (status == this.getInitialBillStatus());
    },

    isBillStatusEmailable: function (status) {
        //return (status == RM.Consts.InvoiceStatus.APPROVED) || (status == RM.Consts.InvoiceStatus.PARTIALLY_PAID) || (status == RM.Consts.InvoiceStatus.PAID);
        return true;
    },

    showBillDetail: function (isCreate, data, cb, cbs, callbackViewName) {
        var billDetailC = RM.AppMgr.getAppControllerInstance('RM.controller.BillDetailC');
        billDetailC.showView(isCreate, data, cb, cbs, callbackViewName);
    },

    showBillLineItem: function (editable, supplierId, isCreate, detailsData, cb, cbs) {
        var invLineItem = RM.AppMgr.getAppControllerInstance('RM.controller.BillLineItemC');
        invLineItem.showView(editable, supplierId, isCreate, detailsData, cb, cbs);
    },

    sendMsg: function (cb, cbs, invoiceData, msgType) {
        var emailBill = RM.AppMgr.getAppControllerInstance('RM.controller.EmailInvoiceC');
        emailBill.showView(cb, cbs, invoiceData, msgType);
    }
});