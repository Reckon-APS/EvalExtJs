Ext.define('RM.controller.ExpenseActionsC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.ExpenseActions'],
    config: {
        refs: {
            expenseActions: 'expenseactions',
            expenseStatus: 'expenseactions #expenseStatus',
            expenseApproveBtn: 'expenseactions #approve',
            expenseDraftBtn: 'expenseactions #draft',
            expenseDeleteBtn: 'expenseactions #deleteExpense',
            expenseEmailBtn: 'expenseactions #email',
            warningMessage: 'expenseactions #lockOffWarning'
        },
        control: {
            'expenseactions': {
                show: 'onShow'
            },
            'expenseactions #back': {
                tap: 'back'
            },
            expenseApproveBtn: {
                tap: 'approve'
            },
            expenseDeleteBtn: {
                tap: 'onDelete'
            },
            expenseDraftBtn: {
                tap: 'onDraft'
            },
            expenseEmailBtn: {
                tap: 'onEmail'
            },
            'expenseactions #history': {
                tap: 'onHistory'
            },
            'expenseactions #returnToList': {
                tap: 'returnToList'
            }
        }

    },

    showView: function (data) {
        this.expenseData = data;
        var view = this.getExpenseActions();
        if (!view) {
            view = { xtype: 'expenseactions' };
        }
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {        
        this.getExpenseStatus().setHtml(RM.ExpensesMgr.getExpenseStatusText(this.expenseData.Status));

        var hideApprove = !(RM.ExpensesMgr.isExpenseStatusApprovable(this.expenseData.Status) && RM.PermissionsMgr.canApprove('ExpenseClaims'));
        //Draft button can only be visible when Approvals is on and if the Expense has received no payments
        var hideDraft = !(RM.PermissionsMgr.canAddEdit('ExpenseClaims') && RM.CashbookMgr.getExpensePreferences().ApprovalProcessEnabled && (this.expenseData.Status === RM.Consts.ExpenseStatus.APPROVED && this.expenseData.BalanceDue === this.expenseData.Amount));
        //Delete option can only be visible when expense is draft or approved and unpaid and canDelete permission turned on 
        var hideDelete = !(RM.PermissionsMgr.canDelete('ExpenseClaims') && (this.expenseData.Status === RM.Consts.ExpenseStatus.DRAFT || this.expenseData.Status === RM.Consts.ExpenseStatus.APPROVED) && this.expenseData.BalanceDue === this.expenseData.Amount);
        var hideEmail = !(RM.ExpensesMgr.isExpenseStatusEmailable(this.expenseData.Status) && RM.PermissionsMgr.canDo('ExpenseClaims', 'PrintEmail'));
        
        this.getExpenseDeleteBtn().setHidden(hideDelete);
        this.getExpenseApproveBtn().setHidden(hideApprove);
        this.getExpenseEmailBtn().setHidden(hideEmail);
        this.getExpenseDraftBtn().setHidden(hideDraft);
    },

    approve: function () {
        RM.AppMgr.saveServerRec('ExpenseChangeStatus', false, { ExpenseClaimId: this.expenseData.ExpenseClaimId, Status: RM.Consts.ExpenseStatus.APPROVED },
                function () {
                    RM.AppMgr.itemUpdated('expense');
                    RM.AppMgr.showSuccessMsgBox('Expense ' + this.expenseData.ExpenseClaimNumber + ' was Approved.');
                    this.expenseData.Status = RM.Consts.ExpenseStatus.APPROVED;
                    this.getExpenseStatus().addCls("rm-approved-hearderbg");
                    this.onShow();
                },
                this,
                function (recs, eventMsg) {
                    RM.AppMgr.showOkMsgBox(eventMsg);
                }
            );
    },

    onDraft: function () {
        RM.AppMgr.saveServerRec('ExpenseChangeStatus', false, { ExpenseClaimId: this.expenseData.ExpenseClaimId, Status: RM.Consts.ExpenseStatus.DRAFT },
			function () {
			    RM.AppMgr.itemUpdated('expense');
			    RM.AppMgr.showSuccessMsgBox('Expense ' + this.expenseData.ExpenseClaimNumber + ' status changed to draft.');
			    this.expenseData.Status = RM.Consts.ExpenseStatus.DRAFT;
			    this.getExpenseStatus().removeCls("rm-approved-hearderbg");
			    this.onShow();
			},
			this,
            function (recs, eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
		);
    },

    onDelete: function () {
        RM.AppMgr.showYesNoMsgBox("Do you want to delete the expense?",
            function (result) {
                if (result === 'yes') {
                    RM.AppMgr.deleteServerRec('Expenses/' + this.expenseData.ExpenseClaimId,
                        function () {
                            RM.AppMgr.itemUpdated('expense');
                            RM.AppMgr.showSuccessMsgBox('Expense ' + this.expenseData.ExpenseClaimNumber + ' deleted.');
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

    onEmail: function () {
        RM.ExpensesMgr.sendMsg(
            function () {
                RM.ViewMgr.backTo('expensedetail');
            },
            this,
            this.expenseData,
            'email'
        );
    },

    onHistory: function () {
        RM.Selectors.showHistory('Expense', RM.Consts.HistoryTypes.EXPENSE, this.expenseData.ExpenseClaimId);
    },    

    back: function () {
        RM.ViewMgr.back();
    },

    returnToList: function () {
        RM.ViewMgr.backTo('slidenavigationview');
    }

});