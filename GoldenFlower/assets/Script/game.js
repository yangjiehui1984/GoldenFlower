

var NetData = require("NetData");
var DataOper = require("DataOper");
var ButtonScale = require("ButtonScale");
var Init = require("Init");
var init = new Init();
init.init();


cc.Class({
    extends: cc.Component,

    properties: {
        rewardNode: cc.Node,
        
        blackLayer: {
            default: null,
            type: cc.Node
        },
        
        waitLayer: {
            default: null,
            type: cc.Node
        },
        
        cdtimeIcon: cc.Node,
        //倒计时看区域
        cdBgYellow: {
            default: null,
            type: cc.Node
        },
        cdBgRed: {
            default: null,
            type: cc.Node
        },
        cdLabel: {
            default: null,
            type: cc.Label
        },
        cdJieduanLabel:{
          default: null,
          type: cc.Label
        },
        
        //筹码区
        chipNodeArray: {
            default: [],
            type: [cc.Node]
        },
        
        //清除
        clearOnNode: {
            default: null,
            type: cc.Node
        },
        clearOffNode: {
            default: null,
            type: cc.Node
        },
        
        //toast
        toastNode: {
            default: null,
            type: cc.Node
        },
        
        chooseAreaNodeArray: {
            default: [],
            type: [cc.Node]
        },
        
        chipAreaNoTouchNode: {
            default: null,
            type: cc.Node
        },
        
        betAreaNoTouchNode: {
            default: null,
            type: cc.Node
        },
        
        stageStopDialog:cc.Node, //第一回合结束提示框label
        sumLimit: 0, //判断投注和值； 是否超过limit;
        needClearFlag: false, //需要清理;要在投注成功后调;
        chipIndex:0,//筹码node 的 index
        clearingFlag: false, //清理中

        canBetFlag : true,//当前是否可以投注
        cunCmd :100,//默认100
        
        errorDialog: cc.Node,
        
    },

    // use this for initialization
    onLoad: function () {

        this.netData = NetData.NetData.getInst();

        if(this.netData.initFlag == 1){
            cc.log("正常初始化进入UI");
            //直接初始化
            this.frontInit();
            this.gameStart();
        }
        else if(this.netData.initFlag == 2){
            // this.midNode.active = false;
            // this.stopHint(this, this.netData.stopSellingDesc);
        }
        else{
            cc.log("fei正常初始化进入UI");
            this.schedule(this.initWait, 0.1);
        }
        
        // //测试
        // this.netData.timeFlag = 1;
        // this.netData.secs = 25;
        
        // var obj = new Object();
        // obj.status = 1;
        // obj.betList = [10, 20, 30, 40, 50];
        // var oddsListObj = new Object();
        // oddsListObj.option = "群雄";
        // oddsListObj.id = 1;
        // oddsListObj.powerId = 2;
        // oddsListObj.odds1 = 0.2;
        // oddsListObj.odds2 = 0.8;
        // oddsListObj.status = 1;
        // obj.oddsList = oddsListObj;
        // this.netData.initData = obj;
        // this.gameStart();

    },
    
    
    initWait: function(dt){
        if(this.netData.initFlag == 1){
            //直接初始化
            this.frontInit();
            this.gameStart();
            this.unschedule(this.initWait);
        }
        else if(this.netData.initFlag == 2){
            // this.midNode.active = false;
            // this.stopHint(this, this.netData.stopSellingDesc);
        }
    },

    frontInit: function(){
        // if(this.netData.initData.status == 1){
            var te = new Date();
            let localTime = te.getTime();
            let offset = Math.round((localTime - init.timeStamp) / 1000); 
            this.netData.secs -= offset;
            console.log("offset= " + offset + "sec= " + this.netData.secs);

            if(this.netData.secs < 0){
                this.netData.initData.status = 3;
            }
        // }
    },

    resumeTick: function(dt){
        this.resumFlag = true;
    },

    start: function(){
        if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.renderer.enableDirtyRegion(false);
        }
    },
    
    isCanBet:function(callback)
     {
         var flag = false;
         
        if (!CC_JSB)
        {
            var self = this;
         var sdk = window.aliLotteryCasinoSDK;
            if (sdk) 
            {
                
                sdk.isLogin(function(isLogin) 
                {
                    
                  if(!isLogin)//没登录去登录
                  {
                      self.goLogin();
                  }
                  else//登录了 判断是否获取豆成功
                  {

                    sdk.setCache('chip', self.netData.betList[self.chipIndex]);
                    
                    //在判断是否足额（淘宝相关）
                    var  price = self.netdata.betList[self.chipIndex];
                    
                    flag = self.judgeBalance(price);
                    if(flag)
                    {
                        callback();
                    }
                  }
                });
            }
            else
            {
                callback();
            }
        }
        else
        {
           callback();
        }

     },
     
    goLogin: function(){
        if(!CC_JSB){
            var self = this;
            var sdk = window.aliLotteryCasinoSDK;

            if(sdk){
                sdk.login(function() {//需要调初始化;
                    // login 后执行
                    sdk.updateUserInfo();
                    /*sdk.getUserInfo(function(info) {
                        if (info) {
                            self.netData.sdkBalance = info.fee;
                            var uid = info.uid;
                            var nick = info.nick;
                            self.showUserIcon(uid, nick);
                        }
                    });*/
                    self.fresh();
                });
            }
            else{
                this.fresh();
            }
        }
        else{
            this.fresh();
        }
    },

    exitJudge: function(){
        /*
        let fg = false;
        let unfinish = false;

        if(!this.canBetFlag || unfinish){
            this.errDialogTag = 3;

            if(this.clearingFlag){
                this.showErrorLayer("正在帮你撤单，请稍等", true);
            }
            else{
                this.showErrorLayer("正在帮你下单，请稍等", true);
            }

            fg = true;                        
        }

        return fg;
        */
    },
    
    fresh:function()
    {
        this.setStageText();
    },
    
    exitGame: function(){
        if (!CC_JSB){
            if (window.aliLotteryCasinoSDK) {
                window.aliLotteryCasinoSDK.popWindow();
            }
        }
        else{
            cc.director.loadScene('game');
        }
    },

    gameStart: function(){
        cc.log("gamestart");
        this.setStageText();
        this.getChipIndex();
        this.showChipNum();
        this.swiftSec();
        this.showPowerInfo();
        this.resumeBetChip();
        this.getTable();
    },

    /**
     * 获取同桌人
     */
    getTable : function(){
        var dataOper = DataOper.DataOper.getInst();
        dataOper.getTable(this.netCallback, this);
    },
    
    reGo: function()
    {},
    //初始化恢复数据
    resumeBetChip : function(){
        var netData = NetData.NetData.getInst();
        if(netData.initData.bets){
            for(let i = 0; i < netData.initData.bets.length; ++i){
                for(let j=0; j<this.chooseAreaNodeArray.length; j++){
                    var chooseArea = this.chooseAreaNodeArray[j];
                    var powerJS = chooseArea.getComponent("Power");
                    if(powerJS.betId == netData.initData.bets[i].id){
                        
                        powerJS.initSelfChip(netData.initData.bets[i].timeFlag, netData.initData.bets[i].totalBet);
                    }
                }
            }
        }
    },
    
    showPowerInfo:function()
    {
        for(var i=0; i<this.chooseAreaNodeArray.length; i++)
        {
            var chooseArea = this.chooseAreaNodeArray[i];
            var powerJS = chooseArea.getComponent("Power");
            powerJS.updataInfo(this.cunCmd);
            powerJS.updataUI();
        }
    },
    
    setSelfChipSkinGray: function(tag)
    {
        for(var i=0; i<this.chooseAreaNodeArray.length; i++)
        {
            var chooseArea = this.chooseAreaNodeArray[i];
            var powerJS = chooseArea.getComponent("Power");
            powerJS.setSkinWithTag(tag);
        } 
    },
    
    setStageText:function()
    {
        this.cdJieduanLabel.node.active = true;
        this.cdtimeIcon.active = true;
        this.cdLabel.node.x = -54;
        
        var jieduan = this.cdJieduanLabel.getComponent(cc.Label);
        if(this.netData.timeFlag == 1)//盲选阶段
        {
            jieduan.string = "盲选";
        }
        else if(this.netData.timeFlag == 2)//明选阶段
        {
            jieduan.string = "明选";
        }
    },
    
    swiftSec: function(){
        //1：暗牌正在投注，2：暗牌阶段已截止，3：明牌正在投注，4:明牌截至投注，5：正在开奖，7:停售
        cc.log("this.netData.initData.status ", this.netData.initData.status);
        cc.log("time is ", this.netData.secs);
        switch(this.netData.initData.status){
            case 1:
            case 3:
                {

                if(this.netData.secs >= 0){
                    this.cdLabel.string = this.netData.secs + "″";
                }
                else{
                    this.cdLabel.string = "0″";
                }
                
                let pt = this.cdBgRed.parent;
                pt.stopAllActions();
                pt.runAction(cc.show());

                if(this.netData.secs <= 3){            
                    
                    this.cdBgRed.active = true;
                    this.cdBgYellow.active = false;
                    let dt  = 0.38;//3 / 8;
                    pt.runAction(cc.repeat(cc.sequence(cc.delayTime(dt), cc.hide(), cc.delayTime(dt), cc.show()), 4)); 
                }
                else{
                    this.cdBgYellow.active = true;
                    this.cdBgRed.active = false;
                }

                this.schedule(this.showSec, 1);
                this.grayLight(false);
                this.setChipGray(false);
            }
            break;
            case 2:
            case 4:
                {
                this.doStopBet();
            }
            break;
            case 5:{
                //正在开奖
                this.getReward();
                this.grayLight(true);
                this.setChipGray(true);
            }
            break;
            case 7:{
                //停售
                
            }
            break;
            default:
            break;
        }
    },

    secCd: function(dt){
        this.netData.secs--;
    },

    showSec : function(dt){
        // cc.log("showSec：this.netData.secs ",this.netData.secs);
        
        this.netData.secs--;

        //获取同桌人，5s的倍数时获取
        if(this.netData.secs >= 5 && this.netData.secs % 5 == 0){
            this.getTable();
        }

        if(this.netData.secs >= 0){
            this.cdLabel.string = this.netData.secs + "″";
        }
        else{
            this.cdLabel.string = "0″";
        }

        if(this.netData.secs <= 3){
            let pt = this.cdBgRed.parent;
            cc.log("sec<3");
            this.cdBgRed.active = true;
            this.cdBgYellow.active = false;
            let dt  = 0.38;//3 / 8;
            pt.runAction(cc.repeat(cc.sequence(cc.delayTime(dt), cc.hide(), cc.delayTime(dt), cc.show()), 4));
        }

        if(this.netData.secs <= 0){
            this.setSelfChipSkinGray(5);
            cc.log("sec== 0");
            this.doStopBet();
        }
    },
    
    doStopBet : function(){
        cc.log("this.netData.timeFlag", this.netData.timeFlag);
        //this.canBetFlag = false;
        // this.unschedule(this.turnTableLogic);
        this.cdBgRed.parent.stopAllActions();
        this.cdBgRed.parent.runAction(cc.show());
        this.cdBgYellow.active = true;
        this.cdBgRed.active = false;
        this.cdLabel.node.x = -54;
        // this.cdLabel.w = 220;
        this.cdLabel.string = "已截止";
        this.unschedule(this.showSec);        
        //变灰;
        this.grayLight(true);
        this.setChipGray(true);
        //筹码便会的变灰
        
        if(this.netData.timeFlag == 1)//提示框的弹出获取结果开奖就然后获取第二回合数据
        {
            this.stageStopDialog.active  = true;
            
            var self = this;
            var callback = function (dt)
            {
                this.getSecondData();//获取第二阶段
            }
            this.scheduleOnce(callback, 3 + this.netData.initData.deadSecs1);//一阶段停止时间+3s
        }
        else//获取开奖结果
        {
            var callback = function(dt){
                this.getReward();
            }
            this.scheduleOnce(callback, 3 + this.netData.initData.deadSecs2);//二阶段停止时间+3s
        }
    },
    
    grayLight: function(flag){
        this.clearOnNode.parent.active = !flag;
        this.clearOffNode.parent.active = flag;
        this.betAreaNoTouchNode.active = flag;
    },
    
    getReward: function(){
        this.cdBgRed.parent.stopAllActions();
        this.cdBgRed.parent.runAction(cc.show());
        this.cdBgYellow.active = true;
        this.cdBgRed.active = false;
        this.cdJieduanLabel.node.active = false;
         this.cdtimeIcon.active = false;
         this.cdLabel.node.x = -100;
        this.cdLabel.string = "正在开奖";
        this.scheduleOnce(this.doReward, 2); //给服务器预留的2秒;
    },
    
    getSecondData: function()//获取第二阶段的数据
    {
        //this.showWaitLayer();
        var dataOper = DataOper.DataOper.getInst();
        dataOper.getSecondData(this.netCallback, this);
    },
    
    doReward : function(dt){
        //this.showWaitLayer();
        var dataOper = DataOper.DataOper.getInst();
        dataOper.getReward(this.netCallback, this);
    },

    showWaitLayer: function(){
        this.blackLayer.active = true;
        this.waitLayer.active = true;
    },

    hideWaitLayer: function(){
        this.blackLayer.active = false;
        this.waitLayer.active = false;
    },
    
    judgeBalance: function(amount){
        let fg = true;

        if(this.sdkBalance == -1){
            // this.errDialogTag = 5;
            // this.blackLayer.active = true;
            // this.refreshNode.getChildByName("word").getComponent(cc.Label).string = "获取" + this.netData.currency + "失败，请刷新页面";
            // this.refreshNode.runAction(cc.scaleTo(0.2, 1.0, 1.0));
            fg = false;
        }
        else{

            if(amount > this.sdkBalance){
                //提示余额不足，跳转到充值
                if (!CC_JSB){
                    if (window.aliLotteryCasinoSDK) {
                        window.aliLotteryCasinoSDK.recharge(true);
                    }
                }

                fg = false;
                console.log("no balance");
            }
        }

        return fg;
    },
    
    getChipIndex: function(){
        var sdk = window.aliLotteryCasinoSDK;
        
        if(sdk){
            var self = this;
            let len = this.netData.betList.length;

            window.aliLotteryCasinoSDK.getCache('chip', function(result) {
                if (result) {
                    for(let i = 0; i < len; i++){
                        if(self.netData.betList[i] == result){
                            self.chipIndex = i;
                            break;
                        }
                    }
                } else {
                    for(let i = 0; i < len; i++){
                        if(self.netData.betList[i] == self.netData.preBet){
                            self.chipIndex = i;
                            break;
                        }
                    }
                }
            });
        }        
    },
    
    /******************netCallback********************/
    netCallback: function(cmd, res, msg, self)
    {
        cc.log("netCallback cmd=" + cmd);
        self.cunCmd = cmd;
        var netData = NetData.NetData.getInst();
        self.hideWaitLayer();
        res = parseInt(res);
        console.log("res=" + res + "/mg=" + msg +"/cmd=" + self.cunCmd);
        switch(res)
        {
        case 0:{            
            switch(cmd)
            {
                case 100://init
                {
                    self.gameStart();
                }
                break;
                case 101://bet
                {
                    self.clearWithFlag(true);
                    self.canBetFlag = true;
                    self.showPowerInfo();
                    //投注成功后清零
                    for(var i=0; i<self.chooseAreaNodeArray.length; i++)
                    {
                        var chooseArea = self.chooseAreaNodeArray[i];
                        var powerJS = chooseArea.getComponent("Power");
                        if(powerJS.betFlag)
                        {
                            powerJS.betNum = 0;
                        }
                    }
                }
                break;
                case 102://clear
                {
                    self.clearingFlag = false;
                    self.showPowerInfo();
                }
                break;
                case 103://reward
                {
                    self.clearWithFlag(false);
                    self.showPowerInfo();

                    self.schedule(self.secCd, 1);
                    self.scheduleOnce(self.nextPeriod, 10.0);
                }
                break;
                case 104://twostemp
                {
                    self.stageStopDialog.active  = false;
                    self.schedule(self.showSec, 1);
                    self.grayLight(false);
                    self.setChipGray(false);
                    self.clearWithFlag(false);
                    self.setStageText();
                    self.showPowerInfo();
                }
                break;
                case 105://同桌人
                {
                    self.updataTable();
                }
                break;
                case 106://订单列表
                {}
                break;
                case 107://历史走势
                {}
            }
        }
        break;
        case 100028://明牌阶段未开始，那就1s后再调下
        {
            if(cmd == 104){
                setTimeout(function() {
                    //self.showWaitLayer();
                    var dataOper = DataOper.DataOper.getInst();
                    dataOper.getSecondData(self.netCallback, self);
                }, 1000);
            }
        }
        break;
        case 100011://结算尚未开始，那就1s后再调下
        {
            if(cmd == 103){
                setTimeout(function() {
                    //self.showWaitLayer();
                    var dataOper = DataOper.DataOper.getInst();
                    dataOper.getReward(self.netCallback, self);
                }, 1000);
            }
        }
        break;
        default:
        {
            cc.log("res default!");
            switch(cmd)
            {
                case 101://投注失败回收筹码
                    {
                        // self.showToast(msg);
                        if(res == 200009){//余额不足，跳转到充值

                        }

                        self.canBetFlag = true;
                        for(var i=0; i<self.chooseAreaNodeArray.length; i++)
                        {
                            var chooseArea = self.chooseAreaNodeArray[i];
                            var powerJS = chooseArea.getComponent("Power");
                            for(var j = 0; j < netData.reqBetList.length; j ++)
                            {
                                if(powerJS.betId == netData.reqBetList[j].id)
                                {
                                    powerJS.reduceSelfChip();
                                    break;
                                }
                            }
                        }
                    }
                    break;
                    case 102:{//清空投注
                        self.clearWithFlag(false);
                        self.clearingFlag = false;
                        self.showToast(msg);
                    }
                    break;
                    default:
                    {
                        /*
                        self.stageStopDialog.active  = false;
                        //通常的错误提示
                        var errorDialogJs = self.errorDialog.getComponent("errorDialog");
                        errorDialogJs.showDialog(msg, 0);
                        */
                        self.showToast(msg);
                    }
                    break;
            }
        }
        break;
        }
        
    },
    /******************netCallback********************/

    /**
     * 检查同桌人，每局结束时检查，把没有投注的清掉，把有投注的subId清掉
     */
    checkTable : function(){
        var netData = NetData.NetData.getInst();
        for(let i = 0; i < netData.reqTableArray.length; ++i){
            if(netData.reqTableArray[i].subIds.length == 0){
                netData.reqTableArray.splice(i, 1);
                --i;
            }
        }
    },

    /**
     * 更新同桌人，每次请求回来后调用，包含新的投注信息
     */
    updataTable : function(){
        var netData = NetData.NetData.getInst();
        for(let i = 0; i < netData.tableArray.length; ++i){
            var flag = false;
            for(let j = 0; j < netData.reqTableArray.length; ++j){
                if(netData.reqTableArray[j].uid == netData.tableArray[i].uid){
                    flag = true;
                    for(let k = 0; k < netData.tableArray[i].subIds.length; ++k){
                        netData.reqTableArray[j].subIds.push(netData.tableArray[i].subIds[k]);
                    }
                    break;
                }
            }

            if(!flag){
                netData.reqTableArray.push(netData.tableArray[i]);
            }
        }
    },

    //结算飞戳结束
    rewardFlyFinishedCallback: function()
    {
        //提示再来一局103
        cc.log("该提示结算页面了");
        this.betAreaNoTouchNode.active = false;
        var netData = NetData.NetData.getInst();
        var status = netData.rewardData.status;
        this.rewardNode.active = true;
        var num = 0;
        if(status == 1)//sheng
        {
            num = netData.rewardData.amount;
        }
        else if(status == 2)//fu
        {
            num = netData.rewardData.allNum;
        }
        else if(status == 3)//ping
        {
            num = netData.rewardData.amount;
        }
        
        this.rewardNode.getComponent("rewardNode").setContent(status, num);

    },

    nextPeriod : function(dt){
        this.unschedule(this.nextPeriod);
        this.unschedule(this.secCd);
        this.netData.timeFlag = 1;

        this.rewardNode.active = false;
        
        for(var i=0; i<this.chooseAreaNodeArray.length; i++)
        {
            var chooseArea = this.chooseAreaNodeArray[i];
            var powerJS = chooseArea.getComponent("Power");
            powerJS.resetInfo();
            powerJS.updataUI();
        }
        this.schedule(this.showSec, 1);
        this.grayLight(false);
        this.setChipGray(false);
        this.setStageText();
        this.cdLabel.string = this.netData.secs + "″";

        var convertNode = cc.find("Canvas/convertNode");
        var convertNodeJS = convertNode.getComponent("convertNode");
        convertNodeJS.flyRewardActionFinished();

        //同桌人
        this.checkTable();
    },
    
    clearWithFlag: function(flag)
    {
        this.clearOnNode.parent.active = flag;
        this.clearOffNode.parent.active = !flag;
    },
    
    //所有按钮的回调等等事件
    btnActionCallBack :function(btnTag)
    {
        switch(btnTag)
        {
            // case ButtonScale.EbuttonTag.eCleare:
            case 5:
            {  
                cc.log("clear clear!!!");

                

                if(this.canBetFlag){
                    this.clearingFlag = true;
                    this.clearWithFlag(false);
                    
                    //this.showWaitLayer();
                    var dataOper = DataOper.DataOper.getInst();
                    dataOper.getClear(this.netCallback, this);
                    

                     this.flyBack();
                     this.sumLimit = 0;
                     this.netData.betLimit = this.netData.totalBetLimit;

                    
                }
                else{//正在下单，不让清
                    this.showToast("正在为您下单，请稍后撤单");
                    /*
                    this.needClearFlag = true;
                    this.flyBack();
                    this.sumLimit = 0;
                    this.netData.betLimit = this.netData.totalBetLimit;
                    */
                }
            }
            break;
            case ButtonScale.EbuttonTag.eChip20:
            case ButtonScale.EbuttonTag.eChip50:
            case ButtonScale.EbuttonTag.eChip100:
            case ButtonScale.EbuttonTag.eChip500:
            case ButtonScale.EbuttonTag.eChip1000:
            {
                //cc.log("");
                this.chipIndex = btnTag;
                this.resetChip();
                //cc.log("chipIndex is = ", this.chipIndex);
            }
            break;
            
            default:
                break;
        }
        
    },
    
    errorDialogCallback: function(typeaction, positon)//1 左边按钮 2 右边按钮
    {
        var errorDialogJs = this.errorDialog.getComponent("errorDialog");
        errorDialogJs.hideDialog();
        
        if(positon == 1)
        {
            switch(typeaction)
            {
                case 0:
                    {
                        //只有一个按钮刷新刷新的
                        if(this.cunCmd == 100)
                        {
                            var dataOper = DataOper.DataOper.getInst();
                            dataOper.getInit(this.netCallback, this);
                        }
                        else if(this.cunCmd == 101)
                        {
                            
                        }
                        else if(this.cunCmd == 102)
                        {
                            
                        }
                        else if(this.cunCmd == 103)
                        {
                            //this.showWaitLayer();
                            var dataOper = DataOper.DataOper.getInst();
                            dataOper.getReward(this.netCallback, this); 
                        }
                        else if(this.cunCmd == 104)
                        {
                            //this.showWaitLayer();
                            var dataOper = DataOper.DataOper.getInst();
                            dataOper.getSecondData(this.netCallback, this);
                        }
                        else if(this.cunCmd == 105)
                        {
                            
                        }
                        else if(this.cunCmd == 106)
                        {
                            
                        }
                    }
                    break;
                case 1:
                    {
                        
                    }
                    break;
                case 2:
                    {}
                    break;
            }
        }
        else
        {
            switch(typeaction)
            {
                case 0:
                    {}
                    break;
                case 1:
                    {}
                    break;
                case 2:
                    {}
                    break;
            }  
        }
    },
    
    showChipNum: function(){
        var netData = NetData.NetData.getInst();

        for(let i = 0; i < this.chipNodeArray.length; i++){
            let le = this.chipNodeArray[i].getChildByName("Label").getComponent(cc.Label);
            this.adjustFontsize(le, netData.initData.betList[i]);            
            le.string = netData.initData.betList[i];
        }
        
        for(var j = 0; j < netData.initData.betList.length; j ++)
        {
            if(netData.initData.betList[j] == netData.initData.preBet)
            {
                this.chipIndex = j;
            }
        }
        this.resetChip();
    },

    adjustFontsize: function(label, num){
        let se = 71;

        if(num < 100){
        }
        else if(num < 1000){
            label.fontSize = se * 0.8;
        }
        else{
            label.fontSize = se * 0.56;
        }
    },
    
    resetChip: function(){
        this.setChipGray(false);
        for(let i = 0; i < this.chipNodeArray.length; i++){
            if(this.chipIndex == i){
                this.chipNodeArray[i].getChildByName("chouma").scale = 1;
                this.chipNodeArray[i].getChildByName("noTouch").scale = 1;
            }
            else{
                
                this.chipNodeArray[i].getChildByName("chouma").scale = 0.8;
                this.chipNodeArray[i].getChildByName("noTouch").scale = 0.8;
            }
        }
    },
    
    setChipGray: function(flag){
        for(let i = 0; i < this.chipNodeArray.length; i++){
            this.chipNodeArray[i].getChildByName("noTouch").active = flag;

        }
    },
    
    showToast: function(msg){
        this.toastNode.stopAllActions();
        this.toastNode.scale = 0;
        let le  = this.toastNode.getChildByName("word").getComponent(cc.Label);
        le.string = msg;
        let len = le.node.width + 20; 
        this.toastNode.width = len;
        let dt = 0.2;
        let ac1 = cc.scaleTo(dt, 1.0, 1.0);
        let ac2 = cc.scaleTo(dt, 0, 0);
        this.toastNode.runAction(cc.sequence(ac1, cc.delayTime(2), ac2));
    },
    
    flyBack: function(){
        for(var i=0; i<this.chooseAreaNodeArray.length; i++)
        {
            var chooseArea = this.chooseAreaNodeArray[i];
            var powerJS = chooseArea.getComponent("Power");
            if(powerJS.betFlag)
            {
                powerJS.betList = [];
                powerJS.flyBack();
            }
        }
    },
    

    powerBet : function(callFunc, power){
        //判断登录、余额TODO
        var self = this;
        var callback = function()
        {
            //if(self.netData.initData.status == 1 || self.netData.initData.status == 3)
            {
                //self.canBetFlag = true;
                self.clearWithFlag(true);
                callFunc(self.chipIndex, power);
                self.unschedule(self.dealBet);
                self.scheduleOnce(self.dealBet, 0.5);   
            }
        }
        self.isCanBet(callback);
        
    },

    /**
     * 真实投注
     */
    dealBet : function(dt){
        //this.showWaitLayer();
        var netData = NetData.NetData.getInst();
        var dataOper = DataOper.DataOper.getInst();
        //首先检查当前是否有没有回来的投注请求
        if(this.canBetFlag){
            this.canBetFlag = false;
            
            netData.reqBetList = [];
            
            for(var i=0; i<this.chooseAreaNodeArray.length; i++)
            {
                var chooseArea = this.chooseAreaNodeArray[i];
                var powerJS = chooseArea.getComponent("Power");
                if(powerJS.betFlag)
                {
                    powerJS.betNum = 0;
                    for(let j = 0; j < powerJS.betList.length; ++j){
                        netData.reqBetList.push(powerJS.betList[j]);
                        powerJS.betNum += powerJS.betList[j].bet * powerJS.betList[j].num;
                    }
                    powerJS.betList = [];
                }
            }
            
            dataOper.getBet(this.netCallback, this);
        }
        else{
            this.scheduleOnce(this.dealBet, 0.5);
        }
    },

});
