Ext.define('RM.component.RMMsgPopup', {
    extend: 'Ext.Sheet',
	
    config: {
        layout: {
            type: 'vbox',
            align: 'center',            
        },       
        cls: 'rm-msgpopup',
        zIndex: 90
    },

    show: function() {
        if (!this.getParent() && Ext.Viewport) {
            Ext.Viewport.add(this);
        }
        this.callParent();
    }
});
