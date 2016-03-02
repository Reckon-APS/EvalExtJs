Ext.define('RM.util.Device', {
    alternateClassName: 'RM.Device',
    singleton: true,
    
    supportsAnimations: function() {                
        if(this._supportsAnimations === undefined) {
            this._supportsAnimations = navigator.userAgent.indexOf('HTC_PN071') === -1;
        }
        return this._supportsAnimations;
    }
});