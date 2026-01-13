const util = require('../../utils/util.js');

Component({
  properties: {
    item: {
      type: Object,
      value: {},
      observer(newVal) {
        if (newVal && newVal.publishTime) {
          this.setData({
            'item.publishTime': util.formatRelativeTime(newVal.publishTime)
          });
        }
      }
    },
    showActions: {
      type: Boolean,
      value: true
    }
  },

  data: {},

  methods: {
    // 卡片点击
    onTap(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('tap', { id });
    },

    // 阻止冒泡
    stopPropagation() {},

    // 图片点击预览
    onImageTap(e) {
      const index = e.currentTarget.dataset.index;
      const images = e.currentTarget.dataset.images;

      wx.previewImage({
        current: images[index],
        urls: images
      });
    },

    // 点赞
    onLike(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('like', { id });
    },

    // 分享
    onShare(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('share', { id });
    }
  }
});
