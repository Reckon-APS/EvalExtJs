Ext.define('RM.controller.BillActionsC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.BillActions'],
    config: {
        refs: {
            billActions: 'billactions',
            billStatus: 'billactions #billStatus',
            billApproveBtn: 'billactions #approve',
            billDraftBtn: 'billactions #draft',
            billDeleteBtn: 'billactions #deleteBill',
            billPayBtn: 'billactions #pay',
            billEmailBtn: 'billactions #email',
            billMarkAsPaidBtn: 'billactions #markAsPaid',
            warningMessage: 'billactions #lockOffWarning'
        },
        control: {
            'billactions': {
                show: 'onShow'
            },
            'billactions #back': {
                tap: 'back'
            },
            'billactions #approve': {
                tap: 'onApprove'
            },
            'billactions #draft': {
                tap: 'onDraft'
            },
            'billactions #deleteBill': {
                tap: 'onDelete'
            },
            'billactions #pay': {
                tap: 'onPay'
            },
            'billactions #cancel': {
                tap: 'onCancel'
            },
            'billactions #email': {
                tap: 'onEmail'
            },
            'billactions #history': {
                tap: 'onHistory'
            },
            'billactions #markAsPaid': {
                tap: 'onMarkAsPaid'
            },
            'billactions #returnToList': {
                tap: 'returnToList'
            }
        }

    },

    showView: function (data) {
        this.billData = data;
        var view = this.getBillActions();
        if (!view) {
            view = { xtype: 'billactions' };
        }
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        if (this.billData.Status === 2 && this.billData.BalanceDue < this.billData.Amount) {
            this.getBillStatus().setHtml(RM.BillsMgr.getPartiallyPaidBillStatusText());
        }
        else {
            this.getBillStatus().setHtml(RM.BillsMgr.getBillStatusText(this.billData.Status));
        }

        var hideApprove = !(RM.BillsMgr.isBillStatusApprovable(this.billData.Status) && RM.PermissionsMgr.canApprove('Bills'));
        //Draft button can only be visible when Approvals is on and if the Invoice has received no payments
        var hideDraft = !(RM.PermissionsMgr.canAddEdit('Bills') && RM.CashbookMgr.getBillPreferences().ApprovalProcessEnabled && (this.billData.Status === RM.Consts.BillStatus.APPROVED && this.billData.BalanceDue === this.billData.Amount));
        //Delete option can only be visible when invoice is draft or approved and unpaid and canDelete permission turned on 
        var hideDelete = !(RM.PermissionsMgr.canDelete('Bills') && (this.billData.Status === RM.Consts.BillStatus.DRAFT || this.billData.Status === RM.Consts.BillStatus.APPROVED) && this.billData.BalanceDue === this.billData.Amount);
        var hideEmail = !(RM.BillsMgr.isBillStatusEmailable(this.billData.Status) && RM.PermissionsMgr.canDo('Bills', 'PrintEmail'));
        var hidePay = !RM.BillsMgr.isBillStatusPayable(this.billData.Status) ||
                      !RM.PermissionsMgr.canAddEdit('Receipts') ||
                      this.billData.BalanceDue === 0;
        var hideMarkAsPaid = !(this.billData.Amount == 0 && !RM.CashbookMgr.getSalesPreferences().ApprovalProcessEnabled && this.billData.Status != RM.Consts.BillStatus.PAID && RM.PermissionsMgr.canApprove('Bills'));

        // Handle lock-off rules
        //if (RM.CashbookMgr.getLockOffDate().getTime() >= this.billData.BillDate.getTime()) {
        //    var showWarning = !(hideApprove && hidePay);
        //    hideApprove = true;
        //    hidePay = true;

        //    if (showWarning) {
        //        var warningMessage = this.getWarningMessage();
        //        warningMessage.setHtml('<strong>Note:</strong> Certain actions for this Bill are not available because the Book is locked off until ' + RM.CashbookMgr.getLockOffDate().toLocaleDateString());
        //        warningMessage.setHidden(false);
        //    }
        //}

        this.getBillDraftBtn().setHidden(hideDraft);
        this.getBillDeleteBtn().setHidden(hideDelete);
        this.getBillApproveBtn().setHidden(hideApprove);
        this.getBillEmailBtn().setHidden(hideEmail);
        this.getBillPayBtn().setHidden(hidePay);
        this.getBillMarkAsPaidBtn().setHidden(hideMarkAsPaid);
    },

    onApprove: function () {
        RM.AppMgr.saveServerRec('BillChangeStatus', false, { BillId: this.billData.BillId, Status: RM.Consts.BillStatus.APPROVED },
                 function () {
                     RM.AppMgr.itemUpdated('bill');
                     RM.AppMgr.showSuccessMsgBox('Bill ' + this.billData.BillNumber + ' status changed to approved.');
                     this.billData.Status = RM.Consts.BillStatus.APPROVED;
                     this.getBillStatus().addCls("rm-approved-hearderbg");
                     this.onShow();
                 },
                 this,
                 function (recs, eventMsg) {
                     RM.AppMgr.showOkMsgBox(eventMsg);
                 }
             );
    },
    
    onDraft: function () {
        RM.AppMgr.saveServerRec('BillChangeStatus', false, { BillId: this.billData.BillId, Status: RM.Consts.BillStatus.DRAFT },
			function () {
			    RM.AppMgr.itemUpdated('bill');
			    RM.AppMgr.showSuccessMsgBox('Bill ' + this.billData.BillNumber + ' status changed to draft.');
			    this.billData.Status = RM.Consts.BillStatus.DRAFT;
			    this.getBillStatus().removeCls("rm-approved-hearderbg");
			    this.onShow();
			},
			this,
            function (recs, eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
		);
    },

    onDelete: function () {
        RM.AppMgr.showYesNoMsgBox("Do you want to delete the bill?",
            function (result) {
                if (result === 'yes') {
                    RM.AppMgr.deleteServerRec('Bills/' + this.billData.BillId,
                        function () {
                            RM.AppMgr.itemUpdated('bill');
                            RM.AppMgr.showSuccessMsgBox('Bill ' + this.billData.BillNumber + ' deleted.');
                            RM.ViewMgr.backTo('slidenavigationview');
                        },
                        this,
                        function (recs, eventMsg) {
                            RM.AppMgr.showOkMsgBox(eventMsg);
                        }
                    );
                }
            }, this);
    },

    onPay: function () {
        RM.BillsMgr.showAcceptPayment(this.billData);
    },

    onPayApp: function () {
        RM.ViewMgr.showPayFromOne(null, this.billData, function () {
            RM.ViewMgr.backTo('slidenavigationview');
        }, this);
    },

    onEmail: function () {
        RM.BillsMgr.sendMsg(
            function () {
                RM.ViewMgr.backTo('billdetail');
            },
            this,
            this.billData,
            'email'
        );
    },

    onHistory: function () {
        RM.Selectors.showHistory('Bill', RM.Consts.HistoryTypes.BILL, this.billData.BillId);
    },

    onMarkAsPaid: function () {
        RM.AppMgr.saveServerRec('BillChangeStatus', false, { BillId: this.billData.BillId, Status: RM.Consts.BillStatus.PAID },
             function () {
                 RM.AppMgr.itemUpdated('bill');
                 RM.AppMgr.showSuccessMsgBox('Bill ' + this.billData.InvCode + ' has been marked to paid.');
                 this.billData.Status = RM.Consts.BillStatus.PAID;
                 this.getBillMarkAsPaidBtn().setHidden(true);
             },
             this,
             function (recs, eventMsg) {
                 RM.AppMgr.showOkMsgBox(eventMsg);
             }
         );
    },

    back: function () {
        RM.ViewMgr.back();
    },

    returnToList: function () {
        RM.ViewMgr.backTo('slidenavigationview');
    }

});