var DataOper = require("DataOper");
var NetData = require("NetData");

cc.Class({
    extends: cc.Component,

    /*ctor: function() {
        
    },*/

    init: function() {
        var self = this;
        if (!CC_JSB && window.aliLotteryCasinoSDK) {
            document.addEventListener('casino:init', function(e)
            {
                
                /************************20170509在1.4.2修改获取gameToken****************************/
                
                var dataOper = DataOper.DataOper.getInst();
                dataOper.gameToken = e.data.accessToken;
        
                if(dataOper.gameToken === null){                
                    dataOper.gameToken = "26a09ca052d4c7dcde13449ba1b735df-11-1151-1051";
                    let tok = dataOper.GetQueryString("tok");

                    if(tok){
                        dataOper.headerToken = tok;
                        console.log("tok=" + dataOper.headerToken);
                    }
                    else{
                        dataOper.headerToken = "0";
                    }
                    //testsssssss
                    /*var myDate = new Date();
                    this.headerToken = myDate.getTime();*/
                }
     

                console.log("this.gameToken = " + dataOper.gameToken);
                console.log("this.headerToken = " + dataOper.headerToken);
                
                /************************20170509在1.4.2修改获取gameToken ****************************/
        
                self.fetch(function(isError) {
                    console.log(isError);
                    if (!isError) {
                          // 合并资源
                          window.aliLotteryCasinoSDK.mergeResources();
                          // 显示 loading
                          window.aliLotteryCasinoSDK.initLoading();
                          // 运行游戏
                          window.aliLotteryCasinoSDK.runGame();
                    } else {
                        window.aliLotteryCasinoSDK.showError();
                    }
                });
              }, false);
        } else {
            self.fetch();
        }
    },

    fetch: function(callback) {
        console.log("VersionN:201705251200");
        cc.log("fetch");
        this.initData = {};
        var self = this;
        var dataOper = DataOper.DataOper.getInst();
        dataOper.getInit(null, function(cmd, res, msg, self) {
            // 判断是否成功并存储初始化
            var isError = false;
            
            //每日****游戏暂停运营（客户端处理）
            if(res == 100007){
                isError = false;
            }
            else if(res != 0){
                isError = true;
            }
            else{
                // if(NetData.NetData.getInst().status == 1){
                //     var te = new Date();
                //     self.timeStamp = te.getTime();
                //     cc.log("timeStamp is ", self.timeStamp);
                // } 
                
                    var te = new Date();
                    self.timeStamp = te.getTime();
                    cc.log("timeStamp is ", self.timeStamp);
            }
            
            cc.log('fetch init data');
            cc.log(cmd, res, msg);
            self.initData.cmd = cmd;
            self.initData.res = res;
            self.initData.msg = msg;
            callback && callback(isError);
        }, this);
    },
});
