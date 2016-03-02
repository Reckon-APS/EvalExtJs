Ext.define('RM.component.DropdownButton', {
	extend: 'Ext.Button',
	xtype: 'dropdownbutton',
    requires:'RM.component.DropdownMenu',
	
	
	config: {		
		options:[],
	},
	
	initialize: function() {
		this.callParent(arguments);		
		var options = this.getOptions();		
        if(options== null || options.length <= 0) 
		{
			this.setHidden(true);
			return;
		}
        this.setItemId(options[0].value);
        this.setText(options[0].text + '<span> <img src="resources/images/icons/rm-dropdown.svg" style="margin-left: 5px; margin-bottom: 2px; width: 7px; height: 6px;"></span>');        
        this.setCls('rm-dropdownbtn');		
        this.setUi('rm_dropdownbtn');
	},
	
	onTap: function(){
		
		var menu = Ext.create('RM.component.DropdownMenu');		
		var menuItems = new Array();
		var options = this.getOptions();
		if (options.length) {
			for (var i=0;i<options.length;i++)
				{ 
						var option = options[i];
						if(this.getItemId() == option.value) continue;
						var btn = {
								xtype: 'button',
								itemId: option.value,
								text: option.text,								
								ui: 'rm_btnaslistrowmain'								
							};							
						menuItems.push(btn);
				}			
		}
		
		menu.show(this,this.changeText,this,menuItems);
	},
	
	changeText: function(itemId) {
		var options = this.getOptions();
		if (options.length) {
			for (var i=0;i<options.length;i++)
				{ 
						var option = options[i];
						if(itemId==option.value) {
                            this.setItemId(option.value);
						    this.setText(option.text + '<span> <img src="resources/images/icons/rm-dropdown.svg" style="margin-left: 5px; margin-bottom: 2px; width: 7px; height: 6px;"></span>');
							break;
						}
				}
		}
		this.fireEvent('sort', itemId);	
	}
	
	
});