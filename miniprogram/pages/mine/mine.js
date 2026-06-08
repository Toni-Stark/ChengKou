const auth = require('../../utils/auth.js');
const request = require('../../utils/request.js');

Page({
  data: {
    userInfo: {},
    isLogin: false,
    todayChecked: false,
    todayDistance: 0,
    monthActiveDays: 0,
    monthDistance: 0
  },

  onLoad() {},

  onShow() {
    this.loadUserInfo();
    this.loadSwimStats();
  },

  async loadSwimStats() {
    const stored = auth.getStoredUserInfo();
    if (!stored.openid) return;

    try {
      if (!wx.cloud || !wx.cloud.callFunction) return;
      const now = new Date();
      const result = await request.callFunction('getCheckIns', {
        year: now.getFullYear(),
        month: now.getMonth() + 1
      }, { showLoad: false, showError: false });

      const records = result?.records || {};
      const today = now.getDate();
      let activeDays = 0;
      let totalDist = 0;
      Object.keys(records).forEach(d => {
        const dist = records[d]?.distance || 0;
        if (dist > 0) { activeDays++; totalDist += dist; }
      });

      let streak = 0;
      for (let d = today; d >= 1; d--) {
        if ((records[d]?.distance || 0) > 0) streak++; else break;
      }

      this.setData({
        todayChecked: !!records[today],
        todayDistance: records[today]?.distance || 0,
        monthActiveDays: activeDays,
        monthDistance: totalDist,
        currentStreak: streak
      });
    } catch (e) {
      console.warn('加载游泳数据失败:', e);
    }
  },

  async loadUserInfo(forceRefresh = false) {
    const app = getApp();
    if (!forceRefresh && app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo, isLogin: true });
      return;
    }

    const stored = auth.getStoredUserInfo();
    if (stored.userInfo && stored.openid) {
      try {
        if (!wx.cloud || !wx.cloud.callFunction) {
          this.setData({ userInfo: stored.userInfo, isLogin: true });
          return;
        }
        const result = await request.callFunction('getUserInfo', {}, { showLoad: true });
        auth.saveUserInfo(result, stored.openid);
        this.setData({ userInfo: result, isLogin: true });
      } catch (error) {
        this.setData({ userInfo: stored.userInfo, isLogin: true });
      }
    } else {
      this.setData({
        userInfo: {
          nickName: '未登录',
          avatarUrl: 'http://tg00h6qkg.hn-bkt.clouddn.com/common/default-avatar.png',
          signature: '点击登录，开启游泳之旅',
          stats: { dynamicsCount: 0, followersCount: 0, subscriptionsCount: 0 }
        },
        isLogin: false
      });
    }
  },

  goToLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  editProfile() {
    if (!this.data.isLogin) { request.showToast('请先登录'); return; }
    wx.navigateTo({ url: '/pages/edit-profile/edit-profile' });
  },

  goToSwimRecords() {
    wx.navigateTo({ url: '/pages/swim-records/swim-records' });
  },

  goToMyDynamics() {
    if (!this.data.isLogin) { request.showToast('请先登录'); return; }
    wx.navigateTo({ url: '/pages/my-dynamics/my-dynamics' });
  },

  goToMySubscriptions() {
    if (!this.data.isLogin) { request.showToast('请先登录'); return; }
    wx.navigateTo({ url: '/pages/my-likes/my-likes' });
  },

  goToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  onShareAppMessage() {
    return { title: '我的主页', path: '/pages/mine/mine' };
  }
});
