Ext.define('RM.view.CashBooks', {
    extend: 'Ext.Panel',
    xtype: 'cashbooks',
    requires: 'RM.component.RMList',
    config: {
        layout: 'fit',
        items:[
            {
                xtype: 'toolbar',                
                docked: 'top',
                items: [
                    {
                        xtype: 'component',
                        html: 'Choose book to open',
                        cls: 'rm-topbartitle',
                    }
                ]
            },{
                xtype: 'sortsearchbar',				
                docked: 'top',
                sortfields: [
                    {text: 'Company name',  value: 'orgname'},
                    {text: 'Book name', value: 'bookname'}
                    //,{text: 'Colour',  value: 'colorcode'}
                ]
            },{
                xtype: 'rmlist',
                store: 'CashBooks',
                loadingText: null,  
                emptyText: 'No books found.',
                grouped: true,				
                itemTpl: new Ext.XTemplate(
        
                    '<table width="100%">' +
                    '<tr>' +
                    '<td valign="top" width="20"><div class="{[this.getClass(values)]}" style="background-color:{ColorCode}"></div></td>' +
                    '<td>' +
                    '<div class="rm-nextgrayarrow rm-orgnametext rm-mr5">{OrgName}</div>' +
                    '<div class="rm-booknametext rm-pt5">{BookName}</div>' +
                    '<div class="rm-accesstext rm-pt5">{[this.accessLevel(values)]}</div>' +
                    '</td>' +
                    '</tr>' +
                    '</table>',
                    {
                    getClass: function(values) {
                        if (values.Access.toUpperCase() == 'R') {
                            return 'rm-list-readonly-cashbook'; 
                        }
                        else {
                            return 'rm-list-cashbook';
                        }
                    },
                    accessLevel: function(values) {                                                                
                        if (values.Access.toUpperCase() == 'R') {
                            return 'READ ONLY' + (values.StatusText ? ' - ' + values.StatusText : '');
                        }
                        else {
                            return values.StatusText;
                        }
                    }
                })				
				
            }
        ] 
    }
});