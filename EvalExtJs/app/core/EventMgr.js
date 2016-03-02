Ext.define('RM.core.EventMgr', {
    alternateClassName: 'RM.EventMgr',
	singleton: true,
    
	logEvent: function(typeId, subTypeId, location, msg, data) {
        
        var eventsStr = localStorage.getItem('RmEvents'), events = eventsStr ? Ext.decode(eventsStr) : [], otherContextId = null;
        events.push({c: RM.AppMgr.getCashBookId(), o: otherContextId, dt: Ext.Date.format(new Date(), 'd-m-y H:i:s.u'), t: typeId, s: subTypeId, l: location, m: msg, d: Ext.encode(data)});
        localStorage.setItem('RmEvents', Ext.encode(events));
        
	},    
	
	logError: function(code, msg, file, method, locn) {
		this.logEv(code, msg, file, method, locn);
		alert('Error at ' + file + ',' + method + ',' + locn + '\n\n' + 'Please Upload Logs under Settings - Advanced.');
	},
    
    setUserLogLevel: function(logLevel){
      this.userLogLevel = logLevel;
    },

	uploadLogs: function(){
        var logPostDto = RM.AppMgr.getAppInfo();
		
        logPostDto.UploadKey = RM.Consts.Log.UPLOAD_KEY;
        logPostDto.UserId = RM.AppMgr.getUserId();
        logPostDto.DeviceDate = new Date();
        
        var eventsStr = localStorage.getItem('RmEvents');
        logPostDto.Events = eventsStr ? Ext.decode(eventsStr) : [];
        
		Ext.Ajax.request({
            url: RM.AppMgr.getApiUrl('Events'),
            method: 'Post',
            timeout: RM.Consts.Api.TIME_OUT,            
			success: function(resp){
				Ext.Msg.alert('Upload Events Response', resp.responseText, Ext.emptyFn);
			},   
			jsonData: logPostDto,
			scope: this
		});			
		
	},
    
});