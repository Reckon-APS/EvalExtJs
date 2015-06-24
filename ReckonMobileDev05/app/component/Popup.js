Ext.define('RM.component.Popup', {
    extend: 'Ext.Sheet',
	
    config: {
        layout: 'vbox',
		hideOnMaskTap:true,
        cls: 'rm-popup',
        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'ease-out'
        },
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-out'
        },
        zIndex: 10,
        //title: '',
        buttons: []
    },

    show: function() {
        if (!this.getParent() && Ext.Viewport) {
            Ext.Viewport.add(this);
        }
        this.callParent();
    },

    initialize: function() {

        this.callParent();
        this.on('hide', function () {
            this.destroy();
        }, this);

        this.insert(0, {
            xtype: 'button',
            //ui: 'close',
            cls: ['rm-greybtn-bg', 'rm-flatbtn'],
            docked: 'bottom',
            text: 'CANCEL',
            handler: function() {
                this.hide();             
            },
            scope: this
        });
        /* this.insert(1, {
            xtype: 'component',
            cls: 'title',
            html: this.getTitle()
        }); */
        if (this.getButtons().length) {
            Ext.Array.each(this.getButtons(), function(btn) {
                this.add(Ext.applyIf(btn, {
                    xtype: 'button'
                }));
            }, this);
        }
    }
});
