const util = require('../../utils/util.js');
const request = require('../../utils/request.js');

Component({
  properties: {
    item: {
      type: Object,
      value: {},
      observer(newVal) {
        if (newVal && newVal.createTime) {
          this.setData({
            'item.createTime': util.formatRelativeTime(newVal.createTime)
          });
        }
      }
    },
    showDelete: {
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

    async onLike(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.item;

      // 防止重复点击
      if (this.data.liking) return;

      this.setData({ liking: true });

      try {
        const result = await request.callFunction('toggleLike', {
          targetType: 'dynamic',
          targetId: id
        }, {
          showLoad: false,
          showError: true
        });

        // 更新UI
        const newIsLiked = result.isLiked;
        const likesChange = newIsLiked ? 1 : -1;

        this.setData({
          'item.isLiked': newIsLiked,
          'item.likesCount': (item.likesCount || 0) + likesChange
        });

        // 触发事件通知父组件
        this.triggerEvent('like', {
          id,
          isLiked: newIsLiked,
          likesCount: this.data.item.likesCount
        });

      } catch (error) {
        console.error('点赞失败:', error);
      } finally {
        this.setData({ liking: false });
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
    }
  }
});
