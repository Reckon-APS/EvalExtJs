Ext.define('RM.util.FormUtils', {
    singleton:true,
    
    makeAllFieldsReadOnly: function(form) {
        form.getFieldsArray().forEach(function(field) {
            if(field.setReadOnly) field.setReadOnly(true);
            if(field.setPlaceHolder) field.setPlaceHolder('');
        });
    }
});