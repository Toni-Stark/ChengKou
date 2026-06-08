const request = require('../../utils/request.js');

Component({
  properties: {
    item: {
      type: Object,
      value: {}
    },
    showDelete: {
      type: Boolean,
      value: false
    },
    showEdit: {
      type: Boolean,
      value: false
    },
    isShow: {
      type: Boolean,
      value: true // 默认显示操作栏
    }
  },

  methods: {
    onUserTap() {
      const userId = this.data.item._openid;
      this.triggerEvent('userTap', { userId });
    },

    onImageTap(e) {
      const index = e.currentTarget.dataset.index;
      const images = e.currentTarget.dataset.images;

      wx.previewImage({
        current: images[index],
        urls: images
      });
    },

    async onSubscribe(e) {
      const item = this.data.item;
      const targetOpenid = item._openid;

      if (this.data.subscribing) return;
      this.setData({ subscribing: true });

      try {
        const result = await request.callFunction('subscribeUser', {
          targetOpenid: targetOpenid
        }, {
          showLoad: false,
          showError: true
        });

        const isSubscribed = result.isSubscribed;

        this.setData({
          'item.isSubscribed': isSubscribed
        });

        this.triggerEvent('subscribe', {
          id: item._id,
          isSubscribed: isSubscribed,
          targetOpenid: targetOpenid
        });

      } catch (error) {
        console.error('订阅失败:', error);
      } finally {
        this.setData({ subscribing: false });
      }
    },

    onComment(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('comment', { id });
    },

    onShare(e) {
      const id = e.currentTarget.dataset.id;
      // 通知父组件保存分享信息，传递完整的动态数据
      this.triggerEvent('share', {
        id,
        item: this.data.item
      });
    },

    onDelete(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('delete', { id });
    },

    onEdit(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('edit', { id });
    }
  }
});
