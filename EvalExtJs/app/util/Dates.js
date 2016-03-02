Ext.define('RM.util.Dates', {
    singleton: true,
    
    encodeAsUTC: function(date) {        
          function f(n) {
              return n < 10 ? '0' + n : n;
          }
          return ''+
                 date.getFullYear() + '-' +
                 f(date.getMonth() + 1) + '-' +
                 f(date.getDate()) + 'T' +
                 f(date.getHours()) + ':' +
                 f(date.getMinutes()) + ':00.000Z';
        },
    
    decodeAsLocal: function(dateString) {
        // Get the current local timezone offset
        var offset = new Date().getTimezoneOffset();
        
        // Explicitly remove any TZ offset information
        if(dateString.lastIndexOf('+') > 0) {
            dateString = dateString.substr(0,dateString.lastIndexOf('+'));
        }
        
        // Create a date out of the string, the default JS behaviour treats anything without specific TZ info as UTC so
        // we need to move that entire datetime as-is into the local timezone - without changing the time!
        return new Date(Date.parse(dateString) + offset * 60 * 1000);
    }
});