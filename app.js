//app.js
App({
  globalData: {
    userInfo: null,
    status: 0,
    phoneNum: "",
    balance: 0,
    openid: "",
    name: ""
  },
  onLaunch: function() {
    var that = this
    // 登录
    wx.login({
      success: res => {
        //根据你的微信小程序的密钥到后台获取ID
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var appid = "wx2e1b447506d3a00f";
          var secret = "cce3bc286e2a55dbffc9506691cd7464";
          var code = res.code;
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
            success: function(r) {
              //获取到每个用户的对立id
              //console.log(r.data.openid)
              //把openid保存到本地
              wx.setStorageSync('openid', r.data.openid)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

    //由openid获取status
    getstatusByOpenId()

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //that.globalData.openid = openid
  }
})

function getstatusByOpenId(){
  var openid = wx.getStorageSync('openid')
  console.log("查询status的openid：", openid)
  wx.request({
    url: "http://localhost:8080/user/" + openid,
    success: function(res){
      var user = res.data
      if (user){
        console.log("openid获取到的User信息：", user)
        getApp().globalData.status = user.status
        getApp().globalData.phoneNum = user.phoneNum
        getApp().globalData.balance = user.balance
        getApp().globalData.name = user.name
        //不知道为什么不能在其他位置设，只好在这里设了
        //可能因为网络请求在Page.onLoad之后才返回
        getApp().globalData.openid = openid
        
      }
    }
  })
}