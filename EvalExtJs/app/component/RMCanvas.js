Ext.define('RM.component.RMCanvas', {
    extend: 'Ext.Component',    
    xtype: 'rmcanvas',
    template: [
        {
            tag: 'canvas', //this will create a <canvas> in html
            reference: 'canvas', //this will be use in the initialize
            className: Ext.baseCSSPrefix + 'rmcanvas'            
        }
    ],
    
    initialize: function() {
        this.callParent(arguments);
        this.isCanvasEmpty = true;        
        this.toolbarHeight = 47;	// 47px is the toolbar height 
        this.canvas.on({
            //tap: 'onTap',
            touchstart: 'onTouchStart',
            touchend: 'onTouchEnd',
            touchmove: 'onTouchMove',
            scope: this
        });       
		  
        this.addListener('painted', function(){           
            var ctx = this.canvas.dom.getContext("2d");           
            var imgData=ctx.getImageData(0,0,this.canvas.dom.width,this.canvas.dom.height);       
            this.canvas.dom.height = this.bodyElement.dom.offsetHeight;
        	this.canvas.dom.width = this.bodyElement.dom.offsetWidth;   
            ctx.putImageData(imgData, 0, 0);
            this.showPlaceHolder();                 
        },this); 
        
        this.addListener('rmcanvascleared', function(){         
            this.isCanvasEmpty = true;  
        	this.resetCanvas();
        	this.showPlaceHolder();     
        },this); 
        
        this.lastPt = null;      
    }, 
    
    setReadOnlyMode: function(){
        this.canvas.clearListeners();       
    },

    onTap:function(e) {
        //this.fireEvent('tap',this,e);
    },
    
    onTouchStart:function(e) {
        e.preventDefault();
        // Terminate touch path
        this.lastPt=null;    
    },
    
    onTouchEnd:function(e) {       
        e.preventDefault();
        if(!this.isCanvasEmpty){
        	this.fireEvent('rmcanvaspainted');    
        }        
    },
    
    onTouchMove:function(e) {          
        e.preventDefault();        
        if(this.isCanvasEmpty && this.lastPt!==null){
            this.resetCanvas();            
        }  
        var x1 = e.touches[0].pageX - e.target.offsetLeft;        
        var y1 = e.touches[0].pageY - e.target.offsetTop - this.toolbarHeight - 60;  //60 is height of the title text component
        var ctx = this.canvas.dom.getContext("2d");
        ctx.lineWidth = 2;
        if(this.lastPt!==null) {
              ctx.beginPath();          
              ctx.moveTo(this.lastPt.x, this.lastPt.y);
              ctx.lineTo( x1, y1);          
              ctx.stroke();
              this.isCanvasEmpty = false;  
        }
        this.lastPt = {x: x1, y: y1};      
    },
    
    showPlaceHolder: function(){
        if(this.isCanvasEmpty && this.config.placeHolder){
            var ctx = this.canvas.dom.getContext("2d");
            ctx.fillStyle = "#969696";
            ctx.font = '28px open sans';
            ctx.textBaseline = 'bottom';
            ctx.fillText(this.config.placeHolder, 90, 70);
        }        
    },
    
    resetCanvas: function(){
        this.canvas.dom.getContext("2d").clearRect(0, 0, this.canvas.dom.width, this.canvas.dom.height);
    },
    
    clearCanvas: function(){      
        this.fireEvent('rmcanvascleared');          
    }
});