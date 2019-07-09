function findAllBike() {

}
// pages/register/reg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    controls: [],
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getstatusByOpenId()
    var that = this
    wx.getLocation({
      success: function(res) {
        var lati = res.latitude
        var longi = res.longitude
        console.log("latitude:" + lati + "==longitude:" + longi)
        that.setData({
          latitude: lati,
          longitude: longi
        })
        getAllBike(that)
      }
    })
    findAllBike()
    //创建一个map上下文，如果想要调用地图相关的方发
    that.mapCtx = wx.createMapContext('map')

    wx.getSystemInfo({
      success: function(res) {
        //宽高信息只在布局图标时用到
        var height = res.windowHeight
        var width = res.windowWidth

        that.setData({
          controls: [{
            id: 1,
            iconPath: '/image/location.png',
            position: {
              width: 20,
              height: 35,
              left: width / 2 - 10,
              top: height / 2 - 35
            },
            clickable: true
          }, {
            //定位按钮安置
            id: 2,
            iconPath: '/image/img1.png',
            position: {
              width: 40,
              height: 40,
              left: 20,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, {
            //扫码按钮
            id: 3,
            iconPath: '/image/qrcode.png',
            position: {
              width: 100,
              height: 40,
              left: width / 2 - 50,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, {
            //充值按钮
            id: 4,
            iconPath: '/image/pay.png',
            position: {
              width: 40,
              height: 40,
              left: width - 45,
              top: height - 60.
            },
            //是否可点击
            clickable: true
          }, {
            id: 5,
            iconPath: "/image/bike.png",
            position: {
              width: 35,
              height: 40,
            },
            //是否可点击
            clickable: true
          }]
        })
      },
    })

    console.log("======打印globalData=======",getApp().globalData)
  },


  /**
   * 绑定的地图事件
   */
  contap(e) {
    var that = this
    if (e.controlId == 2) {
      that.mapCtx.moveToLocation();
    }
    if (e.controlId == 3) {
      if (userCheck() == true) {
        scanCode()
      }
    }
    if (e.controlId == 4) {
      if (userCheck() == true) {
        wx.navigateTo({
          url: '../pay/pay',
        })
      }
    }
    if (e.controlId == 5) {
      storeBike(that)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getLocation({
      success: function(res) {
        var lat = res.latitude
        var longi = res.longitude
        var openid = wx.getStorageSync('openid')
        wx.request({
          url: 'http://localhost:8080/log/ready',
          method: "POST",
          data: {
            time: new Date(),
            openid: openid,
            lat: lat,
            longi: longi
          },
          success: function(res) {
            console.log(res.data + "onReady_Function")
          }
        })
      },
    })
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

  }

})

function getAllBike(that) {
  wx.request({
    url: 'http://localhost:8080/bike/bikes',
    success: function(res) {
      const bikes = res.data.map((bData) => {
        return {
          id: bData.id,
          iconPath: "/image/bike.png",
          width: 35,
          height: 40,
          latitude: bData.latitude,
          longitude: bData.longitude
        }
      })
      that.setData({
        markers: bikes
      })
    }
  })
}

function storeBike(that) {
  that.mapCtx.getCenterLocation({
    success: function(res) {
      var lat = res.latitude;
      var log = res.longitude;
      wx.request({
        url: 'http://localhost:8080/bike/bikeStore',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          latitude: lat,
          longitude: log
        },
        success: function() {
          getAllBike(that)
        }
      })
    }
  })
}

function scanCode() {
  wx.scanCode({
    success: function(res) {
      var status = 0
      var qrCode = res.result
      console.log(qrCode)
      wx.request({
        url: 'http://localhost:8080/bike/unlock',
        method: 'PUT',
        header: {
          'content-type': 'application/json'
        },
        data: {
          qrCode: qrCode,
          status: 1
        },
        success: function(res) {
          console.log(res.data)
          if (res.data.status == 1) {
            wx.showModal({
              title: '开锁情况',
              content: '开锁成功',
            })
          } else if (res.data.status == 101) {
            wx.showModal({
              title: '开锁情况',
              content: '查无此车',
            })
          } else if (res.data.status == 102) {
            wx.showModal({
              title: '开锁情况',
              content: '已被使用',
            })
          }
        }
      })
    }
  })
}

function userCheck() {
  var flag = false
  var status = getApp().globalData.status
  if (status == 0 || status == null) {
    wx.navigateTo({
      url: '../register/register',
    })
  } else if (status == 1) {
    wx.navigateTo({
      url: '../deposit/deposit',
    });
  } else if (status == 2) {
    wx.navigateTo({
      url: '../identify/identify',
    });
  } else if (status == 3){
    flag = true
    return flag
  }
}


function getstatusByOpenId() {
  var openid = wx.getStorageSync('openid')
  console.log("查询status的openid：", openid)
  wx.request({
    url: "http://localhost:8080/user/" + openid,
    success: function (res) {
      var user = res.data
      if (user) {
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