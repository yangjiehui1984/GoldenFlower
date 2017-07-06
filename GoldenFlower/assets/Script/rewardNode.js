cc.Class({
    extends: cc.Component,

    properties: {
        imgArray: [cc.Node],
        btnImg: cc.Node,
        btnText: cc.Label,
        text: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.log("rewardNode");
        this.btnImg.parent.on(cc.Node.EventType.TOUCH_START, function (event){
             this.btnImg.scale = 0.8;
        }, this);

        this.btnImg.parent.on(cc.Node.EventType.TOUCH_END, function (event){
             this.btnImg.scale = 1;
             this.node.active = false;
             cc.log("rewardColse");
            var onFunction = cc.find('Canvas').getComponent('game');
            onFunction.nextPeriod();

        }, this);

        this.btnImg.parent.on(cc.Node.EventType.TOUCH_CANCEL,function(event){

            this.btnImg.scale = 1;

            
            },this);
    },
    
    setContent: function(status, num)
    {
        this.node.active = true;
        var text = "";
        if(status === 0)//未开奖
        {}
        else if(status == 1)//sheng
        {
            text = "中" + num + "豆";
        }
        else if(status == 2)//fu
        {
            text = "今日已有" + num + "人猜中!";
        }
        else if(status == 3)//ping
        {
            text = "返还" + num + "豆";
        }
        else if(status == 4)//未投注
        {}
        else
        {

        }
        this.text.getComponent(cc.Label).string = text;
        if(status >= 1 && status <= 3)//sheng
        {
            for(var i = 0; i < this.imgArray.length; i ++)
            {
                if((status-1) == i)
                {
                    this.imgArray[i].active = true;
                }
                else
                {
                    this.imgArray[i].active = false;
                }
            }
        }
    },

    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
