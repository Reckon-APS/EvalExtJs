Ext.define('RM.component.PinOptions', {

	show: function(cb, cbs){
		this.cb = cb;
		this.cbs = cbs;
		
		if (!this.overlay) {
			this.overlay = Ext.Viewport.add({
				xtype: 'panel',
				floating: true,
				modal: true,
				hideOnMaskTap: true,
				centered: true,
				width: 200,
				padding: 10,
				layout: {
					type: 'vbox',
					align: 'stretch',
					pack: 'start'
				
				},
				defaults: {
					xtype: 'button',
					handler: function(btn){
						this.overlay.hide();
						this.cb.call(this.cbs, btn.getItemId());
					},
					scope: this
				},
				items: [{
							text: 'Logout',
							itemId: 'logout'
						},{
							text: 'Forgotten PIN',
							itemId: 'forgotpin'
						}
				]
			});
		}
		
		this.overlay.show();	
	}
});