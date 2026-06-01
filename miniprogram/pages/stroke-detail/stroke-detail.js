const strokes = require('../../data/strokes.js');

Page({
  data: {
    stroke: null
  },

  onLoad(options) {
    const { id } = options;
    const stroke = strokes.find(s => s.id === id);
    if (stroke) {
      wx.setNavigationBarTitle({ title: stroke.name });
      this.setData({ stroke });
    }
  }
});
