//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        recommender: '',
        userid: '',
        unionid: '',
        url: 'https://m.mhelper.co'
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    /**
	 * 分享
	 */
    onShareAppMessage: function (res) {
        return {
            title: '华克金等币看盘盯盘助手',
            path: `/pages/index/index?userid=${this.data.userid}`,
            // imageUrl: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2803412383,3138459875&fm=173&app=25&f=JPEG?w=550&h=366&s=5AB301C52453D9C01621A53003005011',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    receivePostMsg: function (e) {
        console.log("收到的消息是", e)
    },
    onShow: function () {
        this.onLoad()
    },
    onLoad: function (options) {
        if (options && options.userid) {
            this.setData({ 
                recommender: options.userid,
                url: 'https://m.mhelper.co/#/?recommender=' + options.userid
            })
        }
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: 'https://api.mhelper.co/weixin/getMiniOpenID',
                    data: {
                        code: res.code
                    },
                    success: response => {
                        if (!response.data.data.unionid) return
                        wx.request({
                            url: 'https://api.mhelper.co/customer/customerinfo/unionid',
                            data: {
                                unionid: response.data.data.unionid
                            },
                            success: result => {
                                console.log(result.data.data)
                                this.setData({ userid: result.data.data.userid})
                            }
                        })
                    }
                })
            }
        })
        wx.showShareMenu({
            withShareTicket: true
        })
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
