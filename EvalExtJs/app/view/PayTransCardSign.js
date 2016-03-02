Ext.define('RM.view.PayTransCardSign',{
     extend: 'Ext.Panel',
     xtype: 'paytranscardsign',
     requires: 'RM.component.RMCanvas',
     config: {
        cls: 'rm-whitebg',
        layout: 'vbox', 
        items: [{
            xtype: 'toolbar',
            docked: 'top',            
            items: [{
                    itemId: 'back',
                    ui: 'rm_topbarbuttonleft',
                    icon: 'resources/images/icons/rm-back.svg',
                    iconCls: 'rm-backbtniconcls',
                    width: '2.6em',
                    iconMask: 'true'
                }, {
                    xtype: 'component',
                    itemId: 'title',
                    html: '',
                    cls: 'rm-topbartitle'
                },{
					xtype:'spacer'
				},{
                    text: 'Clear',
                    itemId: 'clear',
                    width: '2.75em',
                    hidden: true,
                    ui: 'rm_topbarbuttonright'
                },{
                    text: 'VOID',
                    itemId: 'void',
                    hidden: true,
                    width: '2.75em',
    				ui: 'rm_topbarbuttonright'
                },{
					xtype:'spacer'
				},{
    				text: 'Details',
    				itemId: 'details', 
                    width: '3.7em',
    				ui: 'rm_topbarbuttonright'
    			}
            ]
        },{
            xtype: 'component',
            docked: 'top',
            height: 60,
            cls: ['rm-colorblack', 'rm-fontsize80', 'rm-p10'],
            html: 'I agree to pay the above total amount to Joe Plumber'
        },{
            xtype: 'rmcanvas',            
            itemId: 'signpanel',  
            placeHolder: 'SIGN HERE',            
            height: 2000,		
            width: 2000		  
            //flex: 1
        },{
			xtype: 'button',
            docked: 'bottom',
            itemId: 'confirm',
            hidden: true,
            cls: ['rm-greenbtn-bg', 'rm-flatbtn'],
			text: 'VENDOR VERIFY SIGNATURE'
		},{
			xtype: 'button',
            docked: 'bottom',
            itemId: 'approve',
            hidden: true,
            cls: ['rm-greenbtn-bg', 'rm-flatbtn'],
			text: 'APPROVE'
		},{
            xtype: 'component',
            docked: 'bottom',
            cls: ['rm-colorblack', 'rm-fontsize80', 'rm-p10'],
            html: 'Daniel Dalto'
        }
         ]
     }
    
});