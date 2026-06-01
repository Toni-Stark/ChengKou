const auth = require('./utils/auth.js');

App({
  globalData: {
    userInfo: null,
    openid: null
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-8g5xgr7v7d7daeb3',
        traceUser: true
      });
    }

    console.log('小程序启动');

    const userInfo = wx.getStorageSync('userInfo');
    const openid = wx.getStorageSync('openid');
    if (userInfo && openid) {
      this.globalData.userInfo = userInfo;
      this.globalData.openid = openid;
    }
  },

  // 保存用户信息
  saveUserInfo(userInfo, openid) {
    this.globalData.userInfo = userInfo;
    this.globalData.openid = openid;
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('openid', openid);
  },

  // 清除用户信息（退出登录）
  clearUserInfo() {
    this.globalData.userInfo = null;
    this.globalData.openid = null;
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('openid');
  }
});
