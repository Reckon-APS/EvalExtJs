Ext.define('RM.component.VisibleOnFocus', {
    constructor: function() {
        var me = this;        
        me.on('focus', me.handleFocus);
    },
    
    handleFocus: function() {
        // This issue only affects android
        if (!Ext.os.is.Android) {
            return;
        }

        var me = this;
        // wait a little for any default behaviour, keyboard, etc to occur
        setTimeout(function() {
                                // If the element is visible then there is nothing to do
                                if (me.isElementInViewport(me.element.dom)) return;
                                
                                // otherwise find the first scrollable parent - not allowing for nested scrollables here!        
                                var current = me;
                                var scrollable = null;
                                while (!scrollable && current) {
                                    scrollable = current.getScrollable ? current.getScrollable() : null;
                                    current = current.getParent();
                                }
                                    
                                if (scrollable) {
                                    scrollable.getScroller().scrollTo(0, me.element.dom.offsetTop);
                                }
                            }, 
                   750);

    },
    
    // Shamelessly pilfered from http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
    // if it's good enough for John Resig, it's good enough for us...
    isElementInViewport: function (element) {
        var rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }
});