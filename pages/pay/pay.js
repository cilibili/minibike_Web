// pages/pay/pay.js
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
var qqmapsdk

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: "",
    money: 10,
    balance: 0,
    currentTab: 3,
    name: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    qqmapsdk = new QQMapWX({
      key: 'EBMBZ-N5FWU-JYOVP-B3LKB-63JCQ-XBFHT'
    })
    //getstatusByOpenId() 在这里加载就会慢一次点击，在index加载就正常，为什么
    var phoneNum = getApp().globalData.phoneNum
    var balance = getApp().globalData.balance
    var name = getApp().globalData.name
    console.log("充值余额的用户信息：", phoneNum, balance)
    this.setData({
      balance: balance,
      phoneNum: phoneNum,
      name: name
    })
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
  onUnload: function() {},

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

  switchNav: function(e) {
    var that = this
    var currentTab = e.currentTarget.dataset.current
    var money = e.currentTarget.dataset.money
    var phoneNum = getApp().globalData.phoneNum
    //如果标签没变什么也不做（target和currentTarget是一样的）
    if (that.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        money: money,
        currentTab: currentTab
      })
    }
  },

  recharge: function(e) {
    var that = this;
    //充值提示框
    wx.showModal({
      title: '充值',
      content: '您是否进行充值' + that.data.money + '元?',
      confirmText: '确认充值',
      success: function(res) {
        console.log(res)
        //确认充值
        if (res.confirm) {
          //发送充值请求
          var openid = getApp().globalData.openid;
          var amount = that.data.money;
          wx.request({
            url: 'http://localhost:8080/user/recharge',
            method: 'POST',
            data: {
              balance: amount,
              id: openid
            },
            success: function(res) {
              if (res.data) {
                wx.showModal({
                  title: '提示',
                  content: '充值成功！',
                  success: function(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../index/index',
                      })
                      location2city(that)
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.navigateBack({

          })
          wx.showToast({
            title: '抠门',
            icon: 'none'
          })
        }
      }
    })
  }
})

function location2city(that) {
  wx.getLocation({
    success: function(res) {
      console.log("locatino2city被调用", res)
      var lat = res.latitude;
      var log = res.longitude;
      //请求腾讯地图api查找省市区
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: lat,
          longitude: log
        },
        success: function(res) {
          var address = res.result.address_component;
          var province = address.province;
          var city = address.city;
          var district = address.district;
          console.log(province + " , " + city + " ," + district)
          /*
          //埋点：记录用户充值的行为信息，以后做数据分析
          wx.request({
            //将数据写入nginx，nginx连接kafkaChanel,连接HDFSConsumer写
            url: "http://192.168.100.106/kafka/recharge",
            data: {
              date: new Date(),
              openid: openid,
              phoneNum: phoneNum,
              name: that.data.name,
              province: province,
              city: city,
              district: district,
              amount: amount,
              latitude: lat,
              longitude: log
            },
            method: "POST"
          })
          */
        }
      })
    },
  })
}