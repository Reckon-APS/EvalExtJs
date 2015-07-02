Ext.define('RM.core.PermissionsMgr', {
    alternateClassName: 'RM.PermissionsMgr',
    singleton: true, 
	
    init: function (application) {
		this.app = application;
	},
	
	setPermissions: function(permissions, access){        
        this.permissions = permissions.map(function(action) { return action.toLowerCase ? action.toLowerCase() : action });
        this.forceReadOnly = false;
        
        if(access.toUpperCase() === 'R') {
            this.forceReadOnly = true;
            RM.Log.debug('Cashbook loaded as Read Only, permissions overrides will apply to AddEdit, Delete and certain Do actions.');            
        }
        
        this.triggerUpdateEvent();
        
        //<debug>
        this.resetPermissions();
        //</debug>
    },
    
    getPermission: function(actionCode){        
        var granted = this.permissions.indexOf(actionCode.toLowerCase()) > -1;
        //<debug>
        if (actionCode in this.getOverrides()) { 
            if(this.logEvents) RM.Log.debug("Action override of '" + this.overrides[actionCode] + "' applied to: " + actionCode);
            return this.overrides[actionCode]; 
        }
        if ("globalOverride" in this) { 
            if(this.logEvents) RM.Log.debug("Global override of '" + this.globalOverride + "' applied to: " + actionCode);
            return this.globalOverride; 
        }        
        if(this.logEvents) RM.Log.debug("Access value of '" + granted + "' applied to: " + actionCode);
        //</debug>
        return granted;
    },
    
    canDo: function(permissionName, action){        
       return this.getPermission(permissionName + '_' + action);
    },
    
    canDoUnlessReadOnly: function(permissionName, action){        
       return !this.forceReadOnly && this.canDo(permissionName, action);
    },

    canApprove: function(permissionName){
        return this.canDoUnlessReadOnly(permissionName, 'Approve');
    },
    
    canAddEdit: function(permissionName){
        if(permissionName == 'Items') return false; //removed ability to Add Items in release 1
        return this.canDoUnlessReadOnly(permissionName, 'AddEdit');
    },
    
    canView: function(permissionName){
        return this.canDo(permissionName, 'View');        
    },
    
    canDelete: function(permissionName){
        return this.canDoUnlessReadOnly(permissionName, 'Delete');
    },
    
    canReport: function(permissionName){
        return this.canDo(permissionName, 'Report');
    },
    
    canSelect: function(permissionName){
        return this.canDo(permissionName, 'Select');
    },

    canBillEntry: function(permissionName){
        return this.canDo(permissionName, 'BillEntry');
    },
    
    triggerUpdateEvent: function() {
        this.app.fireEvent('rm-permissionsupdated');
    }
    
    //<debug>
    ,
    resetPermissions: function() {
        delete this.globalOverride;
        delete this.overrides;
        this.triggerUpdateEvent();
    },
    
    allowEverything: function() {
        this.globalOverride = true;        
        this.triggerUpdateEvent();
    },

    allowNothing: function() {
        this.globalOverride = false;        
        this.triggerUpdateEvent();
    },
    
    alwaysAllowAction: function(action) {
        this.getOverrides()[action] = true;    
        this.triggerUpdateEvent();
    },
    
    alwaysDenyAction: function(action) {
        this.getOverrides()[action] = false;    
        this.triggerUpdateEvent();
    },
    
    getOverrides : function() {    
        if(!this.overrides) {this.overrides = {};}   
        return this.overrides;
    },
    
    enableLogging: function() {
        this.logEvents = true;
        console.log('Permissions logging enabled');
    },
    
    setBookIsReadOnly: function(readOnly) {
        this.forceReadOnly = readOnly;
        this.triggerUpdateEvent();
    }
    
    //</debug>
	
});