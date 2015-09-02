Ext.define('RM.controller.ExpensesC', {
    extend: 'Ext.app.Controller',	
    config: {
        refs: {
            expenses: 'expenses',
            expensesList: 'expenses list',
            tabPanel: 'expenses tabpanel',            
            expensesCal: 'expenses rmcalendar',
            sortSearchBar: 'expenses sortsearchbar'
        },
        control: {
			'expenses': {
				show: 'onShow'
			},
            'expenses sortsearchbar': {
                sort: 'onSort',
                search: 'onSearch',
                searchclear: 'onSearchClear'
            },		
			'expenses list': {
				select: 'onItemSelect'			
			},
			'expenses #add': {
                tap: 'add'
			},
			'expenses rmcalendar': {
			    weekChange: 'onWeekChange',                
			    weekSelect: 'onWeekSelected'
			},
			'expenses tabpanel': {
			    activeitemchange: 'onActiveItemChange',
			}
        }

    },

    init: function () {
        this.getApplication().addListener('itemupdated', 'onItemUpdated', this);
        this.getApplication().addListener('cashbookselected', 'onCashbookSelected', this);
    },
	
	onShow: function(){
	    var store = this.getExpensesList().getStore();
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
	        this.getExpensesCal().refreshCalendarData();
	    }
	},

	loadListHeaderAndItemTpl: function (val) {
	    var me = this;
	    this.sortVal = val;

	    this.getExpensesList().getStore().setGrouper({
	        groupFn: function (item) {
	            if (me.sortVal === 'ClaimDate') {
	                return Ext.Date.format(item.get(me.sortVal), 'j M Y');
	            }
	            else if (me.sortVal === 'Status') {
	                return RM.ExpensesMgr.getExpenseStatusText(item.get(me.sortVal));;
	            }
	            else {
	                return RM.AppMgr.formatCurrency(item.get(me.sortVal));
	            }
	        }
	    });

	    this.getExpensesList().setItemTpl(new Ext.XTemplate(
                                        '<div class = "rm-colorgrey rm-nextgrayarrow">',
                                        '<div class = "rm-width-half rm-inline-block rm-fontsize90 rm-fontweightbold">{ClaimNumber}</div>',
                                        '<div class = "rm-width-half rm-inline-block rm-fontsize90 rm-fontweightbold rm-alignr">{[RM.AppMgr.formatCurrency(values.ClaimAmount)]}</div>',
                                        '</div>',
                                        '<div class = "rm-invoices-duestatus">',
                                        '<div class = "rm-width-half rm-inline-block ">{[this.showStatus(values.Status)]}</div>',
                                        '<div class = "rm-width-half rm-inline-block rm-alignr rm-pr20">{[this.formatDate(values.ClaimDate)]}</div>',
                                        '</div>',
                                        {
                                            formatDate: function (valDate) {
                                                return Ext.Date.format(valDate, 'j M Y');
                                            },                                            
                                            showStatus: function (valStatus) {
                                                return RM.ExpensesMgr.getExpenseStatusText(valStatus);
                                            }
                                        }
                                ));


	},

    onItemUpdated: function (itemType) {
        if (itemType === 'expense' && this.getExpenses()) {
            this.loadList();
        }
    },


	onItemSelect: function(list, rec){   
    	// Delay the selection clear so get a flash of the selection
    	setTimeout(function(){list.deselect(rec);},500);
    	RM.ExpensesMgr.showExpenseDetail(rec.data,
    		function(closeType, data){
    			if(closeType == 'save')
    				this.loadList();				
    		}, 
    		this
    	);                    
	},

	onActiveItemChange: function (tabpanel, value, oldValue, eOpts) {
	    if (value.config.title === 'List') {
	        this.loadList();
	    }
	    if (value.config.title === 'Calendar') {
	        this.getExpensesCal().refreshCalendarData();
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
    	
	add: function(){
		RM.ExpensesMgr.showExpenseDetail(null,
			function(closeType, data){
				if(closeType == 'save')
					this.loadList();
			}, 
			this
		);
	
	},	

	loadList: function () {
	    var store = this.getExpensesList().getStore();
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

    //whenever cashbook is selected/changed reset calendar and tabpanel
    onCashbookSelected: function () {
        var expensesCal = this.getExpensesCal();
        var tabPanel = this.getTabPanel();

        if (expensesCal) {
            expensesCal.setValue(new Date());
        }

        if (tabPanel) {
            tabPanel.setActiveItem(0);
        }
    }
});