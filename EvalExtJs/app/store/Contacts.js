Ext.define('RM.store.Contacts', {
    extend: 'RM.store.RmBaseStore',	
    config: {
        model: 'RM.model.Contact',
        grouper: {
            groupFn: function(rec) {
                return rec.get('Description').substr(0, 1).toUpperCase();                
            }
        }
    }
});