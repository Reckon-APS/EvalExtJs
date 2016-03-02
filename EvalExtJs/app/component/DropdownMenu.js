Ext.define('RM.component.DropdownMenu', {
	
	xtype: 'dropdownmenu',
	
	show: function(menuBtn,cb,cbs,items){		
		
        
		if (!this.overlay) {
			this.menuBtn = menuBtn;
		    var width = menuBtn.getWidth();
            Ext.Viewport.on('resize', 'alignMenu', this);
			this.overlay = Ext.Viewport.add({
				xtype: 'container',				
				modal: true,
				hideOnMaskTap: true,				
				border : '0',				
				width: width,                
				
				
				layout: {
					type: 'vbox',
					align: 'stretch',
					pack: 'start'				
				},
				defaults: {
					handler: function(btn){
							this.hide();	
							cb.call(cbs, btn.getItemId());
					},
					scope: this,	
				},
				
				cls: 'rm-dropdown',
				items: items,
                listeners: {
                    destroy: function(){
                        Ext.Viewport.un('resize', 'alignMenu', this);
                    },
                    hide: function(){
                        menuBtn.setCls('rm-dropdownbtn');  
                        RM.ViewMgr.deRegBackHandler();
                    },
                    show: function(){
                        menuBtn.setCls('rm-dropdownbtn rm-dropdownmenu-bgcolor');  
                    },
                    scope: this                    
                }                
				
			});
		}		
		//this.overlay.showBy(menuBtn,'tc-bc');
        RM.ViewMgr.regBackHandler(this.hide, this);
        this.overlay.show();
        this.alignMenu();         
	},
    
    hide: function(){      
      this.overlay.hide();
    },
    
    alignMenu: function(){
        var alignToBox = this.menuBtn.renderElement.getPageBox();
        this.overlay.setLeft(alignToBox.right - this.overlay.renderElement.getBox().width);
        this.overlay.setTop(alignToBox.bottom);        
    }
});