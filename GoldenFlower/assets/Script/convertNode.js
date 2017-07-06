
var NetData = require("NetData");

cc.Class({
    extends: cc.Component,

    properties: {
        
        flyChipNode: cc.Prefab,
        
        homePosition:
        {
            default: [],
            type: [cc.Vec2]
        },
        
        targetLocation1:
        {
            default: [],
            type: [cc.Vec2],
        },
        
        targetLocation2:
        {
            default: [],
            type: [cc.Vec2],
        },
        
        flyChipNodeArray:{
            default: [],
            type: [cc.Node]
        },
        
        //rewardFlyNode: cc.Prefab,
        
        rewardFlyNodeTargetLocation:
        {
            default: [],
            type: [cc.Vec2],
        },
        
        rewardFlyNodeHomePosition: cc.Vec2,
        rewardFlyNodeInistantArray:{
            default : [],
            type : cc.Node
        },

        markFlyRewardCnt: 0,
    },
    

    // use this for initialization
    onLoad: function () {

    },
    
    chipFlyAction: function(chipNum, chipIndex, betId, flag, powerTarget)
    {
        var netData = NetData.NetData.getInst();
         var homep = this.homePosition[chipIndex];
            
            var targetP = null;
            if(netData.timeFlag == 1)
            {
                targetP = this.targetLocation1[betId];
            }
            else
            {
                targetP = this.targetLocation2[betId];
            }
            
            var flyNode = this.getFlyChipNode();
            var flyNodeJS = flyNode.getComponent("flyChipNodePre");

            flyNodeJS.setSkinWithTag(chipIndex);
            flyNodeJS.setMoney(chipNum);
            flyNodeJS.chipFlyAction(homep, targetP, flag, flyNode, powerTarget, this, this.finishedCallback);
            
    },
    
    getFlyChipNode: function()
    {
        var flyNode = null;
        if(this.flyChipNodeArray.length > 0)
        {
            flyNode = this.flyChipNodeArray.shift();
            flyNode.active = true;
            return flyNode;
        }
        
        flyNode = cc.instantiate(this.flyChipNode);
        this.node.addChild(flyNode);
        flyNode.active = true;
        return flyNode;
        
    },
    
    setFlyChipNode: function(flynode)
    {
        this.flyChipNodeArray.push(flynode);
        flynode.active = false;
    },
    
    finishedCallback: function(target, object)
    {
        var powerTarget = object.powerTarget;
        var flag = object.flag;
        var self = object.target;
        var flynode = object.flyNode;
        
        self.setFlyChipNode(flynode);
        powerTarget.flyChipNodeFinished(powerTarget, flag);
        
        object = null;
  
    },
    
    //index: 0负 1胜  2平
    flyRewardNode:function (index, positionIndex)
    {
        var flyNode = this.rewardFlyNodeInistantArray[positionIndex - 2];
        // if(this.rewardFlyNodeInistantArray.length)
        // {
        //     flyNode = this.rewardFlyNodeInistantArray.shift();
        // }
        // else
        // {
        //     flyNode = cc.instantiate(rewardFlyNode);
        //     this.node.addChild(flyNode);
        //     this.rewardFlyNodeInistantArray.push(flyNode);
        // }
            
        flyNode.active = true;
        var flyNodeJS = flyNode.getComponent("flyRewardNodePre");
        flyNodeJS.setSkin(index);
        var p1 = this.rewardFlyNodeHomePosition;
        var p2 = this.rewardFlyNodeTargetLocation[positionIndex - 2];
        flyNodeJS.flyRewardAction(p1, p2);
    },
    
    
    flyRewardActionFinished: function()
    {
        /*
        this.markFlyRewardCnt ++;
        if(this.markFlyRewardCnt == 4)
        {
            for(var i = 0; i < this.rewardFlyNodeInistantArray.length; i ++)
            {
                this.rewardFlyNodeInistantArray[i].active = false;
            }
        }
        */
        for(var i = 0; i < this.rewardFlyNodeInistantArray.length; i ++)
        {
            this.rewardFlyNodeInistantArray[i].active = false;
        }

    }
    
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
