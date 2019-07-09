// pages/deposit/deposit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  deposit: function() {
    var that = this
    var phoneNum = getApp().globalData.phoneNum
    var openid = getApp().globalData.openid
    wx.showModal({
      title: '提示',
      content: '是否充值押金？',
      confirmText: '确认充值',
      success: function(res) {
        //确认充值
        if (res.confirm) {
          wx.showLoading({
            title: '充值中...',
          })
          wx.request({
            url: 'http://localhost:8080/user/deposit',
            method: 'POST',
            data: {
              id: openid,
              phoneNum: phoneNum,
              deposit: 299,
              status: 2
            },
            success: function(res) {
              if (res.data) {
                getApp().globalData.status = 2
                wx.hideLoading()
                wx.navigateTo({
                  url: '../identify/identify',
                })
              } else {
                 wx.showToast({
                   title: '充值失败',
                   icon: 'none'
                 })
              }
            }
          })
        }else{
          //沙雕逻辑代码
          wx.showModal({
            title: '再次提示',
            content: '不再考录一下？',
            confirmText: '充充充!',
            cancelText: '兜里没钱',
            success: function(res){
              if(res.cancel){
                wx.navigateBack({
                  
                })
                wx.showToast({
                  title: '再见穷鬼！',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })


  }
})