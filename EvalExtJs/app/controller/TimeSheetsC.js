Ext.define('RM.controller.TimeSheetsC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            timesheets: 'timesheets',
            tabPanel: 'timesheets tabpanel',
            timeSheetsList: 'timesheets list',
            timeSheetsCal: 'timesheets rmcalendar',
            sortSearchBar: 'timesheets sortsearchbar'
        },
        control: {
            'timesheets': {
                show: 'onShow'
            },
            'timesheets sortsearchbar': {
                sort: 'onSort',
                search: 'onSearch',
                searchclear: 'onSearchClear'
            },
            'timesheets list': {
                select: 'onItemSelect'
            },
            'timesheets #add': {
                tap: 'add'
            },
            'timesheets rmcalendar': {
                weekChange: 'onWeekChange',                
                weekSelect: 'onWeekSelected'
            },
            'timesheets tabpanel': {
                activeitemchange: 'onActiveItemChange',
            }
        }
    },

    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);
        this.getApplication().addListener('cashbookselected', 'onCashbookSelected', this);
    },

    onShow: function () {
        var store = this.getTimeSheetsList().getStore();
        store.getProxy().setUrl(RM.AppMgr.getApiUrl(store.getStoreId()));        
        var sortOptions = this.getSortSearchBar().config.sortfields;

        if (sortOptions.length > 0) {
            this.loadListHeaderAndItemTpl(this.sortVal || sortOptions[0].value);
        }

        if (!this.searchFilter && !this.endDateFilter) {
            this.firstTimeListLoading = true;            
        }
        else {
            //load data in the list and refresh cal e.g. when book is changed 
            this.loadList();
            this.getTimeSheetsCal().refreshCalendarData();
        }        
    },    

    loadListHeaderAndItemTpl: function (val) {
        var me = this;
        this.sortVal = val;

        this.getTimeSheetsList().getStore().setGrouper({            
            groupFn: function (item) {
                if (me.sortVal === 'Date') {
                    return Ext.Date.format(item.get('Date'), 'j M Y');
                }
                else {
                    return !item.get(me.sortVal) ? 'None' : item.get(me.sortVal);
                }
            }
        });

        this.getTimeSheetsList().setItemTpl(new Ext.XTemplate(
                                        '<div class = "rm-colorgrey rm-nextgrayarrow">',
                                        '<tpl if = "this.isSortByDate()">',
                                        '{[this.handleCustomerName(values.CustomerName)]}',
                                        '<tpl else>',
                                        '{[this.formatDate(values.Date)]}',
                                        '</tpl>',
                                        '<span class = "rm-colorlightgrey rm-ml5">({[RM.AppMgr.minsToHoursMinutes(values.Duration)]})</span>',
                                        '</div>',
                                        '<div class = "rm-fontsize70">',
                                        '{[this.showStatus(values.Status)]}',
                                        '</div>',
                                        {
                                            isSortByDate: function () {
                                                return me.sortVal === 'Date';
                                            },
                                            formatDate: function (valDate) {
                                                return Ext.Date.format(valDate, 'j M Y');
                                            },
                                            handleCustomerName: function (valName) {
                                                return valName ? valName : 'No Customer';
                                            },
                                            showStatus: function (valStatus) {
                                                return RM.TimeSheetsMgr.getTimeSheetStatusText(valStatus);
                                            }
                                        }
                                ));


    },

    onSort: function (val) {
        this.loadListHeaderAndItemTpl(val);
        this.loadList();
    },

    onSearch: function (val) {
        this.searchFilter = val;
        this.setLoadTimer();
    },

    onSearchClear: function () {
        delete this.searchFilter;
        this.loadList();
    },

    onActiveItemChange: function (tabpanel, value, oldValue, eOpts) {
        if (value.config.title === 'List') {
            this.loadList();
        }
        if (value.config.title === 'Calendar') {
            this.getTimeSheetsCal().refreshCalendarData();
        }
    },

    onWeekChange: function (weekDaysArray) {        
        this.setStartEndDateFilter(weekDaysArray);
        if (this.firstTimeListLoading) {
            this.loadList();
            this.firstTimeListLoading = false;
        }
    },

    onWeekSelected: function (weekDaysArray) {
        this.setStartEndDateFilter(weekDaysArray);
        this.getTabPanel().setActiveItem(0);
    },

    setStartEndDateFilter: function (weekDaysArray) {
        //Week start Monday and end Sunday
        this.startDateFilter = weekDaysArray[0];
        this.endDateFilter = weekDaysArray[6];
    },
    
    onItemUpdated: function (itemType) {
        if (itemType == 'timesheet' && this.getTimesheets()) {
            //update list and calendar view when new timesheets are added/deleted 
            this.loadList();
            this.getTimeSheetsCal().refreshCalendarData();
        }
    },

    onItemSelect: function (list, rec) {
        // Delay the selection clear so get a flash of the selection
        setTimeout(function () { list.deselect(rec); }, 500);
        RM.TimeSheetsMgr.showTimeSheetDetail(rec.data,
		    function (closeType, data) {
		        if (closeType == 'save')
		            this.loadList();
		    },
		    this
	    );
    },

    add: function () {
        RM.AppMgr.showRMMsgPopup('Select timesheet entry method', '', [{ text: 'WEEKLY', itemId: 'weekly', cls: 'x-button-green' }, { text: 'DAILY', itemId: 'daily' }, { text: 'CANCEL', itemId: 'cancel', cls: 'x-button-silver' }], function (selection) {
            if (selection === 'weekly') {                
                RM.TimeSheetsMgr.showSelectWeekScreen(
                	function (closeType, data) {
                	    if (closeType == 'save')
                	        this.loadList();
                	},
                	this
                );
            }
            else if (selection === 'daily') {
                RM.TimeSheetsMgr.showTimeSheetDetail(null,
                	function (closeType, data) {			    
                	    if (closeType == 'save')
                	        this.loadList();			    
                	},
                	this
                );
            }
        }, this);       
    },  
    
    loadList: function () {        
        var store = this.getTimeSheetsList().getStore();
        store.clearFilter();
        if (this.searchFilter) {
            store.filter('search', this.searchFilter);
        }        
        store.filter('startDate', this.startDateFilter);
        store.filter('endDate', this.endDateFilter);
        store.sort(this.sortVal);
        RM.AppMgr.loadStore(store);
    },

    setLoadTimer: function () {
        if (this.loadTimer) {
            clearTimeout(this.loadTimer);
            this.loadTimer = null;
        }
        this.loadTimer = Ext.defer(this.loadList, 1000, this);
    },

    onCashbookSelected: function () {
        var timesheetCal = this.getTimeSheetsCal();
        var tabPanel = this.getTabPanel();

        if (timesheetCal) {
            timesheetCal.setValue(new Date());
        }

        if (tabPanel) {
            tabPanel.setActiveItem(0);
        }
    }
});