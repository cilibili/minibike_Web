// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryCodes: [86,88,90,92],
    countryCodeIndex: 0,
    phoneNum: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindCountryCodeChange: function(e){
    console.log("国家代码改动：",e)
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },

  inputPhoneNum: function(e){
    this.setData({
      phoneNum: e.detail.value
    })
  },

  genVerifyCode: function(e){
    //console.log("生成验证码传入的参数：",e) 饿。。。没有效信息
    var nationCode = this.data.countryCodes[this.data.countryCodeIndex]
    var phoneNum = this.data.phoneNum
    wx.request({
      url: 'http://localhost:8080/user/genVerifyCode',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      data:{
        nationCode: nationCode,
        phoneNum: phoneNum
      },
      success: function(res){
        wx.showToast({
          title: '验证码已经发送',
          icon: 'success'
        })
      }
    })
  },

  formSubmit: function(e){
    var openid = wx.getStorageSync("openid")
    console.log("提交验证码的参数：", e,"获取到的openid:",openid)
    var phoneNum = this.data.phoneNum
    var verifyCode = e.detail.value.verifyCode
    if(verifyCode == ''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    }
    else{//前端校验验证码非空
      wx.request({
        url: 'http://localhost:8080/user/verify',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method:'POST',
        data:e.detail.value,
        success: function(res){
          console.log("校验验证码返回的信息：",res)
          var verifyResult = res.data
          //校验成功，进行注册信息
          //如果if("false")是返回正确！！！！，但这里接口返回的是Boolean,所以if可以这样
          if (verifyResult){
             wx.request({
               data:{
                id: openid,
                phoneNum: phoneNum,
                status: 1,
               },
               method: 'POST',
               url: 'http://localhost:8080/user/register',
               success: function(res){
                 getApp().globalData.status = 1
                 getApp().globalData.phoneNum = phoneNum
                 wx.navigateTo({
                   url: '../deposit/deposit',
                 })
               }
             })
          }else{
            wx.showModal({
              title: '提示',
              content: '验证码错误',
              showCancel: false
            })
          }
        }
      })
    }
  }
})