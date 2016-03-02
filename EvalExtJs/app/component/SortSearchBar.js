Ext.define('RM.component.SortSearchBar', {
    extend: 'Ext.Toolbar',    
    xtype: 'sortsearchbar',
	requires: ['RM.component.DropdownButton', 'Ext.field.Search'],
    
    config: {
		ui: 'rm-sortsearch-topbar',
		control: {
			'dropdownbutton': {
				sort: 'onSort'
			},
			'textfield': {			
				keyup: 'onSearchKeyUp',
				clearicontap: 'onClearIconTap'
			},
			'button': {			
				tap: 'onSearchToggle'
			}
		}
    },
    
	
    initialize: function() {
		this.callParent(arguments);
		
		this.add([{
				xtype: 'dropdownbutton',				
				width: 230,				
				options: this.config.sortfields
			},{
				xtype: 'textfield',
                itemId: 'searchText',
				hidden: true,
				width: '80%',
                clearIcon: false
			},{
				xtype: 'spacer'				
			},{
				xtype: 'button',                
                margin: 0,
				ui: 'plain', 
                iconCls: 'rm-sortsearchbtn',
                icon: 'resources/images/icons/rm-search.svg'				
			}
		]);

    },
	
	onSort: function(val){
		this.fireEvent('sort', val);	
	},
	
	onSearchKeyUp: function(sf){		
		this.fireEvent('search', sf.getValue());	
	},
	
	onClearIconTap: function(){
		this.fireEvent('searchclear');
	},

    setSearch: function(sortVal){
        //alert('setSearch ' + sortVal);
        this.getComponent(0).changeText(sortVal);
    },
	
	onSearchToggle: function(){
		var search = this.getComponent(1);       

        if(search.isHidden())
        {
            this.showSearch();
        }
        else 
        {   
            this.hideSearch();
        }
        
        
	},
    
    showSearch: function(){   
        var search = this.getComponent(1), btn = this.getComponent(3), sort = this.getComponent(0);        
        btn.setIcon('resources/images/icons/rm-cross.svg');        
        sort.setHidden(true);
        search.setHidden(false);
        if(Ext.os.is.Android) {        
            setTimeout(function() { 
                search.focus();
                RM.ViewMgr.showKeyPad();
            }, 
            500);
        }
        else {
            search.focus();
        }
    },
        
    hideSearch: function(supressEvent){
        var search = this.getComponent(1), btn = this.getComponent(3), sort = this.getComponent(0);
        search.blur();
        search.setHidden(true);
        if(!supressEvent && search.getValue() != ''){
            this.fireEvent('searchclear'); 
        }           
        search.reset(); 
        
        btn.setIcon('resources/images/icons/rm-search.svg');        
        sort.setHidden(this.config.sortfields == null);
    }

});