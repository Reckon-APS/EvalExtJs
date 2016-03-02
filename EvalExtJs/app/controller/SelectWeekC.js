Ext.define('RM.controller.SelectWeekC', {
    extend: 'Ext.app.Controller',
    
    config: {
        refs: {
            selectWeek: 'selectweek',
            selectWeekCal: 'selectweek rmcalendar'
        },
        control: {
            'selectweek': {
                show: 'onShow',
                hide: 'onHide'
            },
            'selectweek #back': {
                tap: 'back'
            },
            'selectweek rmcalendar': {
                weekSelect: 'onWeekSelected'
            }            
        }
    },

    showView: function (cb, cbs) {        
        this.detailsCb = cb;
        this.detailsCbs = cbs;

        var view = this.getSelectWeek();
        if (!view) {
            view = { xtype: 'selectweek' };
        }
        RM.ViewMgr.showPanel(view);
    },

    onShow: function () {
        RM.ViewMgr.regFormBackHandler(this.back, this);        
    },

    onHide: function () {
        RM.ViewMgr.deRegFormBackHandler(this.back);
    },

    back: function () {       
        RM.ViewMgr.back();
    },

    onWeekSelected: function (weekDaysArray) {
        RM.TimeSheetsMgr.showTimeSheetWeekly(weekDaysArray);
    }

});