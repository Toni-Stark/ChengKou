Page({
  data: {
    competition: null
  },

  onLoad(options) {
    const id = options.id;
    const index = parseInt(options.index);
    const pages = getCurrentPages();
    if (pages.length > 1) {
      const listPage = pages[pages.length - 2];
      const competitions = listPage.data.competitions || [];
      if (competitions[index]) {
        this.setData({ competition: competitions[index] });
      }
    }
  }
});
