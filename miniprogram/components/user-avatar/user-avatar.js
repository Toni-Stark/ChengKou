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

    onImageError() {
      this.setData({
        src: 'cloud://cloud1-8g5xgr7v7d7daeb3.636c-cloud1-8g5xgr7v7d7daeb3-1300466999/dynamics/1767776497389_2711_5.png'
      });
    }
  }
});
