Ext.define('RM.component.RMCalendar', {
    extend: 'Ext.Panel',
    xtype: 'rmcalendar',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'],
    weekstart: 1,
    config: {
        cls: 'rmcalendar',
        value: new Date(),
        minDate: null,
        maxDate: null,
        store: null
    },

    initialize: function () {
        var me = this;
        this.weekSelectedByTap = false;     //to detect week selected by tapping the week row
        me.callParent(arguments);
        me.element.on({
            tap: function (event, targetDom) {
                var target = Ext.get(targetDom);
                if (!target.hasCls('unselectable')) {
                    me.weekSelectedByTap = true;
                    var newDate = me.getCellDate(target);
                    me.setValue(newDate);
                    //me.fireEvent('change', me, newDate);
                }
            },
            delegate: 'td',
            scope: me
        });

        me.element.on({
            tap: function (event, targetDom) {
                var target = Ext.get(targetDom);
                if (target.hasCls("goto-prevmonth")) {
                    me.weekSelectedByTap = false;
                    me.loadTimeDelta('month', -1);
                }

                if (target.hasCls("goto-nextmonth")) {
                    me.weekSelectedByTap = false;
                    me.loadTimeDelta('month', 1);
                }

                //if (target.hasCls("goto-prevyear")) {
                //    me.loadTimeDelta('year', -1);
                //}

                //if (target.hasCls("goto-nextyear")) {
                //    me.loadTimeDelta('year', 1);
                //}
            },
            delegate: 'th',
            scope: me
        });

        this.monthViewStartDate = null;
        this.monthViewEndDate = null;
        this.monthViewData = null;
        this.on('monthChange', this.onMonthChange);
    },

    onMonthChange: function (start, end) {
        this.refreshCalendarStore(start, end);
    },

    refreshCalendarData: function () {
        if (this.monthViewStartDate && this.monthViewEndDate) {
            this.refreshCalendarStore(this.monthViewStartDate, this.monthViewEndDate);
        }
    },

    refreshCalendarStore: function (startDate, endDate) {
        var store = this.getStore();
        if (!store) {
            return;
        }
        store = Ext.data.StoreManager.lookup(store);
        //setPagesize for whole month 7 week rows
        store.setPageSize(50);
        store.getProxy().setUrl(RM.AppMgr.getApiUrl(store.getStoreId()));
        store.filter('startDate', startDate);
        store.filter('endDate', endDate);
        RM.AppMgr.loadStore(store, function (records, operation, success) {
            this.monthViewData = records;
            this.loadCalendarData();
        }, this);
    },

    loadCalendarData: function () {
        if (!this.monthViewData) {
            return;
        }
        var count = this.monthViewData.length;
        var dayQuery;
        var dayCell;
        var date;
        for (var i = 0; i < count; i++) {
            date = new Date(this.monthViewData[i].raw.Date);
            dayQuery = 'td[datetime="' + this.dateToString(date) + '"]';
            dayCell = this.element.select(dayQuery);
            (this.monthViewData[i].raw.HasTS || this.monthViewData[i].raw.HasData) ? dayCell.addCls('hasdata') : dayCell.removeCls('hasdata');
        }
    },

    applyMinDate: function (newVal, oldVal) {
        if (!Ext.isDate(newVal)) {
            newVal = null;
        }
        return newVal;
    },

    applyMaxDate: function (newVal, oldVal) {
        if (!Ext.isDate(newVal)) {
            newVal = null;
        }
        return newVal;
    },

    applyValue: function (newVal, oldVal) {
        if (Ext.isDate(newVal)) {
            return newVal;
        }
        //commented out to select the same selected row again
        //if (!Ext.isDate(newVal)) {
        //    newVal = null;
        //}
        //if (!this.sameDay(newVal, oldVal)) {
        //    return newVal;
        //}
    },

    updateValue: function (newVal, oldVal) {
        this.refresh();
    },

    refresh: function () {
        var me = this;
        setTimeout(function () {
            var v = me.getValue(), d = v || new Date();
            me.element.setHtml(me.generateCalendar(d.getMonth(), d.getFullYear()));
            me.setToday();
            v && me.setSelected(v);
            me.loadCalendarData();
        }, 0);
    },

    generateCalendar: function (month, year) {
        return this.monthMarkup(month, year);
    },

    monthLength: function (month, year) {
        var dd = new Date(year, month, 0);
        return dd.getDate();
    },

    monthMarkup: function (month, year) {
        var c = new Date();
        c.setDate(1);
        c.setMonth(month);
        c.setFullYear(year);

        var x = parseInt(this.weekstart, 10);
        var s = (c.getDay() - x) % 7;
        if (s < 0) {
            s += 7;
        }

        var dm = this.monthLength(month, year);

        var this_month = '<table cellspacing="0"><thead><tr>';

        this_month += '<th class="goto-prevmonth">' + this.days[(0 + x) % 7] + '</th>';
        this_month += '<th>' + this.days[(1 + x) % 7] + '</th>';
        this_month += '<th>' + this.days[(2 + x) % 7] + '</th>';
        this_month += '<th><span class="month-year-label">' + this.months[month] + ' ' + year + '</span>' + this.days[(3 + x) % 7] + '</th>';
        this_month += '<th>' + this.days[(4 + x) % 7] + '</th>';
        this_month += '<th>' + this.days[(5 + x) % 7] + '</th>';
        this_month += '<th class="goto-nextmonth">' + this.days[(6 + x) % 7] + '</th>';
        this_month += '</tr>';
        this_month += '</thead>';

        this_month += '<tbody>';
        this_month += '<tr>';

        for (var i = s; i > 0; i--) {
            var this_y = (month - 1) < 0 ? year - 1 : year;
            this_month += this.dayMarkup(0, dm - i + 1, (month + 11) % 12, this_y, (s - i + x) % 7);
        }

        dm = this.monthLength(month + 1, year);
        for (i = 1; i <= dm; i++) {
            if ((s % 7) === 0) {
                this_month += '</tr>';
                this_month += '<tr>';
                s = 0;
            }
            this_month += this.dayMarkup(1, i, month, year, (s + x) % 7);
            s++;
        }

        var j = 1;
        for (i = s; i < 7; i++) {
            this_y = (month + 1) > 11 ? year + 1 : year;
            this_month += this.dayMarkup(9, j, (month + 1) % 12, this_y, (i + x) % 7);
            j++;
        }

        this_month += '</tr>';
        this_month += '</tbody>';
        this_month += '</table>';
        //to remove empty table row when 1st day of the month falls on Monday
        this_month = this_month.replace('<tr></tr>', '');
        return this_month;
    },

    dayMarkup: function (format, day, month, year, column) {
        var classes = ['day'];
        if (format === 0) {
            classes.push('prevmonth');
        } else if (format == 9) {
            classes.push('nextmonth');
        }

        if (column === 0 || column == 6) {
            classes.push('weekend');
        }

        var datetime = year + '-' + (month + 1) + '-' + day;
        var date = new Date(year, month, day);

        if ((this.getMinDate() && date < this.getMinDate()) || (this.getMaxDate() && date > this.getMaxDate())) {
            classes.push('unselectable');
        }

        var this_day = '<td class="' + classes.join(' ') + '" datetime="' + datetime + '">';
        this_day += day;
        this_day += '</td>';

        return this_day;
    },

    getCellDate: function (dateCell) {
        var date = dateCell.dom.getAttribute('datetime');
        return this.stringToDate(date);
    },

    setSelectedWeekDaysArray: function (weekRow) {
        var weekDaysArray = new Array();
        var dayCells = weekRow.dom.cells;
        for (var i = 0; i < dayCells.length; i++) {
            var date = this.stringToDate(dayCells[i].getAttribute('datetime'));
            weekDaysArray.push(date);
        }
        //fire weekSelect event when a week row is tapped
        if (this.weekSelectedByTap) {
            this.fireEvent('weekSelect', weekDaysArray);
        }
        //raise weekChange event when we make a selection for the first time
        if (!this.selectedWeekDaysArray) {
            this.selectedWeekDaysArray = weekDaysArray;
            this.fireEvent('weekChange', weekDaysArray);
        }
            //avoid firing weekChange event when a day of the same week is selected
        else if (this.selectedWeekDaysArray[0].getTime() !== weekDaysArray[0].getTime()) {
            this.selectedWeekDaysArray = weekDaysArray;
            this.fireEvent('weekChange', weekDaysArray);
        }        
    },

    getSelectedWeekDaysArray: function () {
        return this.selectedWeekDaysArray;
    },

    stringToDate: function (dateString) {
        var a = dateString.split('-');
        return new Date(Number(a[0]), (a[1] - 1), Number(a[2]));
    },

    dateToString: function (date) {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    },

    removeSelectedCell: function () {
        this.element.select('.selected').removeCls('selected');
    },

    setToday: function () {
        var date = new Date();
        this.element.select('td[datetime="' + date.getFullYear() +
		                    '-' + (date.getMonth() + 1) + '-' + date.getDate() + '"]').addCls('today');
    },

    sameDay: function (date1, date2) {
        if (!date1 || !date2) {
            return false;
        }
        return (date1.getDate && date2.getDate) &&
		       date1.getDate() == date2.getDate() &&
		       date1.getMonth() == date2.getMonth() &&
		       date1.getFullYear() == date2.getFullYear();
    },

    setSelected: function (date) {
        this.removeSelectedCell();

        this.element.query('td').forEach(function (tdDom) {
            var me = this;
            var td = Ext.get(tdDom);
            var clickedDate = this.getCellDate(td);
            if (!td.hasCls("prevmonth") && !td.hasCls("nextmonth") && this.sameDay(date, clickedDate)) {
                td.addCls('selected');
                var monthTable = td.up('tbody');
                me.setMonthViewStartEndDate(monthTable);
                var weekRow = td.up('tr');
                weekRow.addCls('selected');
                me.setSelectedWeekDaysArray(weekRow);
            }
        }, this);
        this.setToday();
    },

    setMonthViewStartEndDate: function (monthTable) {
        var startDate = this.stringToDate(monthTable.first('tr').first('td').getAttribute('datetime'));
        var endDate = this.stringToDate(monthTable.last('tr').last('td').getAttribute('datetime'));
        if (!this.monthViewStartDate) {
            this.fireEvent('monthChange', startDate, endDate);
        }
        else if (this.monthViewStartDate && this.monthViewStartDate.getTime() !== startDate.getTime()) {
            this.fireEvent('monthChange', startDate, endDate);
        }
        this.monthViewStartDate = startDate;
        this.monthViewEndDate = endDate;
    },

    getMonthViewStartDate: function () {
        return this.setMonthViewStartDate;
    },

    getMonthViewEndDate: function () {
        return this.setMonthViewEndDate;
    },

    loadTimeDelta: function (unit, delta) {
        //var day;
        //var selected = this.element.down('.selected').down('.selected'); // to select date from selected row
        //if (selected) {
        //    day = this.stringToDate(selected.dom.getAttribute('datetime')).getDate();
        //} else {
        //    day = new Date().getDate();
        //}

        var v = this.getValue() || new Date();
        //var dayAdjustment = new Date(v.getFullYear(), v.getMonth() + delta, 1);
        var newDay;

        if (unit === 'month') {
            //newDay = new Date(v.getFullYear(), v.getMonth() + delta, Ext.Date.getDaysInMonth(dayAdjustment) < day ? Ext.Date.getDaysInMonth(dayAdjustment) : day);
            //set first day to select first week of the month
            newDay = new Date(v.getFullYear(), v.getMonth() + delta, 1);
        } else if (unit === 'year') {
            //newDay = new Date(v.getFullYear() + delta, v.getMonth(), Ext.Date.getDaysInMonth(dayAdjustment) < day ? Ext.Date.getDaysInMonth(dayAdjustment) : day);
            //set first day to select first week of the month
            newDay = new Date(v.getFullYear() + delta, v.getMonth(), 1);
        }

        if (this.getMinDate() && Ext.Date.getLastDateOfMonth(newDay) < this.getMinDate()) {
            return;
        }

        if (this.getMaxDate() && Ext.Date.getFirstDateOfMonth(newDay) > this.getMaxDate()) {
            return;
        }

        if (this.getMinDate() && newDay < this.getMinDate()) {
            newDay = Ext.Date.clone(this.getMinDate());
        }

        if (this.getMaxDate() && newDay > this.getMaxDate()) {
            newDay = Ext.Date.clone(this.getMaxDate());
        }

        this.setValue(newDay);
    }
});