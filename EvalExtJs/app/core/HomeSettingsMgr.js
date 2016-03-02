Ext.define('RM.core.HomeSettingsMgr', {
    alternateClassName: 'RM.HomeSettingsMgr',
    singleton: true,
    
    load: function(){
        RM.AppMgr.getServerRecs('HomeSettings', null, 
            function(recs){
                this.homeSettings = recs;
            }, 
            this, 
            function(resp){
                
            }
        );
    },
    
    getSetting: function(settingKey){
        for(var i = 0; i < this.homeSettings.length; i++){
            if(this.homeSettings[i].Key.toLowerCase() == settingKey.toLowerCase()){
                return this.homeSettings[i].Value;
            }            
        }
        return null;
    }

});