const auth = require('./utils/auth.js');

App({
  globalData: {
    userInfo: null,
    openid: null
  },

  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // ===== 重要：请在此处填写您的云开发环境 ID =====
        // 步骤1：在微信开发者工具顶部点击「云开发」按钮
        // 步骤2：开通云开发（免费），记录下环境 ID（格式：cloud1-xxxxx）
        // 步骤3：取消下一行注释，将 'your-env-id' 替换为您的环境 ID
        env: 'cloud1-8g5xgr7v7d7daeb3',
        traceUser: true
      });
    }

    console.log('小程序启动');
    // 注意：不要在 onLaunch 中检查登录并跳转，这会影响 tabBar 页面的正常显示
    // 改为在各个页面的 onLoad 中检查登录状态
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    const openid = wx.getStorageSync('openid');

    if (userInfo && openid) {
      this.globalData.userInfo = userInfo;
      this.globalData.openid = openid;
      console.log('用户已登录', userInfo);
    } else {
      console.log('用户未登录，需要跳转登录页');
      // 跳转到登录页
      wx.redirectTo({
        url: '/pages/login/login'
      });
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
