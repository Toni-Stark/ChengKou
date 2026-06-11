Page({
  data: {
    item: null
  },

  onLoad(options) {
    const id = options.id;
    const pages = getCurrentPages();
    if (pages.length > 1) {
      const prevPage = pages[pages.length - 2];
      const feed = prevPage.data.feedCards || prevPage.data.dynamicsList || [];
      const found = feed.find(item => item._id === id);
      if (found) {
        this.setData({ item: found });
      }
    }
  },

  copyContact() {
    const info = this.data.item?.contactInfo || '';
    if (!info) return;
    wx.setClipboardData({
      data: info,
      success() {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  callContact() {
    const info = this.data.item?.contactInfo || '';
    if (!info) return;
    wx.makePhoneCall({ phoneNumber: info });
  },

  onShareAppMessage() {
    const item = this.data.item;
    return {
      title: item?.title || '广告详情',
      path: `/pages/ad-detail/ad-detail?id=${item?._id || ''}`
    };
  }
});
