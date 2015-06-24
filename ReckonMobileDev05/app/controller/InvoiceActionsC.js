Ext.define('RM.controller.InvoiceActionsC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.InvoiceActions'],
    config: {
        refs: {
            invActions: 'invoiceactions',
            invStatus: 'invoiceactions #invoiceStatus',
            invApproveBtn: 'invoiceactions #approve',
            invDraftBtn: 'invoiceactions #draft',
            invDeleteBtn: 'invoiceactions #deleteInvoice',
            invPayBtn: 'invoiceactions #pay',
            invPayAppBtn: 'invoiceactions #payApp',
            invEmailBtn: 'invoiceactions #email',
            invMarkAsPaidBtn: 'invoiceactions #markAsPaid',
            warningMessage: 'invoiceactions #lockOffWarning'
        },
        control: {
            'invoiceactions': {
                show: 'onShow'
            },            
            'invoiceactions #back': {
                tap: 'back'
            },
            'invoiceactions #approve': {
                tap: 'onApprove'
            },
            'invoiceactions #draft': {
                tap: 'onDraft'
            },
            'invoiceactions #deleteInvoice': {
                tap: 'onDelete'
            },
            'invoiceactions #pay': {
                tap: 'onPay'
            },
            'invoiceactions #payApp': {
                tap: 'onPayApp'
            },
            'invoiceactions #cancel': {
                tap: 'onCancel'
            },
            'invoiceactions #email': {
                tap: 'onEmail'
            },
            'invoiceactions #history': {
                tap: 'onHistory'
            },
            'invoiceactions #markAsPaid': {
                tap: 'onMarkAsPaid'
            }
        }

    },

    showView: function (data) {
        this.invoiceData = data;
        var view = this.getInvActions();
        if (!view){
            view = { xtype: 'invoiceactions' };
        }            
        RM.ViewMgr.showPanel(view);
    },

    onShow: function(){
        if(this.invoiceData.Status === 2 && this.invoiceData.BalanceDue < this.invoiceData.Amount) {
            this.getInvStatus().setHtml(RM.InvoicesMgr.getPartiallyPaidInvoiceStatusText());                                    
        }
        else {
            this.getInvStatus().setHtml(RM.InvoicesMgr.getInvoiceStatusText(this.invoiceData.Status));
        }
        
        var hideApprove = !(RM.InvoicesMgr.isInvoiceStatusApprovable(this.invoiceData.Status) && RM.PermissionsMgr.canApprove('Invoices'));
        //Draft button can only be visible when Approvals is on and if the Invoice has received no payments
        var hideDraft = !(RM.PermissionsMgr.canAddEdit('Invoices') && RM.CashbookMgr.getSalesPreferences().ApprovalProcessEnabled && (this.invoiceData.Status === RM.Consts.InvoiceStatus.APPROVED && this.invoiceData.BalanceDue === this.invoiceData.Amount));
        //Delete option can only be visible when invoice is draft or approved and unpaid and canDelete permission turned on 
        var hideDelete = !(RM.PermissionsMgr.canDelete('Invoices') && (this.invoiceData.Status === RM.Consts.InvoiceStatus.DRAFT || this.invoiceData.Status === RM.Consts.InvoiceStatus.APPROVED) && this.invoiceData.BalanceDue === this.invoiceData.Amount);
        var hideEmail = !(RM.InvoicesMgr.isInvoiceStatusEmailable(this.invoiceData.Status) && RM.PermissionsMgr.canDo('Invoices', 'PrintEmail'));
        var hidePay = !RM.InvoicesMgr.isInvoiceStatusPayable(this.invoiceData.Status) || 
                      !RM.PermissionsMgr.canAddEdit('Receipts') ||
                      this.invoiceData.BalanceDue === 0;
        var hideMarkAsPaid = !(this.invoiceData.Amount == 0 && !RM.CashbookMgr.getSalesPreferences().ApprovalProcessEnabled && this.invoiceData.Status != RM.Consts.InvoiceStatus.PAID && RM.PermissionsMgr.canApprove('Invoices')); 
                
        // Handle lock-off rules
        if(RM.CashbookMgr.getLockOffDate().getTime() >= this.invoiceData.Date.getTime()) {
            var showWarning = !(hideApprove && hidePay);
            hideApprove = true;
            hidePay = true;
            
            if(showWarning) {
                var warningMessage = this.getWarningMessage();
                warningMessage.setHtml('<strong>Note:</strong> Certain actions for this Invoice are not available because the Book is locked off until ' + RM.CashbookMgr.getLockOffDate().toLocaleDateString());
                warningMessage.setHidden(false);
            }            
        }
        
        this.getInvDraftBtn().setHidden(hideDraft);
        this.getInvDeleteBtn().setHidden(hideDelete);
        this.getInvApproveBtn().setHidden(hideApprove);        
        this.getInvEmailBtn().setHidden(hideEmail);
        this.getInvPayBtn().setHidden(hidePay);
        this.getInvMarkAsPaidBtn().setHidden(hideMarkAsPaid);
    },
    
    onApprove: function () {
        RM.AppMgr.getServerRecById('CustomerAvailableCreditLimit', this.invoiceData.CustomerId,
                  function (data) {
                      if (data.HasCreditLimit && this.invoiceData.BalanceDue > 0 && data.AvailableCredit < this.invoiceData.BalanceDue) {
                          RM.AppMgr.showCustomiseButtonMsgBox("This invoice will exceed the customer's credit limit. Approve anyway?", 'YES, APPROVE INVOICE', 'NO',
                           function (result) {
                               if (result === 'yes') {
                                   this.approve();
                               }
                               else {
                                   //Stay on the current screen for the user user to modify.
                                   return;
                               }
                           }, this);
                      }
                      else {
                          this.approve();
                      };
                  },
                  this,
                  function (eventMsg) {
                      RM.AppMgr.showOkMsgBox(eventMsg);
                  }
              );
    },
    approve: function () {
        RM.AppMgr.saveServerRec('InvoiceChangeStatus', false, { InvoiceId: this.invoiceData.InvoiceId, Status: RM.Consts.InvoiceStatus.APPROVED },
                function () {
                    RM.AppMgr.itemUpdated('invoice');
                    RM.AppMgr.showSuccessMsgBox('Invoice ' + this.invoiceData.InvCode + ' was Approved.');
                    this.invoiceData.Status = RM.Consts.InvoiceStatus.APPROVED;
                    this.getInvStatus().addCls("rm-approved-hearderbg");
                    this.onShow();
                },
                this,
                function (recs, eventMsg) {
                    RM.AppMgr.showOkMsgBox(eventMsg);
                }
            );
    },
    onDraft: function(){
        RM.AppMgr.saveServerRec('InvoiceChangeStatus', false, { InvoiceId: this.invoiceData.InvoiceId, Status: RM.Consts.InvoiceStatus.DRAFT },
			function () {
			    RM.AppMgr.itemUpdated('invoice');
			    RM.AppMgr.showSuccessMsgBox('Invoice ' + this.invoiceData.InvCode + ' status changed to draft.');
			    this.invoiceData.Status = RM.Consts.InvoiceStatus.DRAFT;
			    this.getInvStatus().removeCls("rm-approved-hearderbg");
			    this.onShow();
			},
			this,
            function (recs, eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
		);
    },
    
    onDelete: function () {
        RM.AppMgr.showYesNoMsgBox("Do you want to delete the invoice?",
            function (result) {
                if (result === 'yes') {
                    RM.AppMgr.deleteServerRec('Invoices/' + this.invoiceData.InvoiceId,
                        function () {
                            RM.AppMgr.itemUpdated('invoice');
                            RM.AppMgr.showSuccessMsgBox('Invoice ' + this.invoiceData.InvCode + ' deleted.');
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
        RM.InvoicesMgr.showAcceptPayment(this.invoiceData);
    },
    
    onPayApp: function () {
        RM.ViewMgr.showPayFromOne(null, this.invoiceData, function(){
            RM.ViewMgr.backTo('slidenavigationview');
        }, this);
    },

    onEmail: function () {
        RM.InvoicesMgr.sendMsg(
            function(){
                RM.ViewMgr.backTo('invoicedetail');
            },
            this,
            this.invoiceData, 
            'email'
        );
    },

    onHistory: function () {
        RM.Selectors.showHistory('Invoice', RM.Consts.HistoryTypes.INVOICE, this.invoiceData.InvoiceId);
    },

    onMarkAsPaid: function () {
        RM.AppMgr.saveServerRec('InvoiceChangeStatus', false, { InvoiceId: this.invoiceData.InvoiceId, Status: RM.Consts.InvoiceStatus.PAID },
             function () {
                 RM.AppMgr.itemUpdated('invoice');
                 RM.AppMgr.showSuccessMsgBox('Invoice ' + this.invoiceData.InvCode + ' has been marked to paid.');
                 this.invoiceData.Status = RM.Consts.InvoiceStatus.PAID;
                 this.getInvMarkAsPaidBtn().setHidden(true);
             },
             this,
             function (recs, eventMsg) {
                 RM.AppMgr.showOkMsgBox(eventMsg);
             }
         );
    },

    back: function () {
        RM.ViewMgr.back();
    }

});