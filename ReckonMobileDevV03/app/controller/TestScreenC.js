Ext.define('RM.controller.TestScreenC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.TestScreen'],
    config: {
        refs: {
            testScreen: 'testscreen',
            testScreenForm: 'testscreen #testScreenForm',
        },
        control: {
            'testscreen': {
                show: 'onShow'
            },            
            'testscreen #save': {
                tap: 'save'
            }
        }
    },
    
    save: function(){
        
        var vals = this.getTestScreenForm().getValues();
        
        console.log(Ext.encode(vals));
    },
    
    onShow: function(){
        
        var vals = {Test1: 'A Text field', /*Quantity:25,*/ ItemPrice: 52625.45, BusPhone: '72367672'}
        
        this.getTestScreenForm().setValues(vals);
        
    }

});