
var EbuttonTag = cc.Enum({

  eSkinFresh: 0,
  eSkinOK: 1,   
  eSkinCannel: 2,      
  eSkin3:3, 
  eSkin4:4, 
  eSkin5 : 5,  
  eSkin6: 6,

});
cc.Class({
    extends: cc.Component,

    properties: {
        leftButton: cc.Node,
        rightButton: cc.Node,
        title: cc.Label,
        leftSkinArray: {
            default: [],
            type: [cc.Node]
        },
        leftTitle: cc.Label,
        rightSkinArray: {
            default: [],
            type: [cc.Node]
        },
        rightTitle: cc.Label,
        typeAction:0,

    },

    // use this for initialization
    onLoad: function () {
        this.leftButton.on(cc.Node.EventType.TOUCH_START, function (event){
             this.leftButton.scale = 0.8;
        }, this);

        this.leftButton.on(cc.Node.EventType.TOUCH_END, function (event){
             this.leftButton.scale = 1;
            var gameFun = cc.find('Canvas').getComponent('game');
            gameFun.errorDialogCallback(this.typeAction, 1);
            
        }, this);
        
        this.leftButton.on(cc.Node.EventType.TOUCH_CANCEL, function (event){
             this.leftButton.scale = 1;
        }, this);
        
        this.rightButton.on(cc.Node.EventType.TOUCH_START, function (event){
             this.rightButton.scale = 0.8;
        }, this);

        this.rightButton.on(cc.Node.EventType.TOUCH_END, function (event){
             this.rightButton.scale = 1;
            var onFunction = cc.find('Canvas').getComponent('game');
            onFunction.errorDialogCallback(this.typeAction, 2);
            
        }, this);
        
        this.rightButton.on(cc.Node.EventType.TOUCH_CANCEL, function (event){
             this.rightButton.scale = 1;
        }, this);
        
    },
    
    showDialog:function(title, buttonType)
    {
        this.typeAction = buttonType;
        this.node.active = true;
        this.resetzIndexZreo();
        this.title.string = title;
        
        if(buttonType === 0)//刷新
        {
            this.leftButton.x = 0;
            this.leftButton.y = 0;
            this.rightButton.active = false;
            this.leftSkinArray[0].zIndex = 20;
            this.leftIndex = 0;
            this.rightIndex = -1;
            
        }
        else if(buttonType == 1)//等等再走 不玩了
        {
            this.leftButton.x = -160;
            this.leftButton.y = -100;
            this.rightButton.active = true;
            this.leftSkinArray[1].zIndex = 20;
            this.rightSkinArray[1].zIndex = 20;
        }
        else if(buttonType == 2)//
        {
            this.leftButton.x = -160;
            this.leftButton.y = -100;
            this.rightButton.active = true;
            this.leftSkinArray[2].zIndex = 20;
            this.rightSkinArray[2].zIndex = 20;
        }
    },
    
    hideDialog:function()
    {
        this.node.active = false;
    },
    
    resetzIndexZreo:function()
    {
        for(var i = 0; i < this.leftSkinArray.length; i ++)
        {
            this.leftSkinArray[i].zIndex = 0;
        }
        
        for(var j = 0; j < this.rightSkinArray.length; j ++)
        {
            this.rightSkinArray[j].zIndex = 0;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
