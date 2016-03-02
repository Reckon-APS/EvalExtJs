Ext.define('RM.component.DropdownOverlay', {
	
	xtype: 'dropdownoverlay',
    
    
	show: function(menuBtn,cb,cbs,items,alignment){		
		
		if (!this.overlay) {
            this.menuBtn = menuBtn;
            //menuBtn.setStyle('background-color: black; background-image: url(resources/images/rm-maintopbar-border.svg) repeat-y left top;');
			Ext.Viewport.on('resize', 'alignMenu', this);
			this.overlay = Ext.Viewport.add({
				xtype: 'container',				
				modal: true,
				hideOnMaskTap: true,				
				border : '0',					
				padding: '0',	
				//margin:'-10 0 0 0',
                //width: 150,
                //height: 70,
                left: - 2000,  //render off screen so when alignMeu called has a width and then can position without flashing at top left
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
					scope: this
				},
				
				cls: 'rm-dropdownmain',
				items: items,
                listeners: {
                    destroy: function(){
                        Ext.Viewport.un('resize', 'alignMenu', this);
                    },
                    hide: function(){
                        //menuBtn.setStyle('background: url(resources/images/rm-maintopbar-border.svg) repeat-y left top;');
                        RM.ViewMgr.deRegBackHandler();
                    },
                    scope: this                    
                }
				
			});
		} 
            
		//this.overlay.showBy(menuBtn,alignment);
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
        this.overlay.setTop(alignToBox.height);
    }
    
});