Ext.define('RM.controller.HistoryC', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            history: 'history',
            historyTitle: 'history #historyTitle',
            historyList: 'history list'
        },
        control: {
            'history': {
                show: 'onShow'
            },
            'history #back': {
                tap: 'back'
            },
            'history #addnote': {
                tap: 'onAddNote'
            }
        }

    },

    showView: function (historyTitle, historyType, historyItemId) {
        this.historyTitle = historyTitle;
        this.historyType = historyType;
        this.historyItemId = historyItemId;
        var view = this.getHistory();
        if (!view)
            view = { xtype: 'history' };
        RM.ViewMgr.showPanel(view);

        var store = Ext.data.StoreManager.lookup('Histories');
        store.getProxy().setUrl(RM.AppMgr.getApiUrl('Histories'));
        store.filter('historyType', historyType);
        store.filter('historyItemId', historyItemId);
        this.loadList();
    },

    onShow: function () {
        this.getHistoryTitle().setHtml(this.historyTitle + ' history');
    },

    onAddNote: function () {

        RM.Selectors.addNote(
            this.historyType,
			this.historyItemId,
			function () {
			    this.loadList();
			},
			this
		);

    },

    loadList: function () {
        RM.AppMgr.loadStore(this.getHistoryList().getStore());
    },

    back: function () {
        RM.ViewMgr.back();
    }


});