const request = require('../../utils/request.js');

Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    size: {
      type: String,
      value: 'medium' // small/medium/large
    },
    shape: {
      type: String,
      value: 'circle' // circle/square
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap');
    },

    async onImageError() {
      // 图片加载失败时，转换默认占位图
      const defaultImage = 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png';
      try {
        const convertedUrl = await request.getTempFileURL(defaultImage);
        this.setData({
          src: convertedUrl
        });
      } catch (error) {
        console.error('转换默认头像URL失败:', error);
        this.setData({
          src: defaultImage
        });
      }
    }
  }
});
