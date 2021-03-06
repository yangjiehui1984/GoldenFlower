cc.Class({
    extends: cc.Component,

    properties: {
        
        rewardFlyNodeSkinArray:
        {
            default: [],
            type: [cc.Node]
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    
    setSkin:function(index)
    {
        for(var i = 0; i < this.rewardFlyNodeSkinArray.length; i ++)
        {
            if(index == i)
            {
                this.rewardFlyNodeSkinArray[i].active = true;
            }
            else
            {
                this.rewardFlyNodeSkinArray[i].active = false;
            }

        }
    },
    
    flyRewardAction: function(position1, position2)
    {
        /*
        let moveto;
        let dt = 0.2;
        this.node.stopAllActions();
        this.node.setPosition(position1);
        moveto = cc.moveTo(dt,position2);
        //let ac1 = cc.scaleTo(dt, 1.0, 1.0);
            
        //var obj = new Object();
        //obj.target = self;

            
        this.node.runAction(cc.sequence(moveto));
        */
        this.node.stopAllActions();
        this.node.setPosition(position1);
        this.node.runAction(cc.moveTo(0.2, position2));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
