
//按钮标识
var EbuttonTag = cc.Enum({

  eChip20: 0,
  eChip50: 1,   
  eChip100: 2,      
  eChip500:3, 
  eChip1000:4, 
  eClear : 5,  
  eHistoryList: 6,

});



cc.Class({
    extends: cc.Component,

    properties: {
        scaleFlag:true,
        buttonTag:0,
        parentNode: cc.Node,//父节点(为了结局点击区域缩后 事件不响应 统统加了父节点来处理事件，对子节点缩放 2017-04-10 PM:340)
        
    },


    // use this for initialization
    onLoad: function () {

        // var timeCallback = function (dt)
        {
            if(this.parentNode)
            {
                this.parentNode.on(cc.Node.EventType.TOUCH_START,function(event){
                if(this.scaleFlag)
                {
                   this.node.scale = 0.8;
                }

                },this); 
            }

        
        if(this.parentNode)
        {
            this.parentNode.on(cc.Node.EventType.TOUCH_END,function(event){
            if(this.scaleFlag)
            {
                this.node.scale = 1;
            }
            var onFunction = cc.find('Canvas').getComponent('game');
            onFunction.btnActionCallBack(this.buttonTag);

           
            },this);
        }

        if(this.parentNode)
        {
            this.parentNode.on(cc.Node.EventType.TOUCH_CANCEL,function(event){
            if(this.scaleFlag)
            {
                this.node.scale = 1;
            }
            
            },this);
        }

            
        }
        
    },


});

module.exports = {
    EbuttonTag : EbuttonTag,
};



