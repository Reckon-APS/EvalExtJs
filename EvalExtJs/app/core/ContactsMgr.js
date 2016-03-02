Ext.define('RM.core.ContactsMgr', {
    alternateClassName: 'RM.ContactsMgr',
    singleton: true,
	
	requires: ['RM.view.ContactDetail'],

    init: function (application) {
        
    },
    
    showContactDetail: function (isCreate, data, cb, cbs) {
        var contactDetailC = RM.AppMgr.getAppControllerInstance('RM.controller.ContactDetailC');
        contactDetailC.showView(isCreate, data, cb, cbs);
    },
	
});