Ext.define('RM.controller.ReceiptPhotoPreviewC', {
    extend: 'Ext.app.Controller',
    requires: ['RM.view.ReceiptPhotoPreview'],
    config: {
        refs: {
            receiptPhotoPreview: 'receiptphotopreview',
            photo: 'receiptphotopreview #photo'
        },
        control: {
            'receiptphotopreview #attach': {
                tap: 'attach'
            },
            'receiptphotopreview #retake': {
                tap: 'retake'
            },
            'receiptphotopreview #cancel': {
                tap: 'cancel'
            },
            'receiptphotopreview': {
                show: 'onShow'
            }
        }

    },
	
	showView: function(takePhoto, imgData, cb, cbs){
        this.newPhoto = false;
        
        this.takePhotoOnShow = takePhoto;
        this.imgData = imgData;

        this.cb = cb;
        this.cbs = cbs;                
        
		var view = this.getReceiptPhotoPreview();
		if(!view){
			view = {xtype:'receiptphotopreview'};
        }
		RM.ViewMgr.showPanel(view);		
		
	},	

    onShow: function(){
       
        if(this.imgData){
            this.getPhoto().setSrc(this.imgData); //seems to cause to Get requests to the server
        }
        
        if(this.takePhotoOnShow){
            this.takePhoto();
        }

    },
    
    takePhoto: function(){
        this.newPhoto = true;
        
        var useImgFile = !RM.AppMgr.isSimulator(), me = this;
        try{
            new FileUploadOptions();            
        }
        catch(err){
            useImgFile = false;
        }        
        
        navigator.camera.getPicture(onSuccess, onFail, 
            { 
                quality: 75,
                destinationType: useImgFile ? Camera.DestinationType.FILE_URI : Camera.DestinationType.DATA_URL,                 
                targetWidth: 640,
                targetHeight: 960,
                encodingType: useImgFile ? Camera.EncodingType.JPG : Camera.EncodingType.PNG //Changed from Jpeg to Png as Icenium simulator seems to now only allow selecting Png files
            }
        );
        
        function onSuccess(imgData) {
            me.imgData = useImgFile ? imgData : 'data:image/png;base64,' + imgData;
            me.getPhoto().setSrc(me.imgData);
        }
        
        function onFail(message) {

        }        
        
    },    
    
    cancel: function () {        
        this.cb.call(this.cbs, 'cancel', null);
        RM.ViewMgr.back();
    },
    
    retake: function(){        
        this.takePhoto();
    },
    
    attach: function(){        
        this.cb.call(this.cbs, this.newPhoto ? 'attachnew' : 'attach', this.imgData);
        RM.ViewMgr.back();
    }

});