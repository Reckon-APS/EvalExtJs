Ext.define('RM.component.BillsList', {
    extend: 'Ext.Panel',
    requires: 'RM.component.RMList',
    xtype: 'billslist',
    config: {
        layout: 'fit',
        control: {
            'list': {
                itemtap: 'onItemTap'
            }
        }
    },

    initialize: function () {

        this.supplierId = this.config.supplierId;
        this.isShowSupplier = this.config.isShowSupplier;
        this.callParent(arguments);

        var store = Ext.data.StoreManager.lookup('Bills');
        var groupDueDate = (this.config.sortVal == 'duedate');
        if (groupDueDate) {
            store.setGroupField('DuePeriodName');
        }
        else {
            store.setGroupField(null);
            this.sort = this.config.sortVal;
        }

        this.loadList();

        this.add({
            xtype: 'rmlist',
            store: 'Bills',
            loadingText: null,
            emptyText: 'No bills found.',
            disableSelection: true,
            grouped: groupDueDate,
            itemTpl: this.getTemplate()
        });
    },

    onItemTap: function (list, index, target, rec, e, eOpts) {
        if (Ext.fly(e.target).hasCls('rm-emailreminder')) {
            this.sendBillReminder(rec.data.BillId);
        }
        else {
            RM.BillsMgr.showBillDetail(false, rec.data,
                function (closeType, data) {
                    return null;
                },
                this
            );
        }

    },

    reload: function () {
        this.loadList();
    },

    setSearch: function (val) {
        this.search = val;
        this.setLoadTimer();
    },

    clearSearch: function () {
        delete this.search;
        this.loadList();
    },

    loadList: function () {
        var store = Ext.data.StoreManager.lookup('Bills');
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('Bills'));
        store.clearFilter();

        if (this.supplierId) {
            store.filter('supplierId', this.supplierId);
        }

        if (this.search) {
            store.filter('search', this.search);
        }

        if (this.sort) {
            store.sort(this.sort);
        };

        RM.AppMgr.loadStore(store);
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    },

    //This method which will be called from onItemTap will currently never be called as RM.ViewMgr.showEmailReminder() always returns false
    //- it was set to return false as although the initial mobile ux had an reminder functionality the web app doesn't at this stage so decision was to turn it off in mobile as well
    sendBillReminder: function (billId) {

        RM.AppMgr.getServerRecById('Bills', billId,
            function (data) {
                RM.BillsMgr.sendMsg(
                    function () {
                        RM.ViewMgr.backTo('bills');
                    },
                    this,
                    data,
                    'emailreminder'
                );
            },
            this,
            function (eventMsg) {
                RM.AppMgr.showOkMsgBox(eventMsg);
            }
        );
    },

    getTemplate: function () {

        var tplStr =

               '<div>' +
                    '<div style="width: 55%; display: inline-block; vertical-align: top;">' +
                        '<div class="rm-orgnametext rm-pt5 rm-pl5">{BillNumber}</div>' +
                    '</div>' +
                    '<div style="width: 45%; display: inline-block; vertical-align: top;">' +
                        '<div class="rm-nextgrayarrow rm-pt5 rm-invoices-invoiceamount rm-alignr">' +
                            '{[RM.AppMgr.formatCurrency(values.Status == 2 ? values.Balance : values.Amount)]}' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="width: 60%; display: inline-block; vertical-align: top;">' +
                        '<div class="rm-invoices-duestatus rm-pt5 rm-pl5 "> {[this.calculateDays(values.DueDate, values.DueDays, values.Status)]}' +
                            '<tpl if="this.isOverdue(values.DueDate, values.DueDays, values.Status)">' +
                                "<span class='rm-reddot'></span>" +
                                "<tpl if='RM.ViewMgr.showEmailReminder()'>" +
                                    "<span class='rm-emailreminder rm-pl5'>Send email reminder</span>" +
                                '</tpl>' +
                            '</tpl>' +
                        '</div>' +
                    '</div>' +
                    '<div style="width: 40%; display: inline-block; vertical-align: top;">' +
                            '<div class="rm-invoices-duestatus rm-alignr rm-pt5 rm-mr20">' +
                                '<tpl if="(values.Status == 2 &amp;&amp; values.Balance &lt; values.Amount)">' +
                                    '{[RM.AppMgr.capitalizeString(RM.BillsMgr.getPartiallyPaidBillStatusText())]}' +
                                '<tpl else>' +
                                    '{[RM.AppMgr.capitalizeString(RM.BillsMgr.getBillStatusText(values.Status))]}' +
                                '</tpl>' +
                        '</div>' +
                    '</div>' +
                '</div>'


        var me = this;

        return new Ext.XTemplate(
            tplStr,
            {
                isOverdue: function (dueDate, dueDays, status) {
                    if (status == RM.Consts.BillStatus.PAID) return false;
                    return dueDate && dueDate.getFullYear() > 1 && dueDays < 0;
                },
                calculateDays: function (dueDate, dueDays, status) {                    
                    if (status == RM.Consts.BillStatus.PAID) return '';
                    if (!dueDate || dueDate.getFullYear() == 1) {
                        return 'No due date';
                    }
                    else if (dueDays < 0) {
                        return "Overdue"
                    }
                    else if (dueDays == 0) {
                        return "Due today"
                    }
                    else if (dueDays == 1) {
                        return "Due in 1 day"
                    }
                    else {
                        return "Due in " + dueDays + " days"
                    }
                },
                isShowSupplier: function () {
                    return me.isShowSupplier;
                }
            });
    }

});