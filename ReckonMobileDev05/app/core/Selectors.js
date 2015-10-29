Ext.define('RM.core.Selectors', {
    alternateClassName: 'RM.Selectors',
    singleton: true,

    requires: ['RM.view.CashBooks', 'RM.view.Projects', 'RM.view.Suppliers', 'RM.view.ItemsAmounts', 'RM.view.ItemDetail', 'RM.component.DurationPicker'],

    init: function (application) {
		this.app = application;	
		
    },
	
	showCashBooks: function(cb, cbs){
		var cashBooksC = RM.AppMgr.getAppControllerInstance('RM.controller.CashBooksC');
		cashBooksC.showView(cb, cbs);	
	},		
	
	showCustomers: function(projectId, cb, cbs, filterBy){
		var customersC = RM.AppMgr.getAppControllerInstance('RM.controller.CustomersC');
		customersC.showView(projectId, cb, cbs, filterBy);
	},	
	
	showProjects: function(customerId, supplierId, cb, cbs){
		var projectsC = RM.AppMgr.getAppControllerInstance('RM.controller.ProjectsC');
		projectsC.showView(customerId, supplierId, cb, cbs);
	},	
	
	showSuppliers: function(cb, cbs){
		var suppliersC = RM.AppMgr.getAppControllerInstance('RM.controller.SuppliersC');
		suppliersC.showView(cb, cbs);
	},
	
	showItems: function (showItemTax, projectId, selectDetails, cb, cbs, itemType, itemPurchasedSoldType) {
	    //var itemsC = RM.AppMgr.getAppControllerInstance('RM.controller.ItemsC');
	    var itemsC = RM.AppMgr.getAppControllerInstance('RM.controller.ItemsAmountsC');
	    itemsC.showView(showItemTax, projectId, selectDetails, cb, cbs, itemType, itemPurchasedSoldType);
	},
    
    showAccounts: function(selectDetails, cb, cbs){
        RM.ViewMgr.showLoadingMask(); //to prevent double tap on accounts field
        var accountsC = RM.AppMgr.getAppControllerInstance('RM.controller.AccountsC');
		accountsC.showView(selectDetails, cb, cbs);
        setTimeout(function () { RM.ViewMgr.hideLoadingMask(); }, 500);
    },

	showItemDetail: function(showTaxCode, item, cb, cbs){
	    var itemDetailC = RM.AppMgr.getAppControllerInstance('RM.controller.ItemDetailC');
		itemDetailC.showView(showTaxCode, item, cb, cbs);
    },
    
    showReceiptPhotoPreview: function(takePhoto, imgData, cb, cbs){        
        var receiptPhotoPreviewC = RM.AppMgr.getAppControllerInstance('RM.controller.ReceiptPhotoPreviewC');        
		receiptPhotoPreviewC.showView(takePhoto, imgData, cb, cbs); 
    },    

	showHistory: function(historyTitle, historyType, historyItemId){
		var history = RM.AppMgr.getAppControllerInstance('RM.controller.HistoryC');
		history.showView(historyTitle, historyType, historyItemId);
	},
	
	addNote: function(historyType, historyItemId, cb, cbs){
		var addNoteC = RM.AppMgr.getAppControllerInstance('RM.controller.AddNoteC');
		addNoteC.showView(
            'Add a note',
            true,
            'Save',
            '',
			function(noteText){
				RM.AppMgr.saveServerRec('HistoryNotes', true, {HistoryType: historyType, HistoryItemId: historyItemId, Text: noteText},
					function(){
                        if(cb)
                            cb.call(cbs, noteText);
						RM.ViewMgr.back();
					},
					this
				);
				
			},
			this
		);	
	},
    
    showNoteText: function(title, isEditable, saveText, text, cb, cbs){
        var addNoteC = RM.AppMgr.getAppControllerInstance('RM.controller.AddNoteC');
		addNoteC.showView(title, isEditable, saveText, text, cb, cbs);        
    },

    showDurationPicker: function(durationField){
        var durationPicker = Ext.create("RM.component.DurationPicker", {
            hidden: true,
            zIndex: 9999,

            //Get config values if present else asign default
            useTitles: durationField.config.useTitles || true,
            increment: durationField.config.increment || 1,
            minHours: durationField.config.minHours || 0,
            maxHours: durationField.config.maxHours || 24,
            hoursTitle: durationField.config.hoursTitle || 'Hours',
            minutesTitle: durationField.config.minutesTitle || 'Minutes',

            listeners: {
                change: function (picker, values) {
                    durationField.setValue(picker.getValue());
                },
                show: function (picker) {
                    RM.ViewMgr.regBackHandler(picker.hide, picker);
                },
                hide: function () {
                    RM.ViewMgr.deRegBackHandler();
                },
                scope: durationField
            }
        });
        durationPicker.show();
        durationPicker.setValue(durationField.getValue());
    }
    
});