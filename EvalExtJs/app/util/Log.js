Ext.define('RM.util.Log', {
    singleton: true,
    alternateClassName: 'RM.Log',
    
    debug: function(message) {
        //<debug>
        console.log(message);
        //</debug>
    }
});