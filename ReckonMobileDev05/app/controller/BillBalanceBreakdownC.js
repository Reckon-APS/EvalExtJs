Ext.define('RM.controller.BillBalanceBreakdownC', {
    extend: 'Ext.app.Controller',

    requires: ['RM.view.BillBalanceBreakdown'],
    config: {
        refs: {
            billBalBreakdown: 'billbalancebreakdown',
            breakdownCont: 'billbalancebreakdown #breakdownCont'
        },
        control: {
            'billbalancebreakdown': {
                show: 'onShow'
            },
            'billbalancebreakdown #back': {
                tap: 'back'
            }
        }

    },

    showView: function (data) {
        this.billData = data;
        var view = this.getBillBalBreakdown();
        if (!view)
            view = { xtype: 'billbalancebreakdown' };
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        var data = this.billData;

        this.getBreakdownCont().setHtml(Ext.util.Format.format(
            '<table width="90%" class="rm-tablelayout">' +
                '<tr>' +
                    '<div class="rm-balance-breakdown-row"><span>Subtotal</span><span class="rm-balance-breakdown-amount">{0}</span></div>' +
                '</tr>' +
                '<tr>' +
                    '<div class="rm-balance-breakdown-row"><span>Discount</span><span class="rm-balance-breakdown-amount">{1}</span></div>' +
                '</tr>' +
                (data.AmountTaxStatus === RM.Consts.TaxStatus.NON_TAXED ? '' :
                '<tr>' +
                    '<div class="rm-balance-breakdown-row"><span>Total (excluding tax)</span><span class="rm-balance-breakdown-amount">{2}</span></div>' +
                '</tr>' +
                '<tr>' +
                    '<div class="rm-balance-breakdown-row"><span>Tax</span><span class="rm-balance-breakdown-amount">{3}</span></div>' +
                '</tr>') +
                '<tr>' +
                    '<div class="rm-balance-breakdown-row"><span>Total</span><span class="rm-balance-breakdown-amount">{4}</span></div>' +
                '</tr>' +
                '<tr>' +
                    (data.Paid == 0 ? '' :
                    '<div class="rm-balance-breakdown-row"><span>Already paid</span><span class="rm-balance-breakdown-amount">{5}</span></div>') +
                '</tr>' +
                '<tr>' +
                    '<div class="rm-balance-breakdown-due"><span>Balance due</span><span class="rm-balance-breakdown-amount">{6}</span></div>' +
                '</tr>' +
             '</table>',
            this.formatCurrency(data.Subtotal),
            this.formatCurrency(data.DiscountTotal),
            this.formatCurrency(data.AmountExTax),
            this.formatCurrency(data.Tax),
            this.formatCurrency(data.Amount),
            this.formatCurrency(data.Paid),
            this.formatCurrency(data.BalanceDue))
        );
    },

    formatCurrency: function (val) {
        return val ? RM.AppMgr.formatCurrency(val, 2) : RM.AppMgr.formatCurrency(0, 2);
    },

    back: function () {
        RM.ViewMgr.back();
    }

});
