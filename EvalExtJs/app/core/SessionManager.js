Ext.define('RM.core.SessionManager', {
    singleton:true,
    alternateClassName:'RM.SessionManager',    

    constructor: function() {
        this.callParent(arguments);      
        this.loggedIn = false;
    
        // Defines how long ahead of the session timing out the bump event will fire
        this.bumpWindowInSeconds = 30;

        // Defines the safety margin to pad the session expiry time with to avoid missing the server-side expiry because of latency
        this.ttlMarginInSeconds = 5;   
        
        // Hook into the ajax events, so we can do some session extension logic
        Ext.Ajax.on('requestcomplete', this.onSessionActivity, this);        
    },
        
    init: function(application) {
        this.app = application;
    },

    startSession: function(sessionInfo) {        
        this.ttl = parseInt(sessionInfo.SessionTTLInMinutes) * 60;
        this.loggedIn = true;        

        if (this.ttl) {
            this.setSessionTimers();
        }
    },

    endSession: function() {
        clearTimeout(this.warningTimer);    
        clearTimeout(this.sessionTimer);
        this.loggedIn = false;
        RM.Log.debug('Session ended');
    },

    setSessionTimers: function() {
        var me = this;
        clearTimeout(this.sessionTimer);
        clearTimeout(this.warningTimer);
        
        this.lastSessionStart = Date.now();
        
        // Work out the timeouts for session bump and session expiry
        var timeUntilWarning = this.ttl - this.bumpWindowInSeconds;
        this.warningTimer = setTimeout( function() { me.sessionTimingOut(); }, timeUntilWarning * 1000);
        
        // The session timer is just a safety mechanism so if the bumping fails for some reason we can trigger some 
        // fallback behaviour if the session expires completely.
        this.sessionTimer = setTimeout( function() { me.sessionTimedOut(); }, (this.ttl - this.ttlMarginInSeconds) * 1000);
        
        RM.Log.debug('Session timers started at ' + new Date());
    },

    onSessionActivity: function() {
        if (!this.loggedIn || this.bumpingSession) {
            return;
        }        

        clearInterval(this.bumpTimer);

        var elapsedSeconds = (Date.now() - this.lastSessionStart) / 1000;
        if (elapsedSeconds > this.ttl / 2) {
            // Activity past half way through the session activity window slides the session expiry along
            RM.Log.debug('Session should be sliding, timers reset');            
            this.setSessionTimers();
        }
    },

    sessionTimingOut: function() {
        var me = this;
        var left = me.bumpWindowInSeconds - 1;
        RM.Log.debug('Session expires in ' + left + ' seconds, attempting bump at ' + new Date());        
        this.bumpSession();
    },

    sessionTimedOut: function() {
        this.endSession();
        // raise the session end event
        this.app.fireEvent('rm-sessionexpired');        
    },
    
    bumpSession: function() {
/*        this.bumpingSession = true;
        RM.AppMgr.getServerRec('Login/ExtendSession', 
        {},
        function(sessionInfo) {
            if(sessionInfo) {
                // Session extended, restart the timers 
                this.startSession(sessionInfo);
            }
            this.bumpingSession = false;
        },
        this,
        function() { this.bumpingSession = false; });*/
    }

  }
);