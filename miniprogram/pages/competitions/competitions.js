const request = require('../../utils/request.js');

Page({
  data: {
    competitions: []
  },

  onLoad() {
    this.loadCompetitions();
  },

  onShow() {
    this.loadCompetitions();
  },

  async loadCompetitions() {
    try {
      const result = await request.callFunction('getCompetitions', {}, { showLoad: false, showError: false });
      const list = result?.list || [];
      this.setData({ competitions: list });
    } catch (e) {
      console.warn('加载公开赛失败:', e);
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/competition-detail/competition-detail?id=${id}&index=${index}`
    });
  }
});
