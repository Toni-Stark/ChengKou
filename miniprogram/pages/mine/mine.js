const auth = require('../../utils/auth.js');
const request = require('../../utils/request.js');

Page({
  data: {
    userInfo: {},
    isLogin: false,
    height: 0
  },
  getScreenHeight(){ 
    let res = wx.getWindowInfo() 
    const btn = wx.getMenuButtonBoundingClientRect(); 
    console.log('TabBar高度:', res, btn); 
    let nav_bar_height = ((btn.top-res.safeArea.top)+3)+res.safeArea.top + btn.height; 
    this.setData({height: nav_bar_height})
  },
  onLoad(){
    this.getScreenHeight()
  },
  onShow() {
    this.loadUserInfo();
  },

  async loadUserInfo(forceRefresh = false) {
    const app = getApp();

    if (!forceRefresh && app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        isLogin: true
      });
      return;
    }

    const stored = auth.getStoredUserInfo();

    if (stored.userInfo && stored.openid) {
      // 已登录，从云端获取最新的用户信息
      try {
        // 检查云开发是否可用
        if (!wx.cloud || !wx.cloud.callFunction) {
          console.warn('云开发未配置，使用本地数据');
          this.setData({
            userInfo: stored.userInfo,
            isLogin: true
          });
          return;
        }

        const result = await request.callFunction('getUserInfo', {}, {
          showLoad: true
        });

        // 更新本地存储
        auth.saveUserInfo(result, stored.openid);

        this.setData({
          userInfo: result,
          isLogin: true
        });
      } catch (error) {
        console.error('获取用户信息失败:', error);
        // 如果获取失败，使用本地存储的数据
        this.setData({
          userInfo: stored.userInfo,
          isLogin: true
        });
      }
    } else {
      // 未登录，显示默认状态
      this.setData({
        userInfo: {
          nickName: '未登录',
          avatarUrl: 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png',
          signature: '点击登录',
          stats: {
            dynamicsCount: 0,
            followersCount: 0,
            subscriptionsCount: 0
          }
        },
        isLogin: false
      });
    }
  },

  goToLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  editProfile() {
    if (!this.data.isLogin) {
      request.showToast('请先登录');
      return;
    }

    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile'
    });
  },

  goToMyDynamics() {
    if (!this.data.isLogin) {
      request.showToast('请先登录');
      return;
    }

    wx.navigateTo({
      url: '/pages/my-dynamics/my-dynamics'
    });
  },

  goToMySubscriptions() {
    if (!this.data.isLogin) {
      request.showToast('请先登录');
      return;
    }

    wx.navigateTo({
      url: '/pages/my-likes/my-likes'
    });
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  goToSwimRecords() {
    wx.navigateTo({
      url: '/pages/swim-records/swim-records'
    });
  },

  onShareAppMessage() {
    return {
      title: '我的主页',
      path: '/pages/mine/mine'
    };
  }
});
