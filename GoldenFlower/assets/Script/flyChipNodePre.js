
var ESkinTag = cc.Enum({

  eChip20: 0,
  eChip50: 1,   
  eChip100: 2,      
  eChip500:3, 
  eChip1000:4, 
  eGaryChip : 5,  
  eOtherChip: 6,

});


cc.Class({
    extends: cc.Component,

    properties: {
        //20 50 100 500 1000 gray other
        chipSkinNodeArray: {
            default: [],
            type: [cc.Node]
        },
        moneyLabel:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

    },
    
    /**
     * 设置筹码皮肤
     * @param tag 对应的筹码编号(20 50 100 500 1000 gray other) eg: 0 1 2 3 4 5 6
     */
    setSkinWithTag: function(tag)
    {
        
        for(var i = 0; i < this.chipSkinNodeArray.length; i ++)
        {
            if(tag == i)
            {
                this.chipSkinNodeArray[i].activate = true;
            }
            else
            {
                this.chipSkinNodeArray[i].activate = false;
            }
        }
                

    },
    
    /**
     * 设置投注金额
     * @param chipMoney 对应的金额
     */
    setMoney: function(chipMoney)
    {
        if(chipMoney>0)
        {
            this.moneyLabel.getComponent(cc.Label).string = chipMoney;
        }
        else
        {
            this.moneyLabel.getComponent(cc.Label).string = "";
        }
    },

    /**
     * 动画飞
     * @param position1 源位置
     * @param position2 目标位置
     * @param flag  飞回来还是飞回去
     * @param flyNode 飞过程的筹码对象
     * @param self 飞到的目标对象
     * @param callFun 回调的指针
     */
    chipFlyAction: function(position1, position2, flag, flyNode, powerTarget, self,callFun)
    {
        let moveto;
        let dt = 0.2;
        this.node.stopAllActions();
        if(flag)
        {
            this.node.setPosition(position1);
            moveto = cc.moveTo(dt,position2);
        }
        else
        {
            this.node.setPosition(position2);
            moveto = cc.moveTo(dt,position1);
        }
         
        let ac1 = cc.scaleTo(dt, 1.0, 1.0);
            
        var obj = new Object();
        obj.powerTarget = powerTarget;
        obj.flyNode = flyNode;
        obj.target = self;
        obj.flag = flag;
            
        this.node.runAction(cc.sequence(moveto, cc.callFunc(callFun, self, obj)));
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = {
    ESkinTag : ESkinTag,
};
