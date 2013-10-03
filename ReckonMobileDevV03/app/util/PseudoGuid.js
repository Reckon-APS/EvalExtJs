Ext.define('RM.util.PseudoGuid', {
    singleton: true,
    currentIndex: 1,
    guidMask: '00000000-0000-0000-0000-000000000000',
    
    next: function() {
        var indexAsString = this.currentIndex.toString();
        var replaceRegExp = new RegExp('0{' + indexAsString.length + '}$');
        var guid = this.guidMask.replace(replaceRegExp, indexAsString);
        
        this.currentIndex += 1;
        // Ok, so this is highly unlikely, but I wouldn't be able to live with myself
        if(this.currentIndex > 999999999999) this.currentIndex = 1;
        
        return guid;
    }
});