Ext.define('RM.component.PopupNotes', {

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
				width: 350,
				padding: 10,
				layout: {
					type: 'vbox',
					align: 'stretch',
					pack: 'start'
				
				},
				items: [{
							xtype: 'container',
							layout: 'hbox',
							items: [{
									xtype: 'component',
									html: 'NOTE'
								},{
									xtype: 'button',
									text: 'NEXT>'
								}
							
							]
						},{
							xtype: 'component',
							html: 'Called customer for approval.<br/>Will respond today'
						},{
							xtype: 'component',
							html: 'AUTHOR: Dean Darke<br/>DATE: 11th Mar 2012<br/>TIME: 01:45pm'
						}
					]
			});
		}
		
		this.overlay.show();	
	}
});