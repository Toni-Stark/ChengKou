Page({
  data: {
    item: null
  },

  onLoad(options) {
    const id = options.id;
    const pages = getCurrentPages();
    if (pages.length > 1) {
      const prevPage = pages[pages.length - 2];
      const list = prevPage.data.officialList || [];
      const found = list.find(item => item._id === id);
      if (found) {
        this.setData({ item: found });
      }
    }
  },

  onShareAppMessage() {
    const item = this.data.item;
    return {
      title: item?.title || '官方公告',
      path: `/pages/official-detail/official-detail?id=${item?._id || ''}`
    };
  }
});
