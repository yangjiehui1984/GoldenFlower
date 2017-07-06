var NetData = require("NetData");

cc.Class({
    extends: cc.Component,

    properties: {
        
        selfChip1SkineNode:{
            default: [],
            type: [cc.Node]
        },
        
        selfChip2SkineNode:{
            default: [],
            type: [cc.Node]
        },
        
        pukeHighLightNodeArray: {
            default: [],
            type: [cc.Node]
        },
        
        betHighLightLayer:cc.Node,

        
        selfChipNode:{
            default: [],
            type: [cc.Node]
        },
        
        othersPositionNode:cc.Node,
        
        pokersNode:{
            default: [],
            type: [cc.Node]
        },
        
        noPokersNode:{
            default: [],
            type: [cc.Node]
        },
        
        historysListNode:{
            default: [],
            type: [cc.Node] 
        },
        
        oddsLabel:cc.Node,
        
        pokerNameNode:cc.Node,
        
        pokerNoTouchLayer:cc.Node,
        
        options : "",//选项说明
        //势力
        powerFlag : true,//是否势力
        powerId : 0,//势力id
        pockers : [],//牌型
        historys : [],//胜负走势

        //投注项
        betFlag : true,//是否投注项
        betId : 0,//投注项id
        odds1 : 1,//一阶段赔率
        odds2 : 1,//二阶段赔率
        oddType : 0,//赔率变化类型  0-降低  1-上升  2-不变
        betStatus : 1,//是否可投注, 1-可投 0-不可投
        betNumTotal1 : 0,//第一阶段总投注额
        betNumTotal2 : 0,//第二阶段投注总额
        betNum  : 0,//单次投注额，用于记录投注批次，失败的要退回来
        betList : [],//最后一次投注列表，用于投注，把所有投注项的这个数组收集起来就是真正的投注列表
        chipColor : 0,//筹码颜色  0-  1-  2-  3-
        ligthFlag : false,//投注项是否高亮

        //结算状态
        win : -1, //-1: 未开奖 1:胜利，0:负，2:平
        type : -1,//-1: 未开奖 0:散牌，1:散牌，2:对子，3：顺子，4:同花，5:同花顺，6:豹子
        pokerLight : [],//扑克高亮 空为全不亮， [0, 1, 2]全亮， [0, 2]亮两个

        //飞筹码
        chipPositions : [],//楼下5个筹码的相对位置
        playerPositions : [],//玩家头像相对位置，包括自己的（自己的筹码飞回）
        currentChipIndex: 0,//记录当前投注额的index
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event){

        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event){
            cc.log("TOUCH_END!!!");
            if(this.betFlag && this.betStatus){
                //投注操作，回调到game去判断登录状态、余额等
                 var onFunction = cc.find('Canvas').getComponent('game');

                 if(onFunction.clearingFlag){
                    onFunction.showToast("正在为您撤单，请稍后下单");
                 }
                 else{
                    onFunction.powerBet(this.addselfChip, this);
                 }
                 
            }
        }, this);
    },

    /**
     * 重置info，下一期开始时调用
     */
    resetInfo : function(){
        this.pockers = [];
        this.oddType = 2;
        this.betStatus = 1;
        this.betNumTotal1 = 0;
        this.betNumTotal2 = 0;
        this.betNum = 0;
        this.betList = [];
        this.win = -1;
        this.types = -1;
        this.pokerLight = [];
        this.ligthFlag = false;

        //清空桌面筹码
        if(this.betFlag){
            this.selfChipNode[0].active = false;
            this.selfChipNode[1].active = false;
        }

        for(var j = 0; j < this.noPokersNode.length; j ++)
        {
            this.noPokersNode[j].active = true;
            this.noPokersNode[j].setScale(1, 1);
        }
        
        if(this.pokersNode.length)
        {
            this.pokersNode[2].y = -161;
            this.noPokersNode[2].y = 0; 
        }

    },

    /**
     * 更新选项info
     * @param status 100-初始化   101-投注  102-清空投注  103-结算  104-获取二阶段数据
     */
    updataInfo : function(status){
        var netData = NetData.NetData.getInst();
        
        if(status == 100){
            var initData = netData.initData;
            if(this.powerFlag){
                if(initData.pockerList){
                    for(let i = 0; i < initData.pockerList.length; ++i){
                        if(this.powerId == initData.pockerList[i].powerId){
                            //cc.log("this.powerId ", this.powerId);
                            if(initData.pockerList[i].pockers){
                                this.pockers = initData.pockerList[i].pockers;
                                //cc.log("this.pockers", this.pockers);
                            }
                            
                            this.historys = initData.pockerList[i].historys;
                            break;
                        }
                    }
                }
            }

            if(this.betFlag){
                for(let i = 0; i < initData.oddsList.length; ++i){
                    if(this.betId == initData.oddsList[i].id){
                        cc.log("odds2 ", initData.oddsList[i].odds2);
                        this.options = initData.oddsList[i].option;
                        this.odds1 = initData.oddsList[i].odds1;

                        if(initData.oddsList[i].odds2){
                            this.odds2 = initData.oddsList[i].odds2;
                        }
                        else{
                            this.odds2 = 0;
                        }
                        
                        this.betStatus = initData.oddsList[i].status;
                        break;
                    }
                }

                //投注额,用于恢复
                if(initData.bets){
                    for(let i = 0; i < initData.bets.length; ++i){
                        if(initData.bets[i].id == this.betId){
                            if(initData.bets[i].timeFlag == 1){
                                this.betNumTotal1 = initData.bets[i].totalBet;
                            }
                            else{
                                this.betNumTotal2 = initData.bets[i].totalBet;
                            }
                        }
                    }
                }
            }
        }
        else if(status == 101){
            
        }
        else if(status == 102){
            if(netData.timeFlag == 1){
                this.betNumTotal1 = 0;
            }
            else{
                this.betNumTotal2 = 0;
            }

            // betList = [];
        }
        else if(status == 103){
            var rewardData = netData.rewardData;
            if(this.powerFlag){
                var lottery = rewardData.lottery;
                //var idstring = "power"+ this.powerId;

               // var pockers = lottery.cache.idstring.pockers;
                //this.win = lottery.cache.idstring.win;
                //this.types = lottery.cache.idstring.types;
                //this.historys.pop();
               // this.historys.unshift(this.win);
                //this.pockers.push(pockers);


                
                
                for(let i = 0; i < lottery.cache.length; ++i){
                    if(lottery.cache[i].powerId == this.powerId){
                        this.win = lottery.cache[i].win;
                        this.historys.pop();
                        this.historys.unshift(this.win);

                        this.type = lottery.cache[i].type;
                        this.pockers.push(lottery.cache[i].pockers[0]);
                        //cc.log("103 pockers length is ", this.pockers.length);
                        //牌型高亮
                        this.pokerLight = [];
                        if(this.type === 0 || this.type == 1){
                            //散牌，都不亮
                        }
                        else if(this.type == 2){
                            //对子
                            if(this.pockers[0].val == this.pockers[1].val){
                                this.pokerLight = [0, 1];
                            }
                            else if(this.pockers[0].val == this.pockers[2].val){
                                this.pokerLight = [0, 2];
                            }
                            else if(this.pockers[1].val == this.pockers[2].val){
                                this.pokerLight = [1, 2];
                            }

                            /*
                            //对子投注项高亮
                            if(this.betId == 5){
                                this.ligthFlag = true;
                            }
                            */
                        }
                        else if(this.type == 6){
                            this.pokerLight = [0, 1, 2];
                            /*
                            //三同号投注项高亮
                            if(this.betId == 6){
                                this.ligthFlag = true;
                            }
                            */
                        }
                        else{
                            this.pokerLight = [0, 1, 2];
                            /*
                            //其他牌型投注项高亮
                            if(this.betId == 7){
                                this.ligthFlag = true;
                            }
                            */
                        }
                        break;
                    }
                }
            }


            if(this.betFlag){
                for(let i = 0; i < rewardData.oddsList.length; ++i){
                    if(this.betId == rewardData.oddsList[i].id){
                        //cc.log("odds2 ", rewardData.oddsList[i].odds2);
                        this.options = rewardData.oddsList[i].option;
                        this.odds1 = rewardData.oddsList[i].odds;
                        //this.odds2 = rewardData.oddsList.oddsMetaDatas[i].odds2;
                        this.betStatus = 1;
                        break;
                    }
                }
            }

        }
        else if(status == 104){
            var secondData = netData.secondData;
            if(this.powerFlag){
                for(let i = 0; i < secondData.pockerList.length; ++i){
                    if(this.powerId == secondData.pockerList[i].powerId){
                        this.pockers = secondData.pockerList[i].pockers;
                        break;
                    }
                }
            }

            if(this.betFlag){
                for(let i = 0; i < secondData.oddsList.length; ++i){
                    if(this.betId == secondData.oddsList[i].id){
                        this.options = secondData.oddsList[i].option;
                        //这里判断一下赔率是变大变小
                        this.odds1 = secondData.oddsList[i].odds1;
                        if(secondData.oddsList[i].odds2){
                            this.odds2 = secondData.oddsList[i].odds2;
                        }
                        else{
                            this.odds2 = 0;
                        }
                        
                        if(this.odds2 > this.odds1){
                            this.oddType = 1;
                        }
                        else if(this.odds2 < this.odds1){
                            this.oddType = 0;
                        }
                        else{
                            this.oddType = 2;
                        }

                        this.betStatus = secondData.oddsList[i].status;
                        break;
                    }
                }
            }
        }
    },
    
    //更新UI
    updataUI:function(status)
    {
        if(this.powerFlag)
        {
                // for(var j = 0; j < this.noPokersNode.length; j ++)
                // {
                //     this.noPokersNode[j].active = true;
                // }

                var netData = NetData.NetData.getInst();

                    for(let i = 0; i < this.pockers.length; i ++)
                    {
                            //this.noPokersNode[i].active = false;
                            var pokerNum = this.pokersNode[i].getChildByName("num").getComponent(cc.Label);
                            var num = "";
                            if(this.pockers[i].val == 1)
                            {
                                num = "A";
                            }
                            else if(this.pockers[i].val == 11)
                            {
                                num = "J";
                            }
                            else if(this.pockers[i].val == 12)
                            {
                                num = "Q";
                            }
                            else if(this.pockers[i].val == 13)
                            {
                                num = "K";
                            }
                            else
                            {
                                num = this.pockers[i].val;
                            }
                            //cc.log("pocker num is ", num);
                            pokerNum.string = num;
                
                            var pokerType = this.pokersNode[i].getChildByName("type").getComponent(cc.Label);
                            var color = "";
                            switch(this.pockers[i].color)
                            {
                                case 1:
                                {
                                    color = "红桃";
                                }
                                break;
                                case 2:
                                {
                                    color = "方片";   
                                }
                                break;
                                case 3:
                                {
                                    color = "黑桃";
                                }
                                break;
                                case 4:
                                {
                                    color = "梅花";
                                }
                                break;
                            }
                            pokerType.string = color;
                            //cc.log("pocker color is ", color);
                            var self = this;
                            //跑一个翻牌的动画
                            if(i <= 1){
                                
                                if(this.noPokersNode[i].active){
                                    this.noPokersNode[i].runAction(cc.sequence(cc.scaleTo(0.2, 0, 1), cc.callFunc(function(){self.noPokersNode[i].active = false;})));
                                    this.pokersNode[i].runAction(cc.sequence(cc.scaleTo(0.2, 0, 1), cc.scaleTo(0.2, 1)));  
                                }
                          
                            }
                            else{
                                //开奖阶段，要一个一个出结果，根据powerid计算时机
                                let delay = (this.powerId - 1) * 1.0;
                                this.scheduleOnce(function(){
                                    if(self.noPokersNode[i].active){
                                        self.noPokersNode[i].runAction(cc.sequence(cc.moveTo(0.4, cc.v2(0, -161)), cc.callFunc(function(){self.noPokersNode[i].y = 0;})));
                                        self.pokersNode[i].runAction(cc.sequence(cc.moveTo(0.4, cc.v2(0, 0)), cc.callFunc(self.putStampOnAction, self, self)));  
                                    }
                                }, delay);
                            }
                } 


        }
        
            for(var i = 0; i < this.pokerLight.length; i ++)
            {
                let index = this.pokerLight[i];
                //this.pukeHighLightNodeArray[index].active = true;
            }
            
            if(this.betFlag)
            {
                var netData = NetData.NetData.getInst();
                if(netData.timeFlag == 1)
                {
                    this.oddsLabel.getComponent(cc.Label).string = this.odds1 + "倍";
                    this.oddsLabel.color = new cc.Color(255, 255, 255);
                }
                else
                {
                    this.oddsLabel.getComponent(cc.Label).string = this.odds2 + "倍";
                    if(this.oddType == 0)
                    {
                        this.oddsLabel.color = new cc.Color(255, 0, 0);
                    }
                    else if(this.oddType == 1)
                    {
                        this.oddsLabel.color = new cc.Color(45, 67, 100);
                    }
                    else
                    {
                        this.oddsLabel.color = new cc.Color(255, 255, 255);
                    }
                    
                    
                }
            }
            
            if(this.powerFlag && this.powerId != 1)
            {
                for(var i = 0; i < this.historysListNode.length; i ++)
                {
                    var historyIconNode = this.historysListNode[i];
                    if(this.historys[i] == 1)//胜
                    {
                        historyIconNode.color = new cc.Color(255, 0, 0);
                    }
                    else if(this.historys[i] == 0)//负
                    {
                        historyIconNode.Color = new cc.Color(45, 67, 100);
                    }
                    else//平
                    {
                        historyIconNode.Color = new cc.Color(255, 255, 255);
                    }
                }
            }

       
        if(this.betFlag && !this.powerFlag){

                if(this.betStatus == 1)
                {
                    this.pokerNoTouchLayer.active = false;
                }
                else
                {
                    this.pokerNoTouchLayer.active = true;
                }
                
                if(this.ligthFlag == true)//中奖结果高亮
                {
                    this.betHighLightLayer.active = true;
                }
                else
                {
                    this.betHighLightLayer.active = false;
                }

            }
        
    },
    
    //飞结果，盖戳
    putStampOnAction: function(target, self)
    {
        if(self.powerId == 1){
            return;
        }
        //cc.log("flyStamp!!!");
        var netData = NetData.NetData.getInst();
        var rewardData = netData.rewardData;
        var convertNode = cc.find("Canvas/convertNode");
        var convertNodeJS = convertNode.getComponent("convertNode");
        convertNodeJS.flyRewardNode(self.win, self.powerId);

        if(self.powerId == 2){
            //10s收回
            self.scheduleOnce(self.getback, 5);
        }
    },
    
    getback: function()
    {
        var gameJS = cc.find("Canvas").getComponent("game");
        gameJS.rewardFlyFinishedCallback();
    },

    /**
     * 初始化筹码
     */
    initSelfChip : function(timeFlag, chipNum){
        this.selfChipNode[timeFlag - 1].active = true;
        this.selfChipNode[timeFlag - 1].zIndex = 500;
        var label = this.selfChipNode[timeFlag - 1].getChildByName("Label").getComponent(cc.Label);
        label.string = chipNum;
    },

    /**
     * 恢复筹码飞回
     * @param chipNum 筹码量
     */
    resumeSelfChip : function(chipNum){
        var netData = NetData.NetData.getInst();
        //计算哪个筹码最接近chipNum
        let chipIndex = 0;
        for(let i = 0; i < netData.initData.betList.length; ++i){
            if(chipNum >= netData.initData.betList[i]){
                chipIndex = i;
            }
        }

        //跑动画，目标位置是个固定值，一阶段和二阶段分别固定一个筹码位置
        //跑完动画后，更新投注额的label
        if(this.betFlag)
        {
            var convertNode = cc.find("Canvas/convertNode");
            var convertNodeJS = convertNode.getComponent("convertNode");
            convertNodeJS.chipFlyAction(chipNum, chipIndex, this.betId-1, true, self);
        }
    },
    
    /**
     * 自己投注飞筹码
     * @param chipIndex 楼下筹码的index
     */
    addselfChip : function(chipIndex, self){
        self.currentChipIndex = chipIndex;
        var netData = NetData.NetData.getInst();
        var bet = netData.initData.betList[chipIndex];

        //投注总额变化
        if(netData.timeFlag == 1){
            self.betNumTotal1 += bet;
        }
        else{
            self.betNumTotal2 += bet;
        }
        

        //检查是否已经存在该类型筹码
        var exitFlag = false;
        for(let i = 0; i < self.betList.length; ++i){
            if(self.betList[i].bet == bet){
                self.betList[i].num++;
                exitFlag = true;
                break;
            }
        }

        if(!exitFlag){
            var obj = new Object();
            obj.id = self.betId;
            obj.bet = bet;
            obj.num = 1;
            if(netData.timeFlag == 1){
                obj.odds = self.odds1;
            }
            else{
                obj.odds = self.odds2;
            }
            
            self.betList.push(obj);
        }

        //跑动画，目标位置是个固定值，一阶段和二阶段分别固定一个筹码位置
        //跑完动画后，更新投注额的label
        if(self.betFlag)
        {
            var convertNode = cc.find("Canvas/convertNode");
            var convertNodeJS = convertNode.getComponent("convertNode");
            convertNodeJS.chipFlyAction(bet, chipIndex, self.betId-1, true, self);
            
        }

    },
    
    flyChipNodeFinished: function(sender, flag)
    {
        var flag = flag;
        var self = sender;
         var netData = NetData.NetData.getInst();
         var index = netData.timeFlag - 1;
         if(flag)
         {
            self.selfChipNode[index].active = flag;
            self.selfChipNode[index].zIndex = 500;
            var label = self.selfChipNode[index].getChildByName("Label").getComponent(cc.Label);
            if(netData.timeFlag == 1)
            {
                label.string = self.betNumTotal1;
            }
            else
            {
                label.string = self.betNumTotal2;
            }
            
            self.setSkinWithTag(self.currentChipIndex);
         }

    },

        /**
     * 设置筹码皮肤
     * @param tag 对应的筹码编号(20 50 100 500 1000 gray other) eg: 0 1 2 3 4 5 6
     */
    setSkinWithTag: function(tag)
    {
        var netData = NetData.NetData.getInst();
        if(netData.timeFlag == 1)
        {
            for(var i = 0; i < this.selfChip1SkineNode.length; i ++)
            {
                if(tag == i)
                {
                    this.selfChip1SkineNode[i].activate = true;
                }
                else
                {
                    this.selfChip1SkineNode[i].activate = false;
                }
            } 
        }
        else 
        {
            for(var i = 0; i < this.selfChip1SkineNode.length; i ++)
            {
                if(tag == i)
                {
                    this.selfChip1SkineNode[i].activate = true;
                }
                else
                {
                    this.selfChip1SkineNode[i].activate = false;
                }
            }
        }

                

    },

    
    /**
     * 自己筹码飞回
     * @param chipNum  飞回的筹码数额
     */
    reduceSelfChip : function(){
        var netData = NetData.NetData.getInst();
        if(netData.timeFlag == 1){
            this.betNumTotal1 -= this.betNum;
        }
        else{
            this.betNumTotal2 -= this.betNum;
        }
        
        var ser = null;
        var totalMoney = "";
        if(netData.timeFlag == 1)
        {
            ser = this.selfChipNode[0];
            totalMoney = this.betNumTotal1;
        }
        else
        {
            ser = this.selfChipNode[1];
            totalMoney = this.betNumTotal2;
        }
        if(ser.active)
        {
            var flag = false;
            if(totalMoney>0)
            {
                flag = true;
            }
            //先隐藏
            ser.active = flag;
            ser.zIndex = 500;
            var label = ser.getChildByName("Label").getComponent(cc.Label);
            label.string = totalMoney;
            
            //再找筹码飞
            var convertNode = cc.find("Canvas/convertNode");
            var convertNodeJS = convertNode.getComponent("convertNode");
            // var flag = false;
            // if(totalMoney>0)
            // {
            //     flag = true;
            // }
            convertNodeJS.chipFlyAction(this.betNum, this.currentChipIndex, this.betId-1, flag, this);
            
        }

    },
    
    /**
     *  动作飞回来
     */
    flyBack: function()
    {
        this.clearSelfChip();
    },
    
    /**
     * 清空筹码
     */
    clearSelfChip : function(){
        var netData = NetData.NetData.getInst();
        if(netData.timeFlag == 1){
            this.betNum = this.betNumTotal1;
        }
        else{
            this.betNum = this.betNumTotal2;
        }
        this.reduceSelfChip();
    },

    /**
     * 其他玩家飞筹码
     * @param seatIndex 其他玩家座位号
     */
    addOtherChip : function(seatIndex){

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
