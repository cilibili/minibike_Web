// pages/identify/identify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  formSubmit: function(e){
    var openid = getApp().globalData.openid
    var data = e.detail.value
    console.log("提交身份验证的参数：", data ,"openid:",openid)
    wx.request({
      method: 'POST',
      url: 'http://localhost:8080/user/identify',
      data:{
        id: openid,
        name: data.name,
        idCardNum: data.idNum,
        status: 3
      },
      success: function(res){
        if(res.data){
          getApp().globalData.status = 3
          wx.navigateTo({
            url: '../index/index',
          })
        }else{
          wx.showToast({
            title: '实名认证失败',
          })
        }
      }
    })
  }
})